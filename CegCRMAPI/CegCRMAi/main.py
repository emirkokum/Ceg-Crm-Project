import os
from typing import Any
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlmodel import SQLModel, Field, create_engine, Session
from sqlalchemy import Column, text as sa_text
from dotenv import load_dotenv

from pgvector.sqlalchemy import Vector
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import PGVector
from langchain.chains import ConversationalRetrievalChain
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import HuggingFacePipeline
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# Load .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

# Initialize FastAPI
app = FastAPI()

# Define DB Table
class DocChunk(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    text: str
    vector: Any = Field(sa_column=Column("vector", Vector(dim=768)))

    class Config:
        arbitrary_types_allowed = True

SQLModel.metadata.create_all(engine)

# Daha güçlü embedding modeli
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)
vectorstore = PGVector(
    connection_string=DATABASE_URL,
    embedding_function=embeddings,
    collection_name="docchunk"
)

# En hızlı LLM modeli (CPU için optimize)
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
pipe = pipeline(
    "text2text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=200,  # max_length yerine max_new_tokens kullan
    temperature=0.1,  # Daha tutarlı yanıtlar için
    top_p=0.9,
    do_sample=True,
    truncation=True,  # Token length sorununu çöz
)
llm = HuggingFacePipeline(pipeline=pipe)

# İngilizce optimized Prompt Template
prompt = PromptTemplate(
    input_variables=["question", "context"],
    template="""You are a helpful customer service assistant. Use the following context to answer the question accurately and helpfully.

Context:
{context}

Question: {question}

Instructions:
- If the context contains relevant information, provide a detailed and helpful answer based on that information
- If the context doesn't contain relevant information, say "I'm sorry, I couldn't find information about that in our knowledge base"
- Keep your answer concise but complete
- Answer in English

Answer:"""
)

# Optimize edilmiş QA Chain
retriever = vectorstore.as_retriever(
    search_type="similarity",  # threshold kaldırıldı, daha esnek arama
    search_kwargs={
        "k": 5,  # Daha az chunk (token limit için)
    }
)
qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    combine_docs_chain_kwargs={"prompt": prompt},
    return_source_documents=False,
)

# Upload Endpoint
@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt files are supported.")
    
    content = await file.read()
    try:
        text = content.decode("utf-8", errors="ignore")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File decoding failed.")
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_text(text)

    if not chunks:
        raise HTTPException(status_code=400, detail="Document is empty after splitting.")
    
    metadatas = [{"source_file": file.filename} for _ in chunks]

    with Session(engine) as session:
        vectorstore.add_texts(texts=chunks, metadatas=metadatas)

    return {
        "chunks": len(chunks),
        "status": "indexed",
        "source_file": file.filename
    }

# Predict Endpoint
class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    suggestion: str

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Question text cannot be empty.")
    
    result = qa_chain.invoke({"question": request.text, "chat_history": []})
    return PredictResponse(suggestion=result["answer"])

# Debug endpoint - Retrieval test
class DebugPredictResponse(BaseModel):
    question: str
    suggestion: str
    retrieved_chunks: list
    chunk_count: int

@app.post("/predict-debug", response_model=DebugPredictResponse)
async def predict_debug(request: PredictRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Question text cannot be empty.")
    
    # Retrieval test
    docs = retriever.get_relevant_documents(request.text)
    retrieved_chunks = []
    for i, doc in enumerate(docs):
        retrieved_chunks.append({
            "chunk_id": i + 1,
            "content": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
            "metadata": doc.metadata,
            "full_length": len(doc.page_content)
        })
    
    # QA Chain
    result = qa_chain.invoke({"question": request.text, "chat_history": []})
    
    return DebugPredictResponse(
        question=request.text,
        suggestion=result["answer"],
        retrieved_chunks=retrieved_chunks,
        chunk_count=len(docs)
    )

# List Documents
@app.get("/documents")
def list_documents():
    with engine.connect() as conn:
        result = conn.execute(sa_text("""
            SELECT 
                cmetadata->>'source_file' AS file_name,
                MIN(created_at) AS first_uploaded,
                COUNT(*) AS chunk_count
            FROM langchain_pg_embedding
            WHERE cmetadata->>'source_file' IS NOT NULL
            GROUP BY cmetadata->>'source_file'
            ORDER BY first_uploaded DESC
        """)).fetchall()

    return {
        "documents": [
            {
                "file_name": row[0],
                "uploaded_at": row[1].isoformat() if row[1] else None,
                "chunk_count": row[2]
            }
            for row in result
        ]
    }

# Delete Document
@app.delete("/documents/{file_name}")
def delete_document_by_file_name(file_name: str):
    with engine.connect() as conn:
        check = conn.execute(sa_text("""
            SELECT COUNT(*) FROM langchain_pg_embedding
            WHERE cmetadata->>'source_file' = :file_name
        """), {"file_name": file_name}).scalar()

        if check == 0:
            raise HTTPException(status_code=404, detail="No document found with the given file name.")

        conn.execute(sa_text("""
            DELETE FROM langchain_pg_embedding
            WHERE cmetadata->>'source_file' = :file_name
        """), {"file_name": file_name})
        conn.commit()

    return {"status": f"All embeddings for '{file_name}' have been deleted."}

import os
from typing import Any
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
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

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from langchain_community.llms import HuggingFacePipeline

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DocChunk(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    text: str
    vector: Any = Field(sa_column=Column("vector", Vector(dim=1536)))

    class Config:
        arbitrary_types_allowed = True

SQLModel.metadata.create_all(engine)

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

vectorstore = PGVector(
    connection_string=DATABASE_URL,
    embedding_function=embeddings,
    collection_name="docchunk"
)

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
pipe = pipeline("text2text-generation", model=model, tokenizer=tokenizer, max_length=128)
llm = HuggingFacePipeline(pipeline=pipe)

template = """
You are a helpful AI assistant. A user has asked a question, and below are some documents that may contain the answer. Based on the context, give a clear and helpful response.

Question: {question}

Context:
{context}

Answer:
"""

prompt = PromptTemplate(
    input_variables=["question", "context"],
    template=template
)

retriever = vectorstore.as_retriever()
qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    combine_docs_chain_kwargs={"prompt": prompt},
    return_source_documents=False,
)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = splitter.split_text(text)

    metadatas = [{"source_file": file.filename} for _ in chunks]

    with Session(engine) as session:
        vectorstore.add_texts(texts=chunks, metadatas=metadatas)

    return {"chunks": len(chunks), "status": "indexed", "source_file": file.filename}


class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    suggestion: str

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    result = qa_chain.invoke({"question": request.text, "chat_history": []})
    return PredictResponse(suggestion=result["answer"])


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
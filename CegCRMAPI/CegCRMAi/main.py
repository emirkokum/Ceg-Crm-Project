from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from schemas import PredictRequest, PredictResponse

app = FastAPI()

# CORS ayarları (React veya diğer istemcilerden gelen istekler için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_name = "google/flan-t5-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    prompt = f"""
        You are an expert technical support assistant working for a CRM system. Given a user's issue, respond with a polite and clear step-by-step solution.

        Example:
        User: I can't login to the system.
        Assistant: Please check your email and password for accuracy. If you've forgotten your password, try resetting it. Still not working? Contact support.

        User: CRM is loading slowly.
        Assistant: Clear your browser cache and cookies, and try again using the latest version of Chrome or Firefox.

        User: {request.text}
        Assistant:
        """

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_new_tokens=128,
        num_beams=2,
        repetition_penalty=1.1,
        eos_token_id=tokenizer.eos_token_id
    )

    suggestion = tokenizer.decode(outputs[0], skip_special_tokens=True)

    print("📤 PROMPT:", prompt)
    print("🧠 RAW OUTPUT:", suggestion)

    return PredictResponse(suggestion=suggestion)

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from schemas import PredictRequest, PredictResponse

app = FastAPI()

# CORS (isteğe bağlı, frontend ile konuşacaksa)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Prod'da domain ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    description = request.text

    # Şimdilik simülasyon
    fake_solution = f"AI çözüm önerisi: '{description}' için sistem ayarlarını kontrol edin."
    
    return PredictResponse(suggestion=fake_solution)

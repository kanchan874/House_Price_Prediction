import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add the parent directory of backend/app to the path to enable absolute imports from app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.api import prediction, explanation, model_info
from app.models.model_loader import load_all_artifacts

app = FastAPI(
    title="House Price Prediction XAI API",
    description="API for prediction, explainability, and what-if analysis of house prices.",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts on server startup
@app.on_event("startup")
def startup_event():
    print("Starting FastAPI server...")
    success = load_all_artifacts()
    if success:
        print("All model artifacts and metadata loaded successfully.")
    else:
        print("Warning: Model artifacts could not be loaded. Please ensure the model training pipeline has run.")

# Mount routers
app.include_router(prediction.router, prefix="/api", tags=["Prediction & What-If"])
app.include_router(explanation.router, prefix="/api", tags=["Explainability (XAI)"])
app.include_router(model_info.router, prefix="/api", tags=["Model Information"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the House Price Prediction XAI API. Go to /docs for Swagger documentation.",
        "documentation": "/docs"
    }

from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.models.model_loader import get_metrics, get_importance, get_metadata

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "House Price Prediction XAI Backend"}

@router.get("/model-metrics")
def handle_metrics():
    try:
        return get_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch model metrics: {str(e)}")

@router.get("/feature-importance")
def handle_feature_importance():
    try:
        return get_importance()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch feature importance: {str(e)}")

@router.get("/feature-metadata")
def handle_feature_metadata():
    try:
        return get_metadata()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch feature metadata: {str(e)}")

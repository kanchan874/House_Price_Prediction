from fastapi import APIRouter, HTTPException
from app.models.schemas import PredictionRequest, PredictionResponse, WhatIfRequest, WhatIfResponse
from app.services.prediction_service import predict_price
from app.utils.helpers import format_indian_currency, format_lakhs_or_crores

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def handle_prediction(payload: PredictionRequest):
    try:
        return predict_price(payload.model_name, payload.features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.post("/what-if", response_model=WhatIfResponse)
def handle_what_if(payload: WhatIfRequest):
    try:
        orig = predict_price(payload.model_name, payload.original_features)
        mod = predict_price(payload.model_name, payload.modified_features)
        
        diff = mod.predicted_price - orig.predicted_price
        pct_diff = 0.0
        if orig.predicted_price > 0:
            pct_diff = (diff / orig.predicted_price) * 100.0
            
        direction = "no_change"
        if diff > 100:  # Threshold of 100 Rupees
            direction = "increase"
        elif diff < -100:
            direction = "decrease"
            
        return WhatIfResponse(
            original_price=orig.predicted_price,
            original_formatted=orig.formatted_price,
            original_formatted_lakhs=orig.formatted_lakhs,
            modified_price=mod.predicted_price,
            modified_formatted=mod.formatted_price,
            modified_formatted_lakhs=mod.formatted_lakhs,
            absolute_difference=diff,
            formatted_difference=format_lakhs_or_crores(diff),
            percentage_difference=pct_diff,
            direction=direction
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"What-If analysis error: {str(e)}")

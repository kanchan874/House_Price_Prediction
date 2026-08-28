from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
import numpy as np

from app.models.schemas import PredictionRequest, ExplanationResponse
from app.services.explanation_service import get_local_explanation
from app.models.model_loader import get_metadata
from app.services.prediction_service import predict_price
from app.models.schemas import HouseFeatures

router = APIRouter()

@router.post("/explain", response_model=ExplanationResponse)
def handle_explanation(payload: PredictionRequest):
    try:
        return get_local_explanation(payload.model_name, payload.features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation error: {str(e)}")

@router.get("/feature-effect/{feature_name}")
def handle_feature_effect(
    feature_name: str,
    model_name: str = Query(..., description="Model to use")
):
    try:
        metadata = get_metadata()
        if feature_name not in metadata:
            raise HTTPException(status_code=400, detail=f"Invalid feature name: {feature_name}")
            
        feat_meta = metadata[feature_name]
        
        # Build baseline house features using default values from metadata
        base_features_dict = {}
        for col, col_meta in metadata.items():
            base_features_dict[col] = col_meta['default']
            
        points = []
        
        if feat_meta['type'] == 'numeric':
            # Generate 20 points between min and max
            val_min = feat_meta['min']
            val_max = feat_meta['max']
            # Avoid division by zero
            if val_min == val_max:
                points_to_eval = [val_min]
            else:
                points_to_eval = np.linspace(val_min, val_max, 20).tolist()
                
            for pt in points_to_eval:
                # Update only the target feature
                eval_dict = base_features_dict.copy()
                eval_dict[feature_name] = float(pt)
                
                # Predict
                try:
                    feat_inst = HouseFeatures(**eval_dict)
                    pred_res = predict_price(model_name, feat_inst)
                    points.append({
                        'x': float(pt),
                        'y': float(pred_res.predicted_price),
                        'y_formatted': pred_res.formatted_lakhs
                    })
                except Exception as ex:
                    print(f"Skipping point {pt} due to error: {ex}")
                    
        elif feat_meta['type'] == 'categorical':
            # Evaluate each category
            for cat in feat_meta['categories']:
                eval_dict = base_features_dict.copy()
                eval_dict[feature_name] = str(cat)
                
                try:
                    feat_inst = HouseFeatures(**eval_dict)
                    pred_res = predict_price(model_name, feat_inst)
                    points.append({
                        'x': str(cat),
                        'y': float(pred_res.predicted_price),
                        'y_formatted': pred_res.formatted_lakhs
                    })
                except Exception as ex:
                    print(f"Skipping category {cat} due to error: {ex}")
                    
        return {
            'feature': feature_name,
            'type': feat_meta['type'],
            'model_name': model_name,
            'effect_data': points
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature-effect calculation error: {str(e)}")

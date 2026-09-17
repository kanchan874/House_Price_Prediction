import numpy as np
from app.models.schemas import HouseFeatures, PredictionResponse
from app.models.model_loader import get_model
from app.services.preprocessing_service import preprocess_features
from app.utils.helpers import format_indian_currency, format_lakhs_or_crores

def predict_price(model_name: str, features: HouseFeatures) -> PredictionResponse:
    # 1. Preprocess raw features
    df_preprocessed = preprocess_features(features)
    
    # 2. Get the requested model
    model = get_model(model_name)
    
    # 3. Predict price
    raw_prediction = float(model.predict(df_preprocessed)[0])
    
    # 4. Get baseline price (intercept/expected value)
    baseline_price = 0.0
    if model_name == 'Explainable Boosting Machine':
        if hasattr(model.intercept_, '__getitem__') or isinstance(model.intercept_, (list, np.ndarray)):
            baseline_price = float(model.intercept_[0])
        else:
            baseline_price = float(model.intercept_)
    elif model_name == 'Linear Regression':
        baseline_price = float(model.intercept_)
    elif model_name == 'Random Forest':
        # Fast baseline for RF (dataset target mean in INR)
        baseline_price = 180921.0 * 83.0
            
    # Clean negative predictions (housing prices can't be negative)
    if raw_prediction < 0:
        raw_prediction = 100_000.0  # fallback to a minimum 1 Lakh
        
    return PredictionResponse(
        predicted_price=raw_prediction,
        formatted_price=format_indian_currency(raw_prediction),
        formatted_lakhs=format_lakhs_or_crores(raw_prediction),
        model_name=model_name,
        baseline_price=baseline_price
    )

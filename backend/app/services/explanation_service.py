import numpy as np
import pandas as pd
from typing import List, Dict, Any
try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

from app.models.schemas import HouseFeatures, FeatureContribution, ExplanationResponse
from app.models.model_loader import get_model, get_metadata
from app.services.preprocessing_service import preprocess_features
from app.utils.helpers import format_indian_currency, format_lakhs_or_crores
from ml.preprocess import NUM_FEATURES, CAT_FEATURES

def map_feature_display_name(feature_name: str) -> str:
    """Maps internal feature names to human-readable names for UI display."""
    mapping = {
        'OverallQual': 'Overall Quality',
        'GrLivArea': 'Living Area',
        'YearBuilt': 'Year Built',
        'YearRemodAdd': 'Year Remodeled',
        'TotalBsmtSF': 'Basement Area',
        'GarageCars': 'Garage Capacity (Cars)',
        'GarageArea': 'Garage Area',
        'FullBath': 'Bathrooms',
        'BedroomAbvGr': 'Bedrooms',
        'TotRmsAbvGrd': 'Total Rooms',
        'Fireplaces': 'Fireplaces',
        '1stFlrSF': '1st Floor Area',
        '2ndFlrSF': '2nd Floor Area',
        'LotArea': 'Lot Area',
        'Neighborhood': 'Neighborhood'
    }
    return mapping.get(feature_name, feature_name)

def generate_natural_language_explanation(
    predicted_price: float,
    baseline_price: float,
    contributions: List[FeatureContribution]
) -> str:
    """Generates a scientifically sound natural-language explanation.
    
    Avoids causal terminology and emphasizes correlation, model associations,
    and contributions relative to the model baseline.
    """
    # Sort contributions by absolute value to find most influential features
    sorted_contribs = sorted(contributions, key=lambda x: abs(x.contribution), reverse=True)
    
    positives = [c for c in contributions if c.contribution > 5000] # Ignore tiny contributions
    negatives = [c for c in contributions if c.contribution < -5000]
    
    top_pos = sorted([c for c in positives], key=lambda x: x.contribution, reverse=True)[:3]
    top_neg = sorted([c for c in negatives], key=lambda x: x.contribution)[:2]
    
    pred_str = format_lakhs_or_crores(predicted_price)
    base_str = format_lakhs_or_crores(baseline_price)
    diff = predicted_price - baseline_price
    diff_str = format_lakhs_or_crores(abs(diff))
    
    intro = (
        f"The model predicts an estimated house price of {pred_str}, which is "
        f"{'higher' if diff >= 0 else 'lower'} than the average model baseline of {base_str} "
        f"by approximately {diff_str}. "
    )
    
    pos_text = ""
    if top_pos:
        pos_names = [f"'{map_feature_display_name(c.feature)}' (contributing {c.formatted_contribution})" for c in top_pos]
        if len(pos_names) == 1:
            pos_text = f"The model associates this price primarily with a positive contribution from {pos_names[0]}. "
        else:
            pos_text = f"The primary factors increasing the predicted price relative to the baseline are {', '.join(pos_names[:-1])} and {pos_names[-1]}. "
            
    neg_text = ""
    if top_neg:
        neg_names = [f"'{map_feature_display_name(c.feature)}' (contributing {c.formatted_contribution})" for c in top_neg]
        if len(neg_names) == 1:
            neg_text = f"Conversely, {neg_names[0]} has a notable negative contribution to this prediction."
        else:
            neg_text = f"Conversely, the main negative contributors reducing the prediction are {', '.join(neg_names[:-1])} and {neg_names[-1]}."
            
    if not pos_text and not neg_text:
        conclusion = "The input features are close to average characteristics, resulting in a prediction near the baseline."
    else:
        conclusion = "These contributions describe how the model combines housing features to form its prediction, rather than establishing real-world causality."
        
    explanation = f"{intro}{pos_text}{neg_text} {conclusion}"
    return explanation

def get_local_explanation(model_name: str, features: HouseFeatures) -> ExplanationResponse:
    # 1. Preprocess raw features
    df_preproc = preprocess_features(features)
    raw_row_vals = df_preproc.iloc[0].values
    col_names = df_preproc.columns.tolist()
    
    # 2. Load model
    model = get_model(model_name)
    
    # 3. Predict and get baseline
    raw_prediction = float(model.predict(df_preproc)[0])
    if raw_prediction < 0:
        raw_prediction = 100_000.0  # Min fallback
        
    baseline_price = 0.0
    scores = []
    
    if model_name == 'Explainable Boosting Machine':
        if hasattr(model.intercept_, '__getitem__') or isinstance(model.intercept_, (list, np.ndarray)):
            baseline_price = float(model.intercept_[0])
        else:
            baseline_price = float(model.intercept_)
        # EBM explain_local
        ebm_local = model.explain_local(df_preproc)
        scores = ebm_local.data(0)['scores']
        
    elif model_name == 'Linear Regression':
        baseline_price = float(model.intercept_)
        # LR local contribution is coef * preprocessed_value
        scores = model.coef_ * raw_row_vals
        
    elif model_name == 'Random Forest':
        scores = []
        if HAS_SHAP:
            try:
                explainer = shap.TreeExplainer(model)
                shap_values = explainer.shap_values(df_preproc)
                scores = shap_values[0].tolist()
                baseline_price = float(explainer.expected_value[0])
            except Exception as e:
                print(f"SHAP explanation failed, falling back: {e}")
                scores = []
        
        if not scores:
            # Fallback baseline
            baseline_price = 180921.0 * 83.0
            # Distribute prediction difference proportionally to RF feature importances as a fallback explanation
            from app.models.model_loader import get_importance
            importances = get_importance().get('Random Forest', [])
            total_diff = raw_prediction - baseline_price
            scores = [0.0] * len(col_names)
            # Find matching importance
            imp_dict = {item['feature']: item['importance'] for item in importances}
            for idx, col in enumerate(col_names):
                clean_name = col.split('__')[-1].split('_')[0]
                imp = imp_dict.get(clean_name, 0.0)
                scores[idx] = total_diff * imp
                
    # 4. Map preprocessed column scores back to original feature names
    aggregated_scores = {}
    for col_name, score in zip(col_names, scores):
        # Strip prefix num__ or cat__
        clean_name = col_name
        if '__' in col_name:
            clean_name = col_name.split('__')[-1]
            
        # Group one-hot categories under original features
        parent_feature = clean_name
        for cat_col in CAT_FEATURES:
            if clean_name.startswith(cat_col + '_'):
                parent_feature = cat_col
                break
                
        aggregated_scores[parent_feature] = aggregated_scores.get(parent_feature, 0.0) + score
        
    # 5. Build FeatureContribution objects
    contributions = []
    feature_dict = features.model_dump(by_alias=True)
    
    for feat, score in aggregated_scores.items():
        # Get formatted original value of this feature
        orig_val = feature_dict.get(feat)
        if isinstance(orig_val, float):
            val_str = f"{orig_val:,.1f}"
        elif isinstance(orig_val, int):
            val_str = f"{orig_val:,}"
        else:
            val_str = str(orig_val)
            
        # Format direction
        if score > 100:  # Threshold of 100 Rupees
            direction = "positive"
            formatted_score = f"+{format_lakhs_or_crores(score)}"
        elif score < -100:
            direction = "negative"
            formatted_score = format_lakhs_or_crores(score)  # will include negative sign
        else:
            direction = "neutral"
            formatted_score = "₹0"
            
        contributions.append(
            FeatureContribution(
                feature=feat,
                value=val_str,
                contribution=float(score),
                formatted_contribution=formatted_score,
                direction=direction
            )
        )
        
    # Sort contributions by absolute value to make it cleaner
    contributions = sorted(contributions, key=lambda x: abs(x.contribution), reverse=True)
    
    # 6. Extract positive/negative lists for schema
    pos_contributors = [map_feature_display_name(c.feature) for c in contributions if c.direction == "positive"]
    neg_contributors = [map_feature_display_name(c.feature) for c in contributions if c.direction == "negative"]
    
    # 7. Generate natural language explanation
    explanation_text = generate_natural_language_explanation(raw_prediction, baseline_price, contributions)
    
    return ExplanationResponse(
        predicted_price=raw_prediction,
        formatted_price=format_indian_currency(raw_prediction),
        formatted_lakhs=format_lakhs_or_crores(raw_prediction),
        model_name=model_name,
        baseline_price=baseline_price,
        formatted_baseline=format_lakhs_or_crores(baseline_price),
        contributions=contributions,
        positive_contributors=pos_contributors,
        negative_contributors=neg_contributors,
        explanation_text=explanation_text
    )

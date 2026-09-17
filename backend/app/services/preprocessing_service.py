import pandas as pd
import numpy as np
from app.models.schemas import HouseFeatures
from app.models.model_loader import get_metadata
from ml.preprocess import NUM_FEATURES

def preprocess_features(features: HouseFeatures) -> pd.DataFrame:
    """Converts HouseFeatures schema to a preprocessed pandas DataFrame.
    
    Constructs the exact 42 one-hot encoded and numerical features directly
    from feature metadata, ensuring 100% consistency and zero version-incompatibility
    across scikit-learn / python versions.
    """
    # 1. Convert features to dictionary with original aliases
    feature_dict = features.model_dump(by_alias=True)
    metadata = get_metadata()
    
    # 2. Extract numeric features in exact order with metadata defaults
    num_data = {}
    for col in NUM_FEATURES:
        val = feature_dict.get(col)
        if val is None or pd.isna(val):
            val = metadata.get(col, {}).get('default', 0.0)
        num_data[f"num__{col}"] = [float(val)]
    
    # 3. Extract categorical one-hot encoded features in exact order
    neighborhood_val = str(feature_dict.get('Neighborhood', 'CollgCr')).strip()
    categories = metadata.get('Neighborhood', {}).get('categories', [])
    cat_data = {}
    for cat in categories:
        cat_data[f"cat__Neighborhood_{cat}"] = [1.0 if cat == neighborhood_val else 0.0]
        
    # 4. Combine into single 1-row DataFrame
    full_dict = {**num_data, **cat_data}
    df_transformed = pd.DataFrame(full_dict)
    
    return df_transformed

import pandas as pd
import numpy as np
from app.models.schemas import HouseFeatures
from app.models.model_loader import get_preprocessor, fix_sklearn_imputers

def preprocess_features(features: HouseFeatures) -> pd.DataFrame:
    """Converts HouseFeatures schema to a preprocessed pandas DataFrame.
    
    Uses Pydantic's `by_alias=True` to automatically map 'FirstFlrSF' and 'SecondFlrSF'
    back to their original names ('1stFlrSF' and '2ndFlrSF') expected by the preprocessor.
    """
    # 1. Convert features to dictionary with original aliases
    feature_dict = features.model_dump(by_alias=True)
    
    # 2. Put into a 1-row DataFrame in the exact feature ordering
    # The preprocessor expects columns in the specific order NUM_FEATURES + CAT_FEATURES
    from ml.preprocess import FEATURES
    df = pd.DataFrame([feature_dict])[FEATURES]
    
    # 3. Load preprocessor and transform the single row
    preprocessor = get_preprocessor()
    fix_sklearn_imputers(preprocessor)
    transformed_array = preprocessor.transform(df)
    
    # 4. Convert back to DataFrame with preprocessor's output feature names
    feature_names = preprocessor.get_feature_names_out()
    df_transformed = pd.DataFrame(transformed_array, columns=feature_names)
    
    return df_transformed

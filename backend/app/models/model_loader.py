import os
import joblib
import json

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'artifacts')

# Caches
_models = {}
_preprocessor = None
_metadata = None
_metrics = None
_importance = None

def get_model(model_name: str):
    """Loads and caches the requested ML model."""
    name_mapping = {
        'Explainable Boosting Machine': 'ebm_model.pkl',
        'Linear Regression': 'lr_model.pkl',
        'Random Forest': 'rf_model.pkl'
    }
    
    file_name = name_mapping.get(model_name)
    if not file_name:
        raise ValueError(f"Unknown model name: {model_name}. Choose from EBM, Linear Regression, or Random Forest.")
        
    if model_name not in _models:
        path = os.path.join(ARTIFACTS_DIR, file_name)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file {file_name} not found. Please train models first using backend/ml/train.py.")
        _models[model_name] = joblib.load(path)
        print(f"Loaded and cached model: {model_name}")
        
    return _models[model_name]

def get_preprocessor():
    """Loads and caches the data preprocessor."""
    global _preprocessor
    if _preprocessor is None:
        path = os.path.join(ARTIFACTS_DIR, 'preprocessor.pkl')
        if not os.path.exists(path):
            raise FileNotFoundError("Preprocessor file preprocessor.pkl not found. Please preprocess data first.")
        _preprocessor = joblib.load(path)
        print("Loaded and cached preprocessor.")
    return _preprocessor

def get_metadata():
    """Loads and caches the feature metadata (categories and ranges)."""
    global _metadata
    if _metadata is None:
        path = os.path.join(ARTIFACTS_DIR, 'feature_metadata.json')
        if not os.path.exists(path):
            raise FileNotFoundError("Feature metadata file feature_metadata.json not found.")
        with open(path, 'r') as f:
            _metadata = json.load(f)
        print("Loaded and cached feature metadata.")
    return _metadata

def get_metrics():
    """Loads and caches model evaluation metrics."""
    global _metrics
    if _metrics is None:
        path = os.path.join(ARTIFACTS_DIR, 'metrics.json')
        if not os.path.exists(path):
            # Return dummy metrics if not trained yet
            return {}
        with open(path, 'r') as f:
            _metrics = json.load(f)
        print("Loaded and cached model metrics.")
    return _metrics

def get_importance():
    """Loads and caches global feature importances."""
    global _importance
    if _importance is None:
        path = os.path.join(ARTIFACTS_DIR, 'feature_importance.json')
        if not os.path.exists(path):
            return {}
        with open(path, 'r') as f:
            _importance = json.load(f)
        print("Loaded and cached global feature importances.")
    return _importance

def load_all_artifacts():
    """Forces loading of all artifacts. Used on server startup."""
    try:
        get_preprocessor()
        get_metadata()
        get_metrics()
        get_importance()
        for name in ['Explainable Boosting Machine', 'Linear Regression', 'Random Forest']:
            get_model(name)
        return True
    except Exception as e:
        print(f"Warning: Failed to load some artifacts during startup: {e}")
        return False

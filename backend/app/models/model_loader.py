import os
import joblib
import json

def find_artifacts_dir():
    """Finds the artifacts directory across local and serverless Vercel environments."""
    candidates = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'artifacts')),
        os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'api', 'artifacts')),
        os.path.abspath(os.path.join(os.getcwd(), 'api', 'artifacts')),
        os.path.abspath(os.path.join(os.getcwd(), 'backend', 'artifacts')),
        os.path.abspath(os.path.join(os.getcwd(), 'artifacts'))
    ]
    for path in candidates:
        if os.path.exists(path) and os.path.exists(os.path.join(path, 'feature_metadata.json')):
            return path
    return candidates[0]

ARTIFACTS_DIR = find_artifacts_dir()

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
            # Try finding artifacts dir dynamically
            dynamic_dir = find_artifacts_dir()
            path = os.path.join(dynamic_dir, file_name)
            
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file {file_name} not found at {path}.")
            
        _models[model_name] = joblib.load(path)
        print(f"Loaded and cached model: {model_name}")
        
    return _models[model_name]

def get_preprocessor():
    """Loads and caches the data preprocessor."""
    global _preprocessor
    if _preprocessor is None:
        path = os.path.join(find_artifacts_dir(), 'preprocessor.pkl')
        if not os.path.exists(path):
            raise FileNotFoundError(f"Preprocessor file preprocessor.pkl not found at {path}.")
        _preprocessor = joblib.load(path)
        print("Loaded and cached preprocessor.")
    return _preprocessor

def get_metadata():
    """Loads and caches the feature metadata (categories and ranges)."""
    global _metadata
    if _metadata is None:
        path = os.path.join(find_artifacts_dir(), 'feature_metadata.json')
        if not os.path.exists(path):
            raise FileNotFoundError(f"Feature metadata file feature_metadata.json not found at {path}.")
        with open(path, 'r') as f:
            _metadata = json.load(f)
        print("Loaded and cached feature metadata.")
    return _metadata

def get_metrics():
    """Loads and caches model evaluation metrics."""
    global _metrics
    if _metrics is None:
        path = os.path.join(find_artifacts_dir(), 'metrics.json')
        if not os.path.exists(path):
            return {}
        with open(path, 'r') as f:
            _metrics = json.load(f)
        print("Loaded and cached model metrics.")
    return _metrics

def get_importance():
    """Loads and caches global feature importances."""
    global _importance
    if _importance is None:
        path = os.path.join(find_artifacts_dir(), 'feature_importance.json')
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

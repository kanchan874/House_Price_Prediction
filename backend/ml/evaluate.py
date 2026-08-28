import os
import json
import joblib

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'artifacts')

def verify_saved_artifacts():
    print("Verifying saved model artifacts...")
    
    required_files = [
        'preprocessor.pkl',
        'ebm_model.pkl',
        'lr_model.pkl',
        'rf_model.pkl',
        'metrics.json',
        'feature_importance.json',
        'feature_metadata.json'
    ]
    
    missing = []
    for file in required_files:
        path = os.path.join(ARTIFACTS_DIR, file)
        if not os.path.exists(path):
            missing.append(file)
            
    if missing:
        print(f"FAILED: Missing artifacts: {missing}")
        return False
        
    print("SUCCESS: All artifact files exist on disk.")
    
    # Print metrics
    metrics_path = os.path.join(ARTIFACTS_DIR, 'metrics.json')
    with open(metrics_path, 'r') as f:
        metrics = json.load(f)
        
    print("\nModel Metrics summary:")
    print(json.dumps(metrics, indent=2))
    return True

if __name__ == '__main__':
    verify_saved_artifacts()

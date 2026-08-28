import requests
import json
import sys

# Ensure Windows terminal prints UTF-8 (Rupee symbol) correctly
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8001/api"

def test_endpoints():
    print("=== Testing FastAPI Endpoints ===")
    
    # 1. Test Health Check
    try:
        r = requests.get(f"{BASE_URL}/health")
        print(f"1. Health Check: {r.status_code} - {r.json()}")
    except Exception as e:
        print(f"1. Health Check failed to connect: {e}")
        return
        
    # 2. Test Feature Metadata
    r = requests.get(f"{BASE_URL}/feature-metadata")
    print(f"2. Feature Metadata: {r.status_code}")
    print(f"   Available Neighborhoods: {len(r.json()['Neighborhood']['categories'])} items")
    
    # Define test features
    sample_features = {
        "OverallQual": 7,
        "GrLivArea": 1800.0,
        "YearBuilt": 2005,
        "YearRemodAdd": 2006,
        "TotalBsmtSF": 800.0,
        "GarageCars": 2,
        "GarageArea": 400.0,
        "FullBath": 2,
        "BedroomAbvGr": 3,
        "TotRmsAbvGrd": 7,
        "Fireplaces": 1,
        "1stFlrSF": 1000.0,
        "2ndFlrSF": 800.0,
        "LotArea": 9000.0,
        "Neighborhood": "CollgCr"
    }
    
    # 3. Test Predict Price
    payload_pred = {
        "model_name": "Explainable Boosting Machine",
        "features": sample_features
    }
    r = requests.post(f"{BASE_URL}/predict", json=payload_pred)
    print(f"3. Predict Price: {r.status_code}")
    print(f"   Response: {json.dumps(r.json(), indent=2)}")
    
    # 4. Test Local Explanation
    r = requests.post(f"{BASE_URL}/explain", json=payload_pred)
    print(f"4. Explain Prediction: {r.status_code}")
    explanation = r.json()
    print(f"   NL Explanation Preview: {explanation['explanation_text'][:120]}...")
    print(f"   Feature Contributions Count: {len(explanation['contributions'])} features")
    
    # 5. Test What-If
    modified_features = sample_features.copy()
    modified_features["GrLivArea"] = 2200.0  # Increase area
    modified_features["1stFlrSF"] = 1200.0
    
    payload_whatif = {
        "model_name": "Explainable Boosting Machine",
        "original_features": sample_features,
        "modified_features": modified_features
    }
    r = requests.post(f"{BASE_URL}/what-if", json=payload_whatif)
    print(f"5. What-If Analysis: {r.status_code}")
    print(f"   Response: {json.dumps(r.json(), indent=2)}")
    
    # 6. Test Model Metrics
    r = requests.get(f"{BASE_URL}/model-metrics")
    print(f"6. Model Metrics: {r.status_code}")
    print(f"   Response: {json.dumps(r.json(), indent=2)}")
    
    # 7. Test Feature Importance
    r = requests.get(f"{BASE_URL}/feature-importance")
    print(f"7. Global Feature Importance: {r.status_code}")
    print(f"   Response: {json.dumps(r.json(), indent=2)}")
    
    # 8. Test Feature Effect
    r = requests.get(f"{BASE_URL}/feature-effect/GrLivArea", params={"model_name": "Explainable Boosting Machine"})
    print(f"8. Feature Effect (GrLivArea): {r.status_code}")
    print(f"   Response: {len(r.json()['effect_data'])} data points returned")

if __name__ == "__main__":
    test_endpoints()

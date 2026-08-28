import os
import sys
import json
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from interpret.glassbox import ExplainableBoostingRegressor
import joblib

# Add current directory to path to enable relative imports when run directly
sys.path.append(os.path.dirname(__file__))
from preprocess import download_dataset, prepare_pipeline, NUM_FEATURES, CAT_FEATURES

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'artifacts')
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

def train_and_evaluate():
    # 1. Download and preprocess data
    df = download_dataset()
    X_train, X_test, y_train, y_test = prepare_pipeline(df)
    
    # Get feature names from preprocessed columns
    feature_names = X_train.columns.tolist()
    
    print("\nTraining models...")
    
    # 2. Train Linear Regression
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    print("Linear Regression trained.")
    
    # 3. Train Explainable Boosting Machine
    # Use standard settings suitable for fast and interpretable regression
    ebm = ExplainableBoostingRegressor(random_state=42)
    ebm.fit(X_train, y_train)
    print("Explainable Boosting Machine trained.")
    
    # 4. Train Random Forest Regressor
    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    print("Random Forest Regressor trained.")
    
    # 5. Evaluate models
    models = {
        'Linear Regression': lr,
        'Explainable Boosting Machine': ebm,
        'Random Forest': rf
    }
    
    metrics = {}
    for name, model in models.items():
        preds = model.predict(X_test)
        mae = float(np.mean(np.abs(y_test - preds)))
        rmse = float(np.sqrt(np.mean((y_test - preds)**2)))
        # R2 score
        y_mean = np.mean(y_test)
        ss_res = np.sum((y_test - preds)**2)
        ss_tot = np.sum((y_test - y_mean)**2)
        r2 = float(1.0 - (ss_res / ss_tot))
        
        metrics[name] = {
            'MAE': mae,
            'RMSE': rmse,
            'R2': r2
        }
        print(f"{name} -> MAE: {mae:,.2f}, RMSE: {rmse:,.2f}, R2: {r2:.4f}")
        
    # Save metrics
    metrics_path = os.path.join(ARTIFACTS_DIR, 'metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"Saved evaluation metrics to {metrics_path}")
    
    # 6. Save Model Artifacts
    joblib.dump(lr, os.path.join(ARTIFACTS_DIR, 'lr_model.pkl'))
    joblib.dump(ebm, os.path.join(ARTIFACTS_DIR, 'ebm_model.pkl'))
    joblib.dump(rf, os.path.join(ARTIFACTS_DIR, 'rf_model.pkl'))
    print("Saved all model pickles to artifacts folder.")
    
    # 7. Generate and Aggregate Global Feature Importance
    # For a fair comparison, we define feature importance as the average magnitude of influence 
    # of a feature on the predictions over the training set (average |contribution|).
    
    importances = {}
    
    # --- Linear Regression Importance ---
    # Contribution of feature k = coef_k * X_k
    lr_contributions = np.abs(X_train.values * lr.coef_)
    lr_mean_contrib = np.mean(lr_contributions, axis=0)
    importances['Linear Regression'] = aggregate_scores(lr_mean_contrib, feature_names)
    
    # --- Explainable Boosting Machine Importance ---
    # EBM natively calculates global importance as the mean absolute score of terms
    ebm_global = ebm.explain_global()
    ebm_data = ebm_global.data()
    # EBM names might be in terms of terms (e.g. 'num__GrLivArea', or pair interactions)
    # We will map them back
    ebm_scores = []
    ebm_names = []
    for i, name in enumerate(ebm_data['names']):
        # Ignore pair interactions for simplicity or map them
        if ' x ' in name:
            continue
        ebm_names.append(name)
        ebm_scores.append(ebm_data['scores'][i])
    importances['Explainable Boosting Machine'] = aggregate_scores(ebm_scores, ebm_names)
    
    # --- Random Forest Importance ---
    # Random Forest uses MDI (Mean Decrease in Impurity) by default, 
    # but to keep it comparable, we can scale it or use it directly
    rf_importances = rf.feature_importances_
    # Let's map it back to original features
    importances['Random Forest'] = aggregate_scores(rf_importances, feature_names)
    
    # Normalize importances so they can be compared relative to each other (e.g. sum to 100 or max to 1)
    normalized_importances = {}
    for model_name, model_imp in importances.items():
        total = sum(model_imp.values())
        if total > 0:
            normalized_importances[model_name] = [
                {'feature': feat, 'importance': val / total, 'raw_importance': val}
                for feat, val in sorted(model_imp.items(), key=lambda x: x[1], reverse=True)
            ]
        else:
            normalized_importances[model_name] = [
                {'feature': feat, 'importance': 0.0, 'raw_importance': 0.0}
                for feat, val in model_imp.items()
            ]
            
    importance_path = os.path.join(ARTIFACTS_DIR, 'feature_importance.json')
    with open(importance_path, 'w') as f:
        json.dump(normalized_importances, f, indent=2)
    print(f"Saved global feature importances to {importance_path}")

def aggregate_scores(scores, feature_names):
    """Groups preprocessed feature columns (like one-hot encodings) back to their original feature name."""
    aggregated = {}
    for val, name in zip(scores, feature_names):
        # Strip pipeline prefixes ('num__' or 'cat__') if present
        clean_name = name
        if '__' in name:
            clean_name = name.split('__')[-1]
            
        # Group one-hot encoded categories under their parent feature (e.g. Neighborhood_CollgCr -> Neighborhood)
        parent_feature = clean_name
        for cat_col in CAT_FEATURES:
            if clean_name.startswith(cat_col + '_'):
                parent_feature = cat_col
                break
                
        aggregated[parent_feature] = aggregated.get(parent_feature, 0.0) + abs(val)
        
    return aggregated

if __name__ == '__main__':
    train_and_evaluate()

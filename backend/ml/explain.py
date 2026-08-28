import os
import joblib
import pandas as pd
import numpy as np
import shap

def explain_ebm_local(ebm_model, X_sample):
    """Generates local explanations (feature contributions) from EBM."""
    ebm_local = ebm_model.explain_local(X_sample)
    data = ebm_local.data(0)
    return data['names'], data['scores']

def explain_linear_local(lr_model, X_sample):
    """Generates local explanations from Linear Regression coefficients."""
    # Contribution of feature k = coef_k * X_k
    scores = lr_model.coef_ * X_sample.values[0]
    return X_sample.columns.tolist(), scores.tolist()

def explain_rf_local(rf_model, X_sample):
    """Generates local explanations for Random Forest using SHAP."""
    explainer = shap.TreeExplainer(rf_model)
    shap_values = explainer.shap_values(X_sample)
    # shap_values shape is (1, n_features)
    return X_sample.columns.tolist(), shap_values[0].tolist()

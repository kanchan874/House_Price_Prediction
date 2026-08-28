# Project Report: House Price Prediction Using Interpretable Machine Learning Models

## 1. Executive Summary
This academic project presents a transparent machine learning framework for predicting residential house prices in Ames, Iowa, using the standard Ames Housing Dataset. 
While typical property valuation systems prioritize prediction accuracy at the expense of transparency (acting as "black-boxes"), our application implements **Explainable AI (XAI)** principles. 

By comparing **Linear Regression (LR)**, **Explainable Boosting Machines (EBM)**, and **Random Forests (RF)**, we demonstrate that transparency does not require sacrificing predictive accuracy. The trained Explainable Boosting Machine achieved an $R^2$ of **0.9186** (explaining 91.86% of the variance in house prices) outperforming both Linear Regression ($R^2$ = 0.8456) and Random Forest ($R^2$ = 0.9045), while remaining mathematically additive and fully interpretable.

---

## 2. Problem Statement & Objective
Real estate valuation is a critical financial process. When machine learning models predict a property estimate, stakeholders (buyers, sellers, banks, regulators) naturally ask: *"Why did the model estimate this price?"*
The objective of this project is to build an E2E web application that:
1. Accepts 15 key house features (quality, size, location, age, garages, basement details).
2. Predicts the property value in raw Indian Rupees (INR) and Lakhs.
3. Decomposes the prediction into signed feature contributions relative to a baseline.
4. Enables interactive what-if simulations to analyze sensitivity.
5. Visualizes global feature weights and partial dependency response curves.

---

## 3. Model Architecture & Evaluation
Three distinct models were trained on an 80/20 train-test split:

| Model Architecture | MAE (INR) | RMSE (INR) | R² Score | Interpretability Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Linear Regression** | ₹17.53 Lakhs | ₹29.20 Lakhs | 0.8456 | Direct coefficients ($\beta$) |
| **Explainable Boosting Machine (EBM)** | ₹12.95 Lakhs | ₹21.20 Lakhs | 0.9186 | Shape functions ($f_i(x_i)$) |
| **Random Forest Regressor** | ₹13.92 Lakhs | ₹22.96 Lakhs | 0.9045 | Post-hoc SHAP values |

### Key Findings
1. **Explainable Boosting Machine (EBM)** achieved the highest predictive performance. Because EBMs are Generalized Additive Models (GAMs) trained via gradient boosting, they fit nonlinear relationships (e.g. quality jumps) without losing mathematical additivity.
2. **Linear Regression** served as a baseline. While highly interpretable, its linear assumptions reduce its accuracy when modeling interaction effects and nonlinear curves.
3. **Random Forest** is an ensemble method. Although powerful, explaining it requires using SHAP (TreeExplainer), which adds computational overhead compared to EBM's native shape functions.

---

## 4. XAI Implementation Details
- **Local Explanation:** Decomposes a single prediction into:
  $$Price_{pred} = Intercept + \sum Contribution_i$$
- **Global Explanation:** Evaluates average absolute feature contributions across the entire training set to determine feature weights.
- **What-If Analysis:** Interactively modifies input properties and sends them to the backend API to observe the shifts.
- **Partial Dependence Curves:** Varies a single feature while holding all others constant at their dataset medians, capturing the standalone response curve of the model.

---

## 5. Bibliography & References
1. Lou, Y., Caruana, R., & Gehrke, J. (2012). "Intelligible models for classification and regression." *ACM SIGKDD*.
2. Lundberg, S. M., & Lee, S.-I. (2017). "A unified approach to interpreting model predictions." *NeurIPS*.
3. Cock, D. (2011). "Ames, Iowa: Alternative to the Boston Housing Data as an End of Semester Regression Project." *Journal of Statistics Education*.

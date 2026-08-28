# House Price Prediction Using Interpretable Machine Learning Models

This is a complete, production-quality Explainable AI (XAI) web application designed to predict residential house prices in Ames, Iowa, and explain predictions using interpretable machine learning models. Developed as a college project for Explainable Artificial Intelligence.

---

## Key Features
1. **Interactive Price Prediction**: Input house specifications (size, quality, age, garages, basement details) to estimate value.
2. **Local Feature Explanations**: Decompose any single prediction into positive and negative feature contributions relative to a baseline.
3. **What-If Analysis**: Change property details dynamically and observe the price shift recalculated by the model instantly.
4. **Global Diagnostics**: Review model metrics (MAE, RMSE, R²) and check global feature weight rankings.
5. **Feature Response Curves**: Graph how prices respond to changes in a single feature (e.g. area) holding other attributes constant.
6. **Unified XAI Backend**: Provides explanations for **Linear Regression**, **Explainable Boosting Machines (EBM)**, and **Random Forests (SHAP)**.

---

## Technology Stack
- **Frontend**: React (Vite, JavaScript), Axios, CSS, Recharts, Lucide Icons.
- **Backend**: Python, FastAPI, Uvicorn, Pydantic.
- **Machine Learning**: Scikit-Learn, InterpretML (EBM), SHAP, Pandas, NumPy, Joblib.

---

## Folder Structure
```
house-price-prediction/
├── README.md
├── .gitignore
├── docs/
│   ├── project_report.md
│   ├── methodology.md
│   └── xai_methodology.md
├── backend/
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── prediction.py
│   │   │   ├── explanation.py
│   │   │   └── model_info.py
│   │   ├── models/
│   │   │   ├── model_loader.py
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   ├── prediction_service.py
│   │   │   ├── explanation_service.py
│   │   │   └── preprocessing_service.py
│   │   └── utils/
│   │       └── helpers.py
│   ├── ml/
│   │   ├── train.py
│   │   ├── preprocess.py
│   │   ├── evaluate.py
│   │   └── explain.py
│   ├── artifacts/
│   │   ├── ebm_model.pkl
│   │   ├── lr_model.pkl
│   │   ├── rf_model.pkl
│   │   ├── preprocessor.pkl
│   │   ├── metrics.json
│   │   ├── feature_importance.json
│   │   └── feature_metadata.json
│   └── data/
│       └── house_prices.csv
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PredictionForm.jsx
        │   ├── PriceCard.jsx
        │   ├── FeatureContributionChart.jsx
        │   ├── ExplanationSummary.jsx
        │   ├── WhatIfPanel.jsx
        │   ├── FeatureImportanceChart.jsx
        │   ├── FeatureEffectChart.jsx
        │   ├── ModelMetrics.jsx
        │   └── PredictionHistory.jsx
        ├── services/
        │   └── api.js
        └── styles/
            ├── global.css
            ├── forms.css
            └── dashboard.css
```

---

## Installation & Setup

### 1. Backend Server Setup
From the project root folder:

```bash
# 1. Create Python Virtual Environment
python -m venv .venv

# 2. Activate Virtual Environment
# On Windows PowerShell:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# 3. Install Python Dependencies
pip install -r backend/requirements.txt

# 4. Run Training Pipeline to download dataset & train models
python backend/ml/train.py

# 5. Start FastAPI Backend Server
cd backend
uvicorn app.main:app --reload
```

The API docs will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup
Open a separate terminal at the project root folder:

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install Node Dependencies
npm install

# 3. Start Development Server
npm run dev
```

The React app will be live at `http://localhost:5173`.

---

## API Documentation

- **`GET /api/health`**: Health check.
- **`GET /api/feature-metadata`**: Retrieve defaults, ranges, and neighborhood options.
- **`GET /api/model-metrics`**: Fetch training-split MAE, RMSE, and R² scores.
- **`GET /api/feature-importance`**: Fetch global feature weight rankings.
- **`POST /api/predict`**: Compute predicted house prices.
- **`POST /api/explain`**: Retrieve local feature-level contributions and text summaries.
- **`POST /api/what-if`**: Compare prediction outcomes under modified parameters.
- **`GET /api/feature-effect/{feature_name}`**: Generate response vectors (partial dependence).

# Preprocessing & Training Methodology

This document details the data preparation, preprocessing pipeline, and model training methodologies implemented for the House Price Prediction XAI system.

---

## 1. Dataset Selection & Standardizing Columns
We utilize the **Ames Housing Dataset**, which contains 2,930 observations of residential sales in Ames, Iowa. 
To construct a clear and understandable explanation interface, we filter the dataset down to **15 meaningful variables** that capture size, quality, location, and age:

- **OverallQual:** Rating of material and finish quality (integer 1-10). Cleaned from string classifications in OpenML to integers.
- **GrLivArea:** Above-grade ground living area (square feet).
- **YearBuilt:** Year of original construction.
- **YearRemodAdd:** Year of remodeling/restoration.
- **TotalBsmtSF:** Total square feet of basement area.
- **GarageCars:** Garage capacity in terms of car spaces.
- **GarageArea:** Total size of garage in square feet.
- **FullBath:** Full bathrooms above grade.
- **BedroomAbvGr:** Bedrooms above grade (excluding basements).
- **TotRmsAbvGrd:** Total rooms above grade (excluding bathrooms).
- **Fireplaces:** Number of fireplaces.
- **1stFlrSF:** First floor square footage.
- **2ndFlrSF:** Second floor square footage.
- **LotArea:** Total lot size in square feet.
- **Neighborhood:** Categorical location identifier (e.g. CollgCr, OldTown, Edwards).

---

## 2. Preprocessing & Imputation Strategy
To prevent **Data Leakage**, all transformations are fitted *only* on the training dataset (80% split) and applied to the test split (20% split) and live api request inputs.

### Preprocessing Pipelines:
1. **Numerical Pipeline:**
   - **Imputation:** Missing values are imputed using the **median** value of each column calculated from the training split. This protects against outliers.
2. **Categorical Pipeline (`Neighborhood`):**
   - **Imputation:** Missing values are filled with the **most frequent** (mode) neighborhood from the training split.
   - **Encoding:** One-Hot Encoding (`OneHotEncoder(handle_unknown='ignore')`) splits the categorical column into binary columns representing each neighborhood. This ensures that new neighborhoods in the test set or API inputs do not crash the models (they get encoded as all zeros).

---

## 3. Training & Validation Setup
- **Split Ratio:** 80% Training, 20% Testing.
- **Random Seed:** Set to `42` across all splits, Random Forest, and EBM initializations to ensure exact reproducibility.
- **Target Scaling (INR):** To display values in Rupees, the target variable `SalePrice` is pre-scaled by multiplying the raw USD value by `83.0` during training. This forces the model coefficients and additive parameters to natively calculate and return values in INR.

---

## 4. Preprocessing Fit Persistence
The fitted `ColumnTransformer` is serialized to `artifacts/preprocessor.pkl` using `joblib`. 
This preprocessor is loaded by the FastAPI app on startup. Live user inputs sent to `/api/predict` are structured into a 1-row pandas DataFrame, aligned with training columns, and transformed through the exact same preprocessor before feeding them into the trained models.

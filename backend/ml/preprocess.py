import os
import urllib.request
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
import joblib
import json

# Define constants
NUM_FEATURES = [
    'OverallQual', 'GrLivArea', 'YearBuilt', 'YearRemodAdd', 'TotalBsmtSF',
    'GarageCars', 'GarageArea', 'FullBath', 'BedroomAbvGr', 'TotRmsAbvGrd',
    'Fireplaces', '1stFlrSF', '2ndFlrSF', 'LotArea'
]
CAT_FEATURES = ['Neighborhood']
FEATURES = NUM_FEATURES + CAT_FEATURES
TARGET = 'SalePrice'
INR_MULTIPLIER = 83.0  # Scale USD to INR to make explanations natively in INR

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'artifacts')

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

CSV_PATH = os.path.join(DATA_DIR, 'house_prices.csv')

def download_dataset():
    """Downloads the Ames Housing dataset if not locally present."""
    if os.path.exists(CSV_PATH):
        print(f"Dataset already exists at {CSV_PATH}")
        return pd.read_csv(CSV_PATH)
    
    urls = [
        # Kaggle Train CSV raw link
        "https://raw.githubusercontent.com/debarghya-das/house-prices-prediction/master/train.csv",
        "https://raw.githubusercontent.com/human-analysis/housing-prices/master/train.csv"
    ]
    
    for url in urls:
        try:
            print(f"Attempting to download dataset from {url}...")
            urllib.request.urlretrieve(url, CSV_PATH)
            print("Download successful!")
            return pd.read_csv(CSV_PATH)
        except Exception as e:
            print(f"Failed to download from {url}: {e}")
            
    # Fallback to scikit-learn fetch_openml (can be slower)
    try:
        print("Fallback: fetching Ames_Housing dataset from OpenML...")
        from sklearn.datasets import fetch_openml
        housing = fetch_openml(name="Ames_Housing", as_frame=True, parser="auto")
        df = housing.frame
        # Map OpenML snake_case names to standard Kaggle names
        mapping = {
            'Overall_Qual': 'OverallQual',
            'Gr_Liv_Area': 'GrLivArea',
            'Year_Built': 'YearBuilt',
            'Year_Remod_Add': 'YearRemodAdd',
            'Total_Bsmt_SF': 'TotalBsmtSF',
            'Garage_Cars': 'GarageCars',
            'Garage_Area': 'GarageArea',
            'Full_Bath': 'FullBath',
            'Bedroom_AbvGr': 'BedroomAbvGr',
            'TotRms_AbvGrd': 'TotRmsAbvGrd',
            'Fireplaces': 'Fireplaces',
            'First_Flr_SF': '1stFlrSF',
            'Second_Flr_SF': '2ndFlrSF',
            'Lot_Area': 'LotArea',
            'Sale_Price': 'SalePrice',
            'Neighborhood': 'Neighborhood'
        }
        df = df.rename(columns=mapping)
        df.to_csv(CSV_PATH, index=False)
        print("OpenML fetch and mapping successful!")
        return df
    except Exception as e:
        raise RuntimeError(f"Could not load or download the dataset: {e}")

def prepare_pipeline(df):
    """Preprocesses dataset, saves metadata, fits and saves preprocessor pipeline."""
    # Keep only required features and target
    available_cols = [col for col in FEATURES + [TARGET] if col in df.columns]
    data = df[available_cols].copy()
    
    # Drop rows where SalePrice is missing
    data = data.dropna(subset=[TARGET])
    
    # Clean OverallQual from string to numeric scale 1-10
    def clean_overall_qual(val):
        if pd.isna(val):
            return 5
        val_str = str(val).strip()
        if val_str.isdigit():
            return int(val_str)
        quality_map = {
            'very_poor': 1, 'verypoor': 1,
            'poor': 2,
            'fair': 3,
            'below_average': 4, 'below_average': 4,
            'average': 5,
            'above_average': 6, 'above_average': 6,
            'good': 7,
            'very_good': 8, 'very_good': 8,
            'excellent': 9,
            'very_excellent': 10, 'very_excellent': 10
        }
        lower_val = val_str.lower().replace(' ', '_')
        return quality_map.get(lower_val, 5)

    data['OverallQual'] = data['OverallQual'].apply(clean_overall_qual).astype(int)
    
    # Check that we have all required features
    missing_features = [f for f in FEATURES if f not in data.columns]
    if missing_features:
        raise ValueError(f"Missing required columns in dataset: {missing_features}")
    
    # Separate features and target
    X = data[FEATURES]
    y = data[TARGET].astype(float) * INR_MULTIPLIER  # Convert SalePrice to INR
    
    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Build preprocessing pipeline
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median'))
    ])
    
    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_pipeline, NUM_FEATURES),
            ('cat', cat_pipeline, CAT_FEATURES)
        ]
    )
    
    # Fit the pipeline on training data only
    preprocessor.fit(X_train)
    
    # Save the fitted preprocessor
    preprocessor_path = os.path.join(ARTIFACTS_DIR, 'preprocessor.pkl')
    joblib.dump(preprocessor, preprocessor_path)
    print(f"Saved preprocessor to {preprocessor_path}")
    
    # Compile feature metadata
    metadata = {}
    for col in NUM_FEATURES:
        series = X_train[col].astype(float)
        metadata[col] = {
            'type': 'numeric',
            'min': float(series.min()),
            'max': float(series.max()),
            'median': float(series.median()),
            'mean': float(series.mean()),
            'default': float(series.median())
        }
        
    for col in CAT_FEATURES:
        cats = sorted(X_train[col].dropna().unique().tolist())
        # Select the most frequent category as default
        most_freq = X_train[col].mode()[0]
        metadata[col] = {
            'type': 'categorical',
            'categories': cats,
            'default': most_freq
        }
        
    metadata_path = os.path.join(ARTIFACTS_DIR, 'feature_metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved feature metadata to {metadata_path}")
    
    # Save training and test split datasets as processed arrays/dataframes
    X_train_proc = pd.DataFrame(
        preprocessor.transform(X_train), 
        columns=preprocessor.get_feature_names_out()
    )
    X_test_proc = pd.DataFrame(
        preprocessor.transform(X_test),
        columns=preprocessor.get_feature_names_out()
    )
    
    return X_train_proc, X_test_proc, y_train, y_test

if __name__ == "__main__":
    df = download_dataset()
    X_train, X_test, y_train, y_test = prepare_pipeline(df)
    print("Preprocessing completed successfully!")
    print(f"Train size: {X_train.shape}, Test size: {X_test.shape}")

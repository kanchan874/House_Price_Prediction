from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class HouseFeatures(BaseModel):
    OverallQual: int = Field(..., ge=1, le=10, description="Overall material and finish quality (1-10)")
    GrLivArea: float = Field(..., ge=0, description="Above grade (ground) living area square feet")
    YearBuilt: int = Field(..., ge=1800, le=2026, description="Original construction year")
    YearRemodAdd: int = Field(..., ge=1800, le=2026, description="Remodel date (same as construction date if no remodeling)")
    TotalBsmtSF: float = Field(..., ge=0, description="Total square feet of basement area")
    GarageCars: int = Field(..., ge=0, le=10, description="Size of garage in car capacity")
    GarageArea: float = Field(..., ge=0, description="Size of garage in square feet")
    FullBath: int = Field(..., ge=0, description="Full bathrooms above grade")
    BedroomAbvGr: int = Field(..., ge=0, description="Number of bedrooms above grade (does NOT include basement bedrooms)")
    TotRmsAbvGrd: int = Field(..., ge=0, description="Total rooms above grade (does not include bathrooms)")
    Fireplaces: int = Field(..., ge=0, description="Number of fireplaces")
    FirstFlrSF: float = Field(..., alias="1stFlrSF", ge=0, description="First Floor square feet")
    SecondFlrSF: float = Field(..., alias="2ndFlrSF", ge=0, description="Second Floor square feet")
    LotArea: float = Field(..., ge=0, description="Lot size in square feet")
    Neighborhood: str = Field(..., description="Physical locations within Ames city limits")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
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
        }

class PredictionRequest(BaseModel):
    model_name: str = Field(..., description="Model to use for prediction ('Explainable Boosting Machine', 'Linear Regression', 'Random Forest')")
    features: HouseFeatures

class PredictionResponse(BaseModel):
    predicted_price: float
    formatted_price: str
    formatted_lakhs: str
    model_name: str
    baseline_price: float

class FeatureContribution(BaseModel):
    feature: str
    value: str  # Original value formatted as string
    contribution: float  # Numerical contribution in INR
    formatted_contribution: str  # Contribution formatted as string, e.g. "+₹8.4L" or "-₹2.1L"
    direction: str  # "positive", "negative", or "neutral"

class ExplanationResponse(BaseModel):
    predicted_price: float
    formatted_price: str
    formatted_lakhs: str
    model_name: str
    baseline_price: float
    formatted_baseline: str
    contributions: List[FeatureContribution]
    positive_contributors: List[str]
    negative_contributors: List[str]
    explanation_text: str

class WhatIfRequest(BaseModel):
    model_name: str
    original_features: HouseFeatures
    modified_features: HouseFeatures

class WhatIfResponse(BaseModel):
    original_price: float
    original_formatted: str
    original_formatted_lakhs: str
    modified_price: float
    modified_formatted: str
    modified_formatted_lakhs: str
    absolute_difference: float
    formatted_difference: str
    percentage_difference: float
    direction: str  # "increase", "decrease", or "no_change"

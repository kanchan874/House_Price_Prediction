import React, { useState, useEffect } from 'react';
import { getFeatureMetadata } from '../services/api';
import { Home, Layers, Sparkles, Building2, MapPin, Award, CheckCircle2 } from 'lucide-react';

const PredictionForm = ({ onSubmit, selectedModel, setSelectedModel, modelMetrics, initialValues }) => {
  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [formData, setFormData] = useState({
    OverallQual: 7,
    GrLivArea: 1800,
    YearBuilt: 2005,
    YearRemodAdd: 2006,
    TotalBsmtSF: 850,
    GarageCars: 2,
    GarageArea: 440,
    FullBath: 2,
    BedroomAbvGr: 3,
    TotRmsAbvGrd: 7,
    Fireplaces: 1,
    '1stFlrSF': 1080,
    '2ndFlrSF': 720,
    LotArea: 9000,
    Neighborhood: 'CollgCr'
  });

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const data = await getFeatureMetadata();
        setMetadata(data);
        if (!initialValues) {
          const defaults = {};
          Object.keys(data).forEach((key) => {
            defaults[key] = data[key].default;
          });
          setFormData(defaults);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      } finally {
        setLoadingMetadata(false);
      }
    }
    fetchMetadata();
  }, [initialValues]);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (name, val) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: val };
      
      // Auto-compute logic: sync floor area ratios if GrLivArea is changed
      if (name === 'GrLivArea' && typeof val === 'number') {
        updated['1stFlrSF'] = Math.round(val * 0.6);
        updated['2ndFlrSF'] = Math.round(val * 0.4);
        if (updated.TotRmsAbvGrd < Math.ceil(val / 300)) {
          updated.TotRmsAbvGrd = Math.max(4, Math.ceil(val / 250));
        }
      }
      
      // Sync YearRemodAdd to be >= YearBuilt
      if (name === 'YearBuilt' && typeof val === 'number') {
        if (updated.YearRemodAdd < val) {
          updated.YearRemodAdd = val;
        }
      }

      // Sync GarageArea when GarageCars changes
      if (name === 'GarageCars') {
        if (val === 0) {
          updated.GarageArea = 0;
        } else if (prev.GarageCars === 0 || prev.GarageArea === 0) {
          updated.GarageArea = val * 220;
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const neighborhoods = metadata?.Neighborhood?.categories || [
    'CollgCr', 'Veenker', 'Crawfor', 'NoRidge', 'Mitchel', 'Somerst', 'NWAmes', 'OldTown', 
    'BrkSide', 'Sawyer', 'NridgHt', 'NAmes', 'SawyerW', 'IDOTRR', 'MeadowV', 'Edwards', 
    'Timber', 'Gilbert', 'StoneBr', 'ClearCr', 'NPkVill', 'Blmngtn', 'BrDale', 'SWISU', 'Blueste'
  ];

  const models = [
    { name: 'Explainable Boosting Machine', tag: 'Recommended', desc: 'Highest interpretability & accuracy' },
    { name: 'Random Forest', tag: 'High Precision', desc: 'Ensemble model with SHAP analysis' },
    { name: 'Linear Regression', tag: 'Fast Baseline', desc: 'Classic linear coefficients' }
  ];

  const getQualityLabel = (score) => {
    if (score >= 9) return 'Luxury / High End';
    if (score >= 7) return 'Above Average / Excellent';
    if (score >= 5) return 'Standard / Good Condition';
    if (score >= 3) return 'Below Average / Needs Repair';
    return 'Fair / Fixer Upper';
  };

  return (
    <form onSubmit={handleSubmit} className="card animate-fade-in">
      <div className="card-title">
        <Sparkles size={20} style={{ color: 'var(--color-brand)' }} />
        Property Details & Valuation Inputs
      </div>
      
      {/* Model Selection Option Cards */}
      <div style={{ marginBottom: '2rem' }}>
        <label className="form-label" style={{ marginBottom: '0.75rem' }}>
          Select Prediction Model Architecture
        </label>
        <div className="option-cards-grid">
          {models.map((m) => {
            const isSelected = selectedModel === m.name;
            const r2Score = modelMetrics?.[m.name]?.R2 ? `(R² ${modelMetrics[m.name].R2.toFixed(3)})` : '';
            return (
              <div
                key={m.name}
                className={`option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedModel(m.name)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="option-card-title" style={{ fontSize: '0.9rem' }}>{m.name}</span>
                  {isSelected && <CheckCircle2 size={16} style={{ color: 'var(--color-brand)' }} />}
                </div>
                <div className="option-card-subtitle">
                  <span style={{ fontWeight: 600, color: 'var(--color-brand)' }}>{m.tag}</span> {r2Score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 1: Space & Living Area */}
      <div className="form-section-title">
        <Home size={18} style={{ color: 'var(--color-brand)' }} />
        1. Living Space & Rooms
      </div>
      
      <div className="form-grid">
        {/* Living Area with Slider & Input */}
        <div className="form-group" style={{ gridColumn: 'span 1' }}>
          <div className="form-label">
            <span>Living Area (sq ft)</span>
            <span className="slider-val">{formData.GrLivArea} sq ft</span>
          </div>
          <div className="slider-container" style={{ marginTop: '0.5rem' }}>
            <input
              type="range"
              min="500"
              max="4500"
              step="50"
              className="slider-input"
              value={formData.GrLivArea}
              onChange={(e) => handleChange('GrLivArea', Number(e.target.value))}
            />
            <input
              type="number"
              className="form-control"
              style={{ width: '90px', padding: '0.35rem 0.5rem', textAlign: 'center' }}
              value={formData.GrLivArea}
              onChange={(e) => handleChange('GrLivArea', Number(e.target.value))}
            />
          </div>
        </div>

        {/* Bedrooms Pill Selector */}
        <div className="form-group">
          <label className="form-label">Bedrooms (Above Grade)</label>
          <div className="pill-group" style={{ marginTop: '0.4rem' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                className={`pill-btn ${formData.BedroomAbvGr === n ? 'active' : ''}`}
                onClick={() => handleChange('BedroomAbvGr', n)}
              >
                {n} {n === 6 ? '+' : ''} Bed
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms Pill Selector */}
        <div className="form-group">
          <label className="form-label">Bathrooms (Full)</label>
          <div className="pill-group" style={{ marginTop: '0.4rem' }}>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                className={`pill-btn ${formData.FullBath === n ? 'active' : ''}`}
                onClick={() => handleChange('FullBath', n)}
              >
                {n} Bath
              </button>
            ))}
          </div>
        </div>

        {/* Total Lot Area */}
        <div className="form-group">
          <label className="form-label">Lot Area (sq ft)</label>
          <input
            type="number"
            className="form-control"
            value={formData.LotArea}
            onChange={(e) => handleChange('LotArea', Number(e.target.value))}
            min="1000"
            max="100000"
            required
          />
        </div>
      </div>

      {/* Section 2: Quality & Construction Age */}
      <div className="form-section-title">
        <Award size={18} style={{ color: 'var(--color-brand)' }} />
        2. Property Quality & Age
      </div>
      
      <div className="form-grid">
        {/* Quality Rating Slider */}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <div className="form-label">
            <span>Overall Material & Finish Quality (1 - 10)</span>
            <span className="slider-val" style={{ width: 'auto', padding: '0.2rem 0.8rem' }}>
              Grade {formData.OverallQual} • {getQualityLabel(formData.OverallQual)}
            </span>
          </div>
          <div className="slider-container" style={{ marginTop: '0.6rem' }}>
            <input
              type="range"
              min="1"
              max="10"
              className="slider-input"
              value={formData.OverallQual}
              onChange={(e) => handleChange('OverallQual', Number(e.target.value))}
            />
          </div>
        </div>

        {/* Year Built */}
        <div className="form-group">
          <label className="form-label">Year Built</label>
          <input
            type="number"
            className="form-control"
            value={formData.YearBuilt}
            onChange={(e) => handleChange('YearBuilt', Number(e.target.value))}
            min="1880"
            max="2026"
            required
          />
        </div>

        {/* Year Remodeled */}
        <div className="form-group">
          <label className="form-label">Year Remodeled</label>
          <input
            type="number"
            className="form-control"
            value={formData.YearRemodAdd}
            onChange={(e) => handleChange('YearRemodAdd', Number(e.target.value))}
            min="1880"
            max="2026"
            required
          />
        </div>
      </div>

      {/* Section 3: Basement & Garage Amenities */}
      <div className="form-section-title">
        <Building2 size={18} style={{ color: 'var(--color-brand)' }} />
        3. Basement, Garage & Amenities
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Basement Area (sq ft)</label>
          <input
            type="number"
            className="form-control"
            value={formData.TotalBsmtSF}
            onChange={(e) => handleChange('TotalBsmtSF', Number(e.target.value))}
            min="0"
            max="3000"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Garage Capacity</label>
          <div className="pill-group" style={{ marginTop: '0.4rem' }}>
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                className={`pill-btn ${formData.GarageCars === n ? 'active' : ''}`}
                onClick={() => handleChange('GarageCars', n)}
              >
                {n === 0 ? 'No Garage' : `${n} Car`}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Fireplaces</label>
          <div className="pill-group" style={{ marginTop: '0.4rem' }}>
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                className={`pill-btn ${formData.Fireplaces === n ? 'active' : ''}`}
                onClick={() => handleChange('Fireplaces', n)}
              >
                {n === 0 ? 'None' : `${n}`}
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhood Location Dropdown */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', gap: '0.4rem' }}>
            <MapPin size={16} style={{ color: 'var(--color-brand)' }} />
            Neighborhood Location
          </label>
          <select
            className="form-control"
            value={formData.Neighborhood}
            onChange={(e) => handleChange('Neighborhood', e.target.value)}
            style={{ fontWeight: 600 }}
          >
            {neighborhoods.map((nb) => (
              <option key={nb} value={nb}>{nb}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem', width: '100%' }}>
          <Sparkles size={20} />
          Estimate House Market Value
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;

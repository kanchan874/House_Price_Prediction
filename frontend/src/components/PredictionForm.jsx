import React, { useState, useEffect } from 'react';
import { getFeatureMetadata } from '../services/api';

const PredictionForm = ({ onSubmit, selectedModel, setSelectedModel, modelMetrics, initialValues }) => {
  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [formData, setFormData] = useState({
    OverallQual: 6,
    GrLivArea: 1500,
    YearBuilt: 2000,
    YearRemodAdd: 2000,
    TotalBsmtSF: 800,
    GarageCars: 2,
    GarageArea: 400,
    FullBath: 2,
    BedroomAbvGr: 3,
    TotRmsAbvGrd: 6,
    Fireplaces: 1,
    '1stFlrSF': 900,
    '2ndFlrSF': 600,
    LotArea: 8000,
    Neighborhood: 'CollgCr'
  });

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const data = await getFeatureMetadata();
        setMetadata(data);
        // Set defaults from metadata if available
        const defaults = {};
        Object.keys(data).forEach((key) => {
          defaults[key] = data[key].default;
        });
        setFormData(defaults);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      } finally {
        setLoadingMetadata(false);
      }
    }
    fetchMetadata();
  }, []);

  // Update initial values if passed (e.g., from explanation page or what-if)
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;
    
    if (type === 'number') {
      val = value === '' ? '' : Number(value);
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };
      
      // Auto-compute logic: if GrLivArea is changed, sync 1stFlrSF and 2ndFlrSF proportionally
      if (name === 'GrLivArea' && typeof val === 'number') {
        updated['1stFlrSF'] = Math.round(val * 0.6);
        updated['2ndFlrSF'] = Math.round(val * 0.4);
        // Sync total rooms above grade to a reasonable ratio if it's too small
        if (updated.TotRmsAbvGrd < Math.ceil(val / 300)) {
          updated.TotRmsAbvGrd = Math.max(4, Math.ceil(val / 250));
        }
      }
      
      // Auto-compute logic: if YearBuilt is changed, sync YearRemodAdd to be >= YearBuilt
      if (name === 'YearBuilt' && typeof val === 'number') {
        if (updated.YearRemodAdd < val) {
          updated.YearRemodAdd = val;
        }
      }

      // Auto-compute logic: if GarageCars is set to 0, set GarageArea to 0
      if (name === 'GarageCars' && val === 0) {
        updated.GarageArea = 0;
      } else if (name === 'GarageCars' && val > 0 && prev.GarageCars === 0 && prev.GarageArea === 0) {
        updated.GarageArea = val * 200; // rough guess
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate bounds
    if (metadata) {
      for (const [key, meta] of Object.entries(metadata)) {
        if (meta.type === 'numeric') {
          const val = formData[key];
          if (val < meta.min || val > meta.max) {
            alert(`Warning: '${key}' value (${val}) is outside training range [${meta.min}, ${meta.max}]. Model prediction accuracy may be reduced.`);
          }
        }
      }
    }
    onSubmit(formData);
  };

  // Neighborhood categories fallback
  const neighborhoods = metadata?.Neighborhood?.categories || [
    'CollgCr', 'Veenker', 'Crawfor', 'NoRidge', 'Mitchel', 'Somerst', 'NWAmes', 'OldTown', 
    'BrkSide', 'Sawyer', 'NridgHt', 'NAmes', 'SawyerW', 'IDOTRR', 'MeadowV', 'Edwards', 
    'Timber', 'Gilbert', 'StoneBr', 'ClearCr', 'NPkVill', 'Blmngtn', 'BrDale', 'SWISU', 'Blueste'
  ];

  const models = ['Explainable Boosting Machine', 'Linear Regression', 'Random Forest'];

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-title">House Details Input Form</div>
      
      {/* Model Selection Row */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" htmlFor="model_select">
          Select Prediction Model
        </label>
        <select
          id="model_select"
          className="form-control"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{ border: '2px solid var(--color-academic)', fontWeight: 'bold' }}
        >
          {models.map((m) => (
            <option key={m} value={m}>
              {m} {modelMetrics?.[m] ? `(R²: ${modelMetrics[m].R2.toFixed(3)})` : ''}
            </option>
          ))}
        </select>
        <span className="form-helper">
          * Note: EBM represents the best trade-off of accuracy and pure feature-level interpretability.
        </span>
      </div>

      {/* Group 1: Property Details */}
      <div className="form-section-title">Property Size & Rooms</div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Living Area (sq ft)
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              [{metadata?.GrLivArea?.min || 334} - {metadata?.GrLivArea?.max || 5642}]
            </span>
          </label>
          <input
            type="number"
            name="GrLivArea"
            className="form-control"
            value={formData.GrLivArea}
            onChange={handleChange}
            required
            min="100"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Lot Area (sq ft)
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              [{metadata?.LotArea?.min || 1300} - {metadata?.LotArea?.max || 215245}]
            </span>
          </label>
          <input
            type="number"
            name="LotArea"
            className="form-control"
            value={formData.LotArea}
            onChange={handleChange}
            required
            min="100"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bedrooms (Above Grade)</label>
          <select
            name="BedroomAbvGr"
            className="form-control"
            value={formData.BedroomAbvGr}
            onChange={handleChange}
          >
            {[0, 1, 2, 3, 4, 5, 6, 8].map((n) => (
              <option key={n} value={n}>{n} Bedroom{n !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Bathrooms (Full)</label>
          <select
            name="FullBath"
            className="form-control"
            value={formData.FullBath}
            onChange={handleChange}
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n} Full Bath{n !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Total Rooms (Above Grade)</label>
          <input
            type="number"
            name="TotRmsAbvGrd"
            className="form-control"
            value={formData.TotRmsAbvGrd}
            onChange={handleChange}
            required
            min="2"
            max="20"
          />
        </div>
      </div>

      {/* Group 2: Construction */}
      <div className="form-section-title">Age & Quality</div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Year Built
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              [{metadata?.YearBuilt?.min || 1872} - {metadata?.YearBuilt?.max || 2010}]
            </span>
          </label>
          <input
            type="number"
            name="YearBuilt"
            className="form-control"
            value={formData.YearBuilt}
            onChange={handleChange}
            required
            min="1800"
            max="2026"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Year Remodeled</label>
          <input
            type="number"
            name="YearRemodAdd"
            className="form-control"
            value={formData.YearRemodAdd}
            onChange={handleChange}
            required
            min="1800"
            max="2026"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Overall Quality Rating
          </label>
          <select
            name="OverallQual"
            className="form-control"
            value={formData.OverallQual}
            onChange={handleChange}
            style={{ fontWeight: 'bold' }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>{n} - {
                n === 10 ? 'Very Excellent' :
                n === 9 ? 'Excellent' :
                n === 8 ? 'Very Good' :
                n === 7 ? 'Good' :
                n === 6 ? 'Above Average' :
                n === 5 ? 'Average' :
                n === 4 ? 'Below Average' :
                n === 3 ? 'Fair' :
                n === 2 ? 'Poor' : 'Very Poor'
              }</option>
            ))}
          </select>
        </div>
      </div>

      {/* Group 3: Basement & Garage */}
      <div className="form-section-title">Basement, Garage & Fireplaces</div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Basement Area (sq ft)</label>
          <input
            type="number"
            name="TotalBsmtSF"
            className="form-control"
            value={formData.TotalBsmtSF}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Garage Capacity (Cars)</label>
          <select
            name="GarageCars"
            className="form-control"
            value={formData.GarageCars}
            onChange={handleChange}
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} Car{n !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Garage Area (sq ft)</label>
          <input
            type="number"
            name="GarageArea"
            className="form-control"
            value={formData.GarageArea}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fireplaces</label>
          <select
            name="Fireplaces"
            className="form-control"
            value={formData.Fireplaces}
            onChange={handleChange}
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Group 4: Location & Floor Splits (Advanced) */}
      <div className="form-section-title">Location & Floor details</div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Neighborhood Location</label>
          <select
            name="Neighborhood"
            className="form-control"
            value={formData.Neighborhood}
            onChange={handleChange}
            style={{ fontWeight: 'bold' }}
          >
            {neighborhoods.map((nb) => (
              <option key={nb} value={nb}>{nb}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">1st Floor Area (sq ft)</label>
          <input
            type="number"
            name="1stFlrSF"
            className="form-control"
            value={formData['1stFlrSF']}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">2nd Floor Area (sq ft)</label>
          <input
            type="number"
            name="2ndFlrSF"
            className="form-control"
            value={formData['2ndFlrSF']}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
          Predict House Price
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;

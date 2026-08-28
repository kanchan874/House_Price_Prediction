import React, { useState, useEffect } from 'react';
import { runWhatIf } from '../services/api';
import { PlayCircle, AlertCircle, ArrowRightLeft } from 'lucide-react';

const DISPLAY_NAME_MAPPING = {
  OverallQual: 'Overall Quality',
  GrLivArea: 'Living Area (sq ft)',
  YearBuilt: 'Year Built',
  TotalBsmtSF: 'Basement Area (sq ft)',
  GarageCars: 'Garage Size (Cars)',
  FullBath: 'Bathrooms',
  BedroomAbvGr: 'Bedrooms',
  Neighborhood: 'Neighborhood'
};

const WhatIfPanel = ({ originalFeatures, selectedModel, metadata }) => {
  const [modifiedFeatures, setModifiedFeatures] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize modified features from original features
  useEffect(() => {
    if (originalFeatures) {
      setModifiedFeatures({ ...originalFeatures });
      setResult(null);
      setError(null);
    }
  }, [originalFeatures, selectedModel]);

  if (!originalFeatures || !modifiedFeatures) {
    return (
      <div className="card">
        <div className="card-title">What-If Simulation Panel</div>
        <div className="alert alert-info">
          Please run an initial house price prediction first on the Predict page to set up a baseline.
        </div>
      </div>
    );
  }

  const handleSliderChange = (name, val) => {
    setModifiedFeatures((prev) => {
      const updated = { ...prev, [name]: val };
      
      // Keep floor details synced if Living Area is modified
      if (name === 'GrLivArea') {
        updated['1stFlrSF'] = Math.round(val * 0.6);
        updated['2ndFlrSF'] = Math.round(val * 0.4);
      }
      
      return updated;
    });
  };

  const executeSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runWhatIf(selectedModel, originalFeatures, modifiedFeatures);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to compute simulated prediction. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  const neighborhoods = metadata?.Neighborhood?.categories || [
    'CollgCr', 'Veenker', 'Crawfor', 'NoRidge', 'Mitchel', 'Somerst', 'NWAmes', 'OldTown', 
    'BrkSide', 'Sawyer', 'NridgHt', 'NAmes', 'SawyerW', 'Edwards', 'Gilbert', 'StoneBr'
  ];

  return (
    <div className="card">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowRightLeft size={20} />
        Interactive What-If Simulation
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Simulate how changing individual characteristics modifies the predicted price. Changes are recalculated instantly using the backend API.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Sliders and Selects Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Overall Quality */}
          <div className="form-group">
            <label className="form-label">
              <span>{DISPLAY_NAME_MAPPING.OverallQual}</span>
              <span className="slider-val">{modifiedFeatures.OverallQual} / 10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              className="slider-input"
              value={modifiedFeatures.OverallQual}
              onChange={(e) => handleSliderChange('OverallQual', Number(e.target.value))}
            />
          </div>

          {/* Living Area */}
          <div className="form-group">
            <label className="form-label">
              <span>{DISPLAY_NAME_MAPPING.GrLivArea}</span>
              <span className="slider-val">{modifiedFeatures.GrLivArea} sq ft</span>
            </label>
            <input
              type="range"
              min={Math.max(500, (metadata?.GrLivArea?.min || 500))}
              max={Math.min(4000, (metadata?.GrLivArea?.max || 4000))}
              step="50"
              className="slider-input"
              value={modifiedFeatures.GrLivArea}
              onChange={(e) => handleSliderChange('GrLivArea', Number(e.target.value))}
            />
          </div>

          {/* Garage Cars */}
          <div className="form-group">
            <label className="form-label">
              <span>{DISPLAY_NAME_MAPPING.GarageCars}</span>
              <span className="slider-val">{modifiedFeatures.GarageCars} Car(s)</span>
            </label>
            <input
              type="range"
              min="0"
              max="4"
              className="slider-input"
              value={modifiedFeatures.GarageCars}
              onChange={(e) => handleSliderChange('GarageCars', Number(e.target.value))}
            />
          </div>

          {/* Year Built */}
          <div className="form-group">
            <label className="form-label">
              <span>{DISPLAY_NAME_MAPPING.YearBuilt}</span>
              <span className="slider-val">{modifiedFeatures.YearBuilt}</span>
            </label>
            <input
              type="range"
              min={metadata?.YearBuilt?.min || 1900}
              max={2010}
              className="slider-input"
              value={modifiedFeatures.YearBuilt}
              onChange={(e) => handleSliderChange('YearBuilt', Number(e.target.value))}
            />
          </div>

          {/* Basement Area */}
          <div className="form-group">
            <label className="form-label">
              <span>{DISPLAY_NAME_MAPPING.TotalBsmtSF}</span>
              <span className="slider-val">{modifiedFeatures.TotalBsmtSF} sq ft</span>
            </label>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              className="slider-input"
              value={modifiedFeatures.TotalBsmtSF}
              onChange={(e) => handleSliderChange('TotalBsmtSF', Number(e.target.value))}
            />
          </div>

          {/* Bedrooms / Bathrooms side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">{DISPLAY_NAME_MAPPING.BedroomAbvGr}</label>
              <select
                className="form-control"
                value={modifiedFeatures.BedroomAbvGr}
                onChange={(e) => handleSliderChange('BedroomAbvGr', Number(e.target.value))}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">{DISPLAY_NAME_MAPPING.FullBath}</label>
              <select
                className="form-control"
                value={modifiedFeatures.FullBath}
                onChange={(e) => handleSliderChange('FullBath', Number(e.target.value))}
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Neighborhood dropdown */}
          <div className="form-group">
            <label className="form-label">{DISPLAY_NAME_MAPPING.Neighborhood}</label>
            <select
              className="form-control"
              value={modifiedFeatures.Neighborhood}
              onChange={(e) => handleSliderChange('Neighborhood', e.target.value)}
            >
              {neighborhoods.map((nb) => (
                <option key={nb} value={nb}>{nb}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={executeSimulation}
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}
          >
            <PlayCircle size={18} />
            {loading ? 'Simulating...' : 'Recalculate Prediction'}
          </button>
        </div>

        {/* Results Comparison Column */}
        {error && (
          <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <div className="what-if-split">
              {/* Original Card */}
              <div className="compare-block original">
                <span className="compare-label">Original Prediction</span>
                <span className="compare-price">{result.original_formatted_lakhs}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  ({result.original_formatted})
                </span>
              </div>
              
              {/* Modified Card */}
              <div className="compare-block modified">
                <span className="compare-label">Simulated Prediction</span>
                <span className="compare-price">{result.modified_formatted_lakhs}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  ({result.modified_formatted})
                </span>
              </div>
            </div>

            {/* Difference Block */}
            <div className={`diff-callout ${result.direction}`}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Net Simulated Effect
              </div>
              <div style={{ fontSize: '1.5rem' }}>
                {result.direction === 'increase' ? '+' : ''}
                {result.formatted_difference} ({result.direction === 'increase' ? '+' : ''}
                {result.percentage_difference.toFixed(2)}%)
              </div>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>
              * Calculated by changing features from baseline state and executing {selectedModel} in the backend.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfPanel;

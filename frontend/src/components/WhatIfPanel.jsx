import React, { useState, useEffect } from 'react';
import { runWhatIf } from '../services/api';
import { ArrowRightLeft, Sparkles, PlayCircle, AlertCircle, RefreshCw } from 'lucide-react';

const DISPLAY_NAME_MAPPING = {
  OverallQual: 'Overall Quality Grade',
  GrLivArea: 'Living Area Space (sq ft)',
  YearBuilt: 'Year Built',
  TotalBsmtSF: 'Basement Area (sq ft)',
  GarageCars: 'Garage Size (Cars)',
  FullBath: 'Bathrooms',
  BedroomAbvGr: 'Bedrooms',
  Neighborhood: 'Neighborhood Location'
};

const WhatIfPanel = ({ originalFeatures, selectedModel, metadata }) => {
  const [modifiedFeatures, setModifiedFeatures] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (originalFeatures) {
      setModifiedFeatures({ ...originalFeatures });
      setResult(null);
      setError(null);
    }
  }, [originalFeatures, selectedModel]);

  if (!originalFeatures || !modifiedFeatures) {
    return (
      <div className="card animate-fade-in">
        <div className="card-title">
          <ArrowRightLeft size={20} style={{ color: 'var(--color-brand)' }} />
          Interactive Renovation & What-If Simulator
        </div>
        <div className="alert alert-info" style={{ margin: 0 }}>
          💡 Please calculate an initial house valuation on the <strong>Valuation Tool</strong> tab first to set up a baseline home to simulate against.
        </div>
      </div>
    );
  }

  const handleSliderChange = (name, val) => {
    setModifiedFeatures((prev) => {
      const updated = { ...prev, [name]: val };
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
      setError('Failed to calculate simulated prediction. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  const neighborhoods = metadata?.Neighborhood?.categories || [
    'CollgCr', 'Veenker', 'Crawfor', 'NoRidge', 'Mitchel', 'Somerst', 'NWAmes', 'OldTown', 
    'BrkSide', 'Sawyer', 'NridgHt', 'NAmes', 'SawyerW', 'Edwards', 'Gilbert', 'StoneBr'
  ];

  return (
    <div className="card animate-fade-in">
      <div className="card-title">
        <ArrowRightLeft size={20} style={{ color: 'var(--color-brand)' }} />
        Renovation & What-If Price Simulator
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Simulate how adding living area, upgrading finish quality, or adding garage space alters market valuation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Sliders & Input Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          
          {/* Quality Slider */}
          <div className="form-group">
            <div className="form-label">
              <span>{DISPLAY_NAME_MAPPING.OverallQual}</span>
              <span className="slider-val">Grade {modifiedFeatures.OverallQual} / 10</span>
            </div>
            <div className="slider-container" style={{ marginTop: '0.4rem' }}>
              <input
                type="range"
                min="1"
                max="10"
                className="slider-input"
                value={modifiedFeatures.OverallQual}
                onChange={(e) => handleSliderChange('OverallQual', Number(e.target.value))}
              />
            </div>
          </div>

          {/* Living Area Slider */}
          <div className="form-group">
            <div className="form-label">
              <span>{DISPLAY_NAME_MAPPING.GrLivArea}</span>
              <span className="slider-val">{modifiedFeatures.GrLivArea} sq ft</span>
            </div>
            <div className="slider-container" style={{ marginTop: '0.4rem' }}>
              <input
                type="range"
                min="600"
                max="4000"
                step="50"
                className="slider-input"
                value={modifiedFeatures.GrLivArea}
                onChange={(e) => handleSliderChange('GrLivArea', Number(e.target.value))}
              />
            </div>
          </div>

          {/* Garage Cars */}
          <div className="form-group">
            <label className="form-label">{DISPLAY_NAME_MAPPING.GarageCars}</label>
            <div className="pill-group" style={{ marginTop: '0.35rem' }}>
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`pill-btn ${modifiedFeatures.GarageCars === n ? 'active' : ''}`}
                  onClick={() => handleSliderChange('GarageCars', n)}
                >
                  {n === 0 ? 'No Garage' : `${n} Car`}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms / Bathrooms side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Bedrooms</label>
              <select
                className="form-control"
                value={modifiedFeatures.BedroomAbvGr}
                onChange={(e) => handleSliderChange('BedroomAbvGr', Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} Bed</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Bathrooms</label>
              <select
                className="form-control"
                value={modifiedFeatures.FullBath}
                onChange={(e) => handleSliderChange('FullBath', Number(e.target.value))}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} Bath</option>
                ))}
              </select>
            </div>
          </div>

          {/* Neighborhood Selector */}
          <div className="form-group">
            <label className="form-label">{DISPLAY_NAME_MAPPING.Neighborhood}</label>
            <select
              className="form-control"
              value={modifiedFeatures.Neighborhood}
              onChange={(e) => handleSliderChange('Neighborhood', e.target.value)}
              style={{ fontWeight: 600 }}
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
            style={{ width: '100%', padding: '0.85rem 1.5rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <PlayCircle size={18} />}
            {loading ? 'Recalculating Valuation...' : 'Calculate Simulated Price'}
          </button>
        </div>

        {/* Results Comparison Block */}
        {error && (
          <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <div className="what-if-split">
              {/* Baseline Card */}
              <div className="compare-block original">
                <span className="compare-label">Baseline House Price</span>
                <span className="compare-price">{result.original_formatted_lakhs}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {result.original_formatted}
                </span>
              </div>
              
              {/* Simulated Card */}
              <div className="compare-block modified">
                <span className="compare-label" style={{ color: 'var(--color-brand)' }}>Simulated House Price</span>
                <span className="compare-price">{result.modified_formatted_lakhs}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {result.modified_formatted}
                </span>
              </div>
            </div>

            {/* Difference Callout */}
            <div className={`diff-callout ${result.direction}`}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                Net Market Value Shift
              </div>
              <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)' }}>
                {result.direction === 'increase' ? '+' : ''}
                {result.formatted_difference} ({result.direction === 'increase' ? '+' : ''}
                {result.percentage_difference.toFixed(2)}%)
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WhatIfPanel;

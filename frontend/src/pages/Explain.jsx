import React, { useState, useEffect } from 'react';
import PriceCard from '../components/PriceCard';
import FeatureContributionChart from '../components/FeatureContributionChart';
import ExplanationSummary from '../components/ExplanationSummary';
import WhatIfPanel from '../components/WhatIfPanel';
import { explainPrediction } from '../services/api';
import { HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

const Explain = ({
  lastFeatures,
  lastPrediction,
  selectedModel,
  metadata,
  setCurrentPage
}) => {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExplanation = async () => {
    if (!lastFeatures) return;
    setLoading(true);
    setError(null);
    try {
      const data = await explainPrediction(selectedModel, lastFeatures);
      setExplanation(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load local explanation from backend. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
  }, [lastFeatures, selectedModel]);

  if (!lastFeatures || !lastPrediction) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Local Prediction Explanation</h1>
          <p className="page-subtitle">Understand how individual features influenced a specific property estimate.</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={48} style={{ color: 'var(--color-academic)', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-academic)', marginBottom: '0.75rem' }}>
            No Active Prediction
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            To see a local explanation, you must first input house features and get a price estimate.
          </p>
          <button onClick={() => setCurrentPage('predict')} className="btn btn-primary">
            Go to Predict Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Local Prediction Explanation</h1>
        <p className="page-subtitle">
          Decomposing the {selectedModel} prediction of <strong>{lastPrediction.formatted_lakhs}</strong>.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button 
          onClick={fetchExplanation} 
          className="btn btn-secondary" 
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Explanation
        </button>
      </div>

      {loading && (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-academic)' }}>
            Calculating local contributions...
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Querying EBM scores / running SHAP kernels in the Python backend.
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!loading && explanation && (
        <div className="dashboard-grid">
          {/* Left Column: Price card and contribution bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <PriceCard prediction={explanation} />
            <FeatureContributionChart contributions={explanation.contributions} />
          </div>

          {/* Right Column: Rationale summary & What-if panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ExplanationSummary explanation={explanation} />
            <WhatIfPanel 
              originalFeatures={lastFeatures} 
              selectedModel={selectedModel} 
              metadata={metadata} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Explain;

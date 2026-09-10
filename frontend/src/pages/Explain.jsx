import React, { useState, useEffect } from 'react';
import PriceCard from '../components/PriceCard';
import FeatureContributionChart from '../components/FeatureContributionChart';
import ExplanationSummary from '../components/ExplanationSummary';
import WhatIfPanel from '../components/WhatIfPanel';
import { explainPrediction } from '../services/api';
import { Sliders, AlertCircle, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

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
      setError('Failed to load local explanation from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
  }, [lastFeatures, selectedModel]);

  if (!lastFeatures || !lastPrediction) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Price Factor Breakdown</h1>
          <p className="page-subtitle">Understand how individual house features shifted the estimated market value up or down.</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <AlertCircle size={44} style={{ color: 'var(--color-brand)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            No Active Valuation Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', maxWidth: '520px', margin: '0 auto 1.75rem auto' }}>
            To view a detailed feature breakdown, please calculate a property estimate first using our valuation tool.
          </p>
          <button onClick={() => setCurrentPage('predict')} className="btn btn-primary">
            <Sparkles size={18} />
            Go to Valuation Tool
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Price Factor Breakdown</h1>
          <p className="page-subtitle">
            Decomposing the {selectedModel} valuation of <strong>{lastPrediction.formatted_lakhs}</strong>.
          </p>
        </div>
        
        <button 
          onClick={fetchExplanation} 
          className="btn btn-secondary" 
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh Factors
        </button>
      </div>

      {loading && (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--color-brand)', margin: '0 auto 1rem auto' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Computing Feature Contributions...
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Calculating exact additive factors in Python backend.
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
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

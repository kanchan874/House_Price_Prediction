import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import PriceCard from '../components/PriceCard';
import PredictionHistory from '../components/PredictionHistory';
import { predictPrice } from '../services/api';
import { AlertCircle, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';

const Predict = ({
  selectedModel,
  setSelectedModel,
  modelMetrics,
  lastFeatures,
  setLastFeatures,
  lastPrediction,
  setLastPrediction,
  history,
  setHistory,
  setCurrentPage
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredictSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const pred = await predictPrice(selectedModel, formData);
      setLastPrediction(pred);
      setLastFeatures(formData);
      
      const newHistoryItem = {
        features: formData,
        predictedPrice: pred.predicted_price,
        priceFormatted: pred.formatted_price,
        priceLakhs: pred.formatted_lakhs,
        modelName: selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Prediction request failed. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadHistory = (item) => {
    setLastFeatures(item.features);
    setSelectedModel(item.modelName);
    const mockPrediction = {
      predicted_price: item.predictedPrice,
      formatted_price: item.priceFormatted,
      formatted_lakhs: item.priceLakhs,
      model_name: item.modelName,
      baseline_price: item.predictedPrice - 100000
    };
    setLastPrediction(mockPrediction);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">House Price Valuation Tool</h1>
        <p className="page-subtitle">
          Customize property characteristics below to estimate current market valuation using trained machine learning models.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Form */}
        <div>
          <PredictionForm
            onSubmit={handlePredictSubmit}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            modelMetrics={modelMetrics}
            initialValues={lastFeatures}
          />
        </div>

        {/* Right Column: Prediction Output and History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {loading && (
            <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--color-brand)', margin: '0 auto 1rem auto' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Running Valuation Inference...
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Evaluating feature vectors with {selectedModel}.
              </p>
            </div>
          )}

          {error && (
            <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {!loading && lastPrediction && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <PriceCard prediction={lastPrediction} />
              
              <div className="card" style={{ textAlign: 'center', backgroundColor: 'var(--color-brand-light)', borderColor: 'var(--color-brand-border)' }}>
                <h4 style={{ color: 'var(--color-brand-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <HelpCircle size={18} />
                  Why did the model predict this valuation?
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.1rem' }}>
                  Explore individual feature contributions, price boosters, and price reducers.
                </p>
                <button
                  onClick={() => setCurrentPage('explain')}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  View Full Price Breakdown <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          <PredictionHistory history={history} onLoadHistory={handleLoadHistory} />
        </div>
      </div>
    </div>
  );
};

export default Predict;

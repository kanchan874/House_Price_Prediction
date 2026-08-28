import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import PriceCard from '../components/PriceCard';
import PredictionHistory from '../components/PredictionHistory';
import { predictPrice } from '../services/api';
import { AlertCircle, HelpCircle } from 'lucide-react';

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
      
      // Save to session history
      const newHistoryItem = {
        features: formData,
        predictedPrice: pred.predicted_price,
        priceFormatted: pred.formatted_price,
        priceLakhs: pred.formatted_lakhs,
        modelName: selectedModel,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Prediction request failed. Ensure the backend server is running and models are trained.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadHistory = (item) => {
    // Reload into current form state and last prediction
    setLastFeatures(item.features);
    setSelectedModel(item.modelName);
    const mockPrediction = {
      predicted_price: item.predictedPrice,
      formatted_price: item.priceFormatted,
      formatted_lakhs: item.priceLakhs,
      model_name: item.modelName,
      baseline_price: item.predictedPrice - 100000 // approximation
    };
    setLastPrediction(mockPrediction);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Predict House Price</h1>
        <p className="page-subtitle">
          Fill in the property details below and select a machine learning model to estimate the market valuation.
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
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-academic)' }}>
                Executing model inference...
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Preprocessing input vectors and running predictions in backend.
              </p>
            </div>
          )}

          {error && (
            <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {!loading && lastPrediction && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <PriceCard prediction={lastPrediction} />
              
              <div className="card" style={{ textAlign: 'center', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff' }}>
                <h4 style={{ color: 'var(--color-academic)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <HelpCircle size={18} />
                  Why did the model predict this price?
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  This prediction is based on the combined contributions of 15 features. Explore the exact positive/negative factors.
                </p>
                <button
                  onClick={() => setCurrentPage('explain')}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  View Local Explanation Detail
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

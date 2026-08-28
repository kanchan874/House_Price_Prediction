import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Explain from './pages/Explain';
import Model from './pages/Model';
import About from './pages/About';
import { getFeatureMetadata, getModelMetrics, getFeatureImportance, getHealth } from './services/api';
import { AlertCircle } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedModel, setSelectedModel] = useState('Explainable Boosting Machine');
  
  // Model Data States
  const [metadata, setMetadata] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [globalImportance, setGlobalImportance] = useState(null);
  
  // Inference States
  const [lastFeatures, setLastFeatures] = useState(null);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      setBackendError(null);
      try {
        // Verify server is reachable first
        await getHealth();
        
        // Load metadata, metrics and global importances
        const [metaData, metricsData, importanceData] = await Promise.all([
          getFeatureMetadata(),
          getModelMetrics(),
          getFeatureImportance()
        ]);
        
        setMetadata(metaData);
        setModelMetrics(metricsData);
        setGlobalImportance(importanceData);
      } catch (error) {
        console.error('Failed to load initial data from backend API:', error);
        setBackendError(
          'FastAPI Backend Server is unreachable or models are not trained yet. ' +
          'Please ensure uvicorn is running on http://localhost:8001 and ml/train.py has executed successfully.'
        );
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'predict':
        return (
          <Predict
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            modelMetrics={modelMetrics}
            lastFeatures={lastFeatures}
            setLastFeatures={setLastFeatures}
            lastPrediction={lastPrediction}
            setLastPrediction={setLastPrediction}
            history={history}
            setHistory={setHistory}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'explain':
        return (
          <Explain
            lastFeatures={lastFeatures}
            lastPrediction={lastPrediction}
            selectedModel={selectedModel}
            metadata={metadata}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'model':
        return (
          <Model
            modelMetrics={modelMetrics}
            selectedModel={selectedModel}
            globalImportance={globalImportance}
            metadata={metadata}
          />
        );
      case 'about':
        return <About />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main style={{ flexGrow: 1 }} className="container">
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem', fontSize: '1.2rem', color: 'var(--color-academic)', fontWeight: 'bold' }}>
            Initializing Academic XAI Platform...
          </div>
        )}

        {backendError && (
          <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1.5rem' }}>
            <AlertCircle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.25rem' }}>API Connection Error</strong>
              {backendError}
            </div>
          </div>
        )}

        {!loading && !backendError && renderPage()}
      </main>

      <footer style={{ backgroundColor: '#111827', color: '#9ca3af', padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', borderTop: '1px solid #1f2937' }}>
        <p>House Price Prediction Dashboard using Explainable AI (XAI)</p>
        <p style={{ marginTop: '0.25rem' }}>Linear Regression • Explainable Boosting Machine • Random Forest (SHAP)</p>
      </footer>
    </div>
  );
}

export default App;

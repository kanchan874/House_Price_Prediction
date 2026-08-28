import React from 'react';
import { Home as HomeIcon, Award, ShieldAlert, Sliders, Layers } from 'lucide-react';

const Home = ({ setCurrentPage }) => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">House Price Prediction Using Interpretable Machine Learning Models</h1>
        <p className="page-subtitle">
          Estimate residential property values in Ames, Iowa, and explore the exact feature contributions that drive the model's predictions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Main Hero Card */}
        <div className="card" style={{ padding: '2.5rem 2rem', backgroundColor: '#fcfdfd', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '2px solid var(--color-academic)' }}>
          <HomeIcon size={48} style={{ color: 'var(--color-academic)', marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-academic)', fontSize: '1.75rem', marginBottom: '1rem' }}>
            Predict with Explanations
          </h2>
          <p style={{ maxWidth: '750px', color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '1.05rem', lineHeight: '1.7' }}>
            Most modern real estate valuation systems act as "black-boxes," providing estimations without justification. 
            This academic project demonstrates a transparent alternative using **Explainable AI (XAI)**. 
            By combining Linear Regression, Explainable Boosting Machines (EBM), and Random Forest, we offer not only accurate predictions but also a granular explanation for why a specific price was estimated.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setCurrentPage('predict')} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              Predict House Price
            </button>
            <button onClick={() => setCurrentPage('model')} className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              Explore Model Metrics
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-academic)', fontSize: '1.35rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            Key Features of the XAI System
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Feature 1 */}
            <div className="card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-academic)', fontWeight: 'bold' }}>
                <Award size={20} />
                Accurate Price Predictions
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Predicts estimated prices using models trained on the standard Ames Housing dataset, with values scaled to Indian Rupees (INR) for local readability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-academic)', fontWeight: 'bold' }}>
                <Layers size={20} />
                Local Feature Explanations
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Breaks down each prediction into an additive sum of individual feature adjustments, showing how living area, quality, and age shift the price up or down.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-academic)', fontWeight: 'bold' }}>
                <Sliders size={20} />
                What-If Simulation
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Allows users to dynamically alter feature values (e.g. increase square footage) and query the model to see the calculated difference instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-academic)', fontWeight: 'bold' }}>
                <ShieldAlert size={20} />
                Model Transparency
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Exposes global feature importances, partial dependency response curves, and performance metrics (MAE, RMSE, R²) to compare model architectures.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React from 'react';
import { Info, HelpCircle } from 'lucide-react';

const ModelMetrics = ({ metrics, selectedModel }) => {
  if (!metrics) {
    return (
      <div className="card">
        <div className="card-title">Model Evaluation Metrics</div>
        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading evaluation metrics...
        </div>
      </div>
    );
  }

  // Format currency helpers for display
  const formatMetricCurrency = (val) => {
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="card">
      <div className="card-title">Model Comparison Matrix</div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        The table below displays actual performance scores computed on unseen test data during model training.
      </p>

      <table className="metric-table">
        <thead>
          <tr>
            <th>Model Architecture</th>
            <th>MAE (Mean Abs Error)</th>
            <th>RMSE (Root Mean Sq Error)</th>
            <th>R² (Variance Explained)</th>
            <th>Interpretability Level</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(metrics).map(([name, scores]) => {
            const isSelected = name === selectedModel;
            return (
              <tr key={name} className={isSelected ? 'selected' : ''}>
                <td>
                  {name} {isSelected ? ' (Active)' : ''}
                </td>
                <td>{formatMetricCurrency(scores.MAE)}</td>
                <td>{formatMetricCurrency(scores.RMSE)}</td>
                <td>{scores.R2.toFixed(4)}</td>
                <td>
                  {name === 'Linear Regression' ? 'High (Linear coefficients)' :
                   name === 'Explainable Boosting Machine' ? 'High (Nonlinear curves)' :
                   'Low (Black-box ensemble)'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Model Selection Explanation */}
      <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', backgroundColor: '#f0f4fe', border: '1px solid #bfdbfe', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <Info size={20} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--color-academic)' }}>Why EBM was Selected:</strong>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Explainable Boosting Machines (EBM) are generalized additive models trained using gradient boosting. 
            Unlike Random Forest, EBM enforces **additivity** (each feature's contribution is computed independently of other variables), 
            meaning we can explain predictions with exact local contributions without losing the capacity to model non-linear relations. EBM provides near black-box accuracy with white-box transparency!
          </p>
        </div>
      </div>

      {/* Metric Definitions */}
      <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '1.25rem' }}>
        <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-academic)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '0.75rem' }}>
          <HelpCircle size={16} />
          Academic Definition of Metrics
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <p>
            <strong>Mean Absolute Error (MAE):</strong> Measures the average absolute difference between predicted and actual prices. A MAE of ₹15 Lakhs means predictions are, on average, off by ₹15 Lakhs.
          </p>
          <p>
            <strong>Root Mean Squared Error (RMSE):</strong> Similar to MAE but squares errors before averaging. This penalizes larger errors more heavily, highlighting models that make occasional extreme errors.
          </p>
          <p>
            <strong>R² Score (Coefficient of Determination):</strong> Represents the proportion of variance in housing prices that is predictable from the input features. An R² of 0.85 means the model explains 85% of the price variations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelMetrics;

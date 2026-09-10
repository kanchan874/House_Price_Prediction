import React from 'react';
import { Info, BarChart2 } from 'lucide-react';

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

  const formatMetricCurrency = (val) => {
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="card animate-fade-in">
      <div className="card-title">
        <BarChart2 size={20} style={{ color: 'var(--color-brand)' }} />
        Model Comparison Matrix
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Performance metrics evaluated on unseen test data during model training.
      </p>

      <table className="metric-table">
        <thead>
          <tr>
            <th>Model Architecture</th>
            <th>MAE (Mean Abs Error)</th>
            <th>RMSE (Root Mean Sq Error)</th>
            <th>R² Score</th>
            <th>Interpretability Level</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(metrics).map(([name, scores]) => {
            const isSelected = name === selectedModel;
            return (
              <tr key={name} className={isSelected ? 'selected' : ''}>
                <td>
                  <strong>{name}</strong> {isSelected ? ' (Active)' : ''}
                </td>
                <td>{formatMetricCurrency(scores.MAE)}</td>
                <td>{formatMetricCurrency(scores.RMSE)}</td>
                <td style={{ fontWeight: 700, color: 'var(--color-brand-dark)' }}>{scores.R2.toFixed(4)}</td>
                <td>
                  {name === 'Linear Regression' ? 'High (Linear weights)' :
                   name === 'Explainable Boosting Machine' ? 'High (Additive curves)' :
                   'Low (Black-box ensemble)'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Model Selection Explanation */}
      <div style={{
        display: 'flex',
        gap: '0.85rem',
        padding: '1.25rem',
        backgroundColor: 'var(--color-brand-light)',
        border: '1px solid var(--color-brand-border)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.9rem'
      }}>
        <Info size={22} style={{ color: 'var(--color-brand)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--color-brand-dark)', display: 'block', marginBottom: '0.25rem' }}>Why EBM is Recommended:</strong>
          <p style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
            Explainable Boosting Machines (EBM) offer black-box tree accuracy while enforcing <strong>100% mathematical additivity</strong>, allowing us to explain predictions with exact local contributions without losing complex feature relationships.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelMetrics;

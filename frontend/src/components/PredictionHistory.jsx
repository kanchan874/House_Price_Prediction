import React from 'react';
import { History, ArrowRight } from 'lucide-react';

const PredictionHistory = ({ history, onLoadHistory }) => {
  if (!history || history.length === 0) {
    return (
      <div className="card">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} />
          Prediction History
        </div>
        <div style={{ padding: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          No predictions performed in this session.
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem' }}>
        <History size={18} />
        Prediction History ({history.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '250px', overflowY: 'auto' }}>
        {history.map((item, idx) => (
          <div key={idx} className="history-item">
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--color-academic)' }}>
                {item.priceLakhs}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                {item.features.GrLivArea} sq ft, {item.features.BedroomAbvGr}BHK in {item.features.Neighborhood}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>
                Model: {item.modelName}
              </div>
            </div>
            <button
              onClick={() => onLoadHistory(item)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Reload this property details"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory;

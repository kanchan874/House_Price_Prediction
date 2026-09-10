import React from 'react';
import { History, ArrowRight } from 'lucide-react';

const PredictionHistory = ({ history, onLoadHistory }) => {
  if (!history || history.length === 0) {
    return (
      <div className="card">
        <div className="card-title">
          <History size={18} style={{ color: 'var(--color-brand)' }} />
          Session History
        </div>
        <div style={{ padding: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          No valuations performed in this session yet.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">
        <History size={18} style={{ color: 'var(--color-brand)' }} />
        Recent Valuations ({history.length})
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
        {history.map((item, idx) => (
          <div key={idx} className="history-item">
            <div>
              <div style={{ fontWeight: 800, color: 'var(--color-brand-dark)', fontSize: '1rem' }}>
                {item.priceLakhs}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.1rem' }}>
                {item.features.GrLivArea} sq ft • {item.features.BedroomAbvGr} Bed in {item.features.Neighborhood}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                Model: {item.modelName} ({item.timestamp})
              </div>
            </div>
            
            <button
              onClick={() => onLoadHistory(item)}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
              title="Reload parameters"
            >
              Load <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory;

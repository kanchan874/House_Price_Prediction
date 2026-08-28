import React from 'react';
import { Home } from 'lucide-react';

const PriceCard = ({ prediction }) => {
  if (!prediction) return null;

  const { predicted_price, formatted_price, formatted_lakhs, model_name, baseline_price } = prediction;

  // Simple formatting for baseline
  const formattedBaseline = baseline_price >= 100000 
    ? `₹${(baseline_price / 100000).toFixed(2)} Lakhs`
    : `₹${Math.round(baseline_price).toLocaleString()}`;

  return (
    <div className="price-display">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
        <Home size={18} />
        <span style={{ fontSize: '0.9rem', fontWeight: 600, uppercase: 'true' }}>Predicted Property Estimate</span>
      </div>
      <div className="price-val">{formatted_lakhs}</div>
      <div className="price-subval">Full Valuation: {formatted_price}</div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span className="price-meta">
          Model: {model_name}
        </span>
        <span className="price-meta" style={{ backgroundColor: '#f1f5f9', color: '#4b5563' }}>
          Baseline Intercept: {formattedBaseline}
        </span>
      </div>
    </div>
  );
};

export default PriceCard;

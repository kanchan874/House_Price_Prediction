import React from 'react';
import { Home, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

const PriceCard = ({ prediction }) => {
  if (!prediction) return null;

  const { predicted_price, formatted_price, formatted_lakhs, model_name, baseline_price } = prediction;

  const formattedBaseline = baseline_price >= 100000 
    ? `₹${(baseline_price / 100000).toFixed(2)} Lakhs`
    : `₹${Math.round(baseline_price).toLocaleString()}`;

  // Estimate USD valuation for global perspective (approx rate ~ 83 INR/USD)
  const usdValue = Math.round(predicted_price / 83.3).toLocaleString();

  return (
    <div className="price-display animate-fade-in">
      <div className="price-label">
        <Sparkles size={16} />
        Estimated Market Valuation
      </div>
      
      <div className="price-val">{formatted_lakhs}</div>
      <div className="price-subval">Full Currency Estimate: {formatted_price} • (${usdValue} USD)</div>
      
      <div className="price-meta-group">
        <span className="price-meta">
          <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          Model: {model_name}
        </span>
        <span className="price-meta" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--color-border)' }}>
          Base Market Average: {formattedBaseline}
        </span>
      </div>
    </div>
  );
};

export default PriceCard;

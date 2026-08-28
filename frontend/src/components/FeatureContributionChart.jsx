import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DISPLAY_NAME_MAPPING = {
  OverallQual: 'Overall Quality',
  GrLivArea: 'Living Area',
  YearBuilt: 'Year Built',
  YearRemodAdd: 'Year Remodeled',
  TotalBsmtSF: 'Basement Area',
  GarageCars: 'Garage Capacity (Cars)',
  GarageArea: 'Garage Area',
  FullBath: 'Bathrooms',
  BedroomAbvGr: 'Bedrooms',
  TotRmsAbvGrd: 'Total Rooms',
  Fireplaces: 'Fireplaces',
  '1stFlrSF': '1st Floor Area',
  '2ndFlrSF': '2nd Floor Area',
  LotArea: 'Lot Area',
  Neighborhood: 'Neighborhood'
};

const FeatureContributionChart = ({ contributions }) => {
  if (!contributions || contributions.length === 0) return null;

  // Find max absolute contribution to scale bars
  const maxAbsContrib = Math.max(...contributions.map((c) => Math.abs(c.contribution)), 1);

  return (
    <div className="card">
      <div className="card-title">Local Feature Contributions (Why this Prediction?)</div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Bars represent how much each feature increased (+) or decreased (-) the model's price prediction relative to its baseline value.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Table Header */}
        <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-secondary)', borderBottom: '1.5px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
          <div style={{ width: '180px', flexShrink: 0 }}>Feature</div>
          <div style={{ width: '80px', flexShrink: 0, textAlign: 'right', paddingRight: '1rem' }}>Value</div>
          <div style={{ flexGrow: 1, textAlign: 'center' }}>
            <span style={{ color: 'var(--color-negative)' }}>← Decreased</span>
            <span style={{ margin: '0 1.5rem', color: 'var(--text-light)' }}>| Baseline</span>
            <span style={{ color: 'var(--color-positive)' }}>Increased →</span>
          </div>
          <div style={{ width: '110px', flexShrink: 0, textAlign: 'right', paddingLeft: '1rem' }}>Effect</div>
        </div>

        {/* Contribution Rows */}
        {contributions.map((item) => {
          const displayName = DISPLAY_NAME_MAPPING[item.feature] || item.feature;
          const absVal = Math.abs(item.contribution);
          const barWidthPercent = (absVal / maxAbsContrib) * 45; // Max 45% of width on either side
          const isPositive = item.direction === 'positive';
          const isNegative = item.direction === 'negative';
          
          return (
            <div key={item.feature} className="contrib-row">
              {/* Feature name */}
              <div className="contrib-name" title={item.feature}>{displayName}</div>
              
              {/* Feature value */}
              <div className="contrib-val" title="Original input feature value">{item.value}</div>
              
              {/* Bidirectional bar */}
              <div className="contrib-bar-container" style={{ position: 'relative', height: '22px', backgroundColor: '#f3f4f6', borderRadius: '3px' }}>
                {/* Baseline middle separator */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', backgroundColor: '#9ca3af', zIndex: 10 }}></div>
                
                {/* Horizontal bar */}
                <div
                  className={`contrib-bar ${item.direction}`}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    bottom: '2px',
                    left: isPositive ? '50%' : `calc(50% - ${barWidthPercent}%)`,
                    width: `${barWidthPercent}%`,
                    borderRadius: '2px',
                    backgroundColor: isPositive ? 'var(--color-positive)' : isNegative ? 'var(--color-negative)' : 'transparent',
                    opacity: 0.85
                  }}
                ></div>
              </div>
              
              {/* Text value for the contribution */}
              <div className={`contrib-effect-val ${item.direction}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                {isPositive && <ArrowUpRight size={14} />}
                {isNegative && <ArrowDownRight size={14} />}
                {item.formatted_contribution}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureContributionChart;

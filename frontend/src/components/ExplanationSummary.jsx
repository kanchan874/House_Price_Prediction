import React from 'react';
import { ShieldCheck, PlusCircle, MinusCircle, AlertCircle } from 'lucide-react';

const format_indian_currency = (num) => {
  const rounded = Math.round(Number(num));
  if (isNaN(rounded)) return '₹0';
  const s = Math.abs(rounded).toString();
  let formatted = '';
  if (s.length <= 3) {
    formatted = s;
  } else {
    const lastThree = s.substring(s.length - 3);
    let remaining = s.substring(0, s.length - 3);
    const groups = [];
    while (remaining.length > 0) {
      groups.push(remaining.substring(Math.max(0, remaining.length - 2)));
      remaining = remaining.substring(0, Math.max(0, remaining.length - 2));
    }
    groups.reverse();
    formatted = groups.join(',') + ',' + lastThree;
  }
  const prefix = rounded < 0 ? '-' : '';
  return `${prefix}₹${formatted}`;
};

const format_lakhs_or_crores = (num) => {
  const val = Number(num);
  if (isNaN(val)) return '₹0';
  const absVal = Math.abs(val);
  const prefix = val < 0 ? '-' : '';
  if (absVal >= 10000000) {
    return `${prefix}₹${(absVal / 10000000).toFixed(2)} Crores`;
  } else if (absVal >= 100000) {
    return `${prefix}₹${(absVal / 100000).toFixed(2)} Lakhs`;
  } else {
    return format_indian_currency(val);
  }
};

const ExplanationSummary = ({ explanation }) => {
  if (!explanation) return null;

  const {
    predicted_price,
    formatted_price,
    formatted_lakhs,
    model_name,
    baseline_price,
    formatted_baseline,
    contributions,
    positive_contributors,
    negative_contributors,
    explanation_text
  } = explanation;

  // Filter out columns with small values
  const strongPositives = contributions
    .filter((c) => c.contribution > 5000)
    .slice(0, 4);

  const strongNegatives = contributions
    .filter((c) => c.contribution < -5000)
    .slice(0, 4);

  const DISPLAY_NAME_MAPPING = {
    OverallQual: 'Overall Quality',
    GrLivArea: 'Living Area',
    YearBuilt: 'Year Built',
    YearRemodAdd: 'Year Remodeled',
    TotalBsmtSF: 'Basement Area',
    GarageCars: 'Garage Capacity',
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

  return (
    <div className="card">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck size={20} className="text-primary" />
        Prediction Explanation Summary
      </div>

      {/* Explanatory text card */}
      <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
        <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: 'var(--color-academic)' }}>
          Model Rationale
        </span>
        {explanation_text}
      </div>

      {/* Positive & Negative Factors Grid */}
      <div className="factors-grid">
        {/* Positives list */}
        <div className="factor-card positive">
          <div className="factor-list-title positive">
            <PlusCircle size={18} />
            Top Price-Increasing Factors
          </div>
          <ul className="factor-list">
            {strongPositives.length > 0 ? (
              strongPositives.map((c) => (
                <li key={c.feature}>
                  <strong>{DISPLAY_NAME_MAPPING[c.feature] || c.feature}</strong> ({c.value}):{' '}
                  <span style={{ color: 'var(--color-positive)', fontWeight: 'bold' }}>
                    {c.formatted_contribution}
                  </span>
                </li>
              ))
            ) : (
              <li style={{ listStyleType: 'none', color: 'var(--text-secondary)' }}>No major positive contributions.</li>
            )}
          </ul>
        </div>

        {/* Negatives list */}
        <div className="factor-card negative">
          <div className="factor-list-title negative">
            <MinusCircle size={18} />
            Top Price-Decreasing Factors
          </div>
          <ul className="factor-list">
            {strongNegatives.length > 0 ? (
              strongNegatives.map((c) => (
                <li key={c.feature}>
                  <strong>{DISPLAY_NAME_MAPPING[c.feature] || c.feature}</strong> ({c.value}):{' '}
                  <span style={{ color: 'var(--color-negative)', fontWeight: 'bold' }}>
                    {c.formatted_contribution}
                  </span>
                </li>
              ))
            ) : (
              <li style={{ listStyleType: 'none', color: 'var(--text-secondary)' }}>No major negative contributions.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Math Formulation summary */}
      <div style={{ marginTop: '1.5rem', borderTop: '1px dashed var(--color-border)', paddingTop: '1.25rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Prediction Decomposition Formula:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Baseline ({formatted_baseline})</span>
          <span>+</span>
          <span style={{ color: 'var(--color-positive)', fontWeight: 'bold' }}>
            Positives (+{format_lakhs_or_crores(contributions.filter(c => c.contribution > 0).reduce((acc, c) => acc + c.contribution, 0))})
          </span>
          <span>-</span>
          <span style={{ color: 'var(--color-negative)', fontWeight: 'bold' }}>
            Negatives ({format_lakhs_or_crores(Math.abs(contributions.filter(c => c.contribution < 0).reduce((acc, c) => acc + c.contribution, 0)))})
          </span>
          <span>=</span>
          <span style={{ color: 'var(--color-academic)', fontWeight: 'bold' }}>Prediction ({formatted_lakhs})</span>
        </div>
      </div>
    </div>
  );
};

export default ExplanationSummary;

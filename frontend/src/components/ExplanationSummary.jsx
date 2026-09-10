import React from 'react';
import { ShieldCheck, ArrowUpRight, ArrowDownRight, Sparkles, Info } from 'lucide-react';

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

const DISPLAY_NAME_MAPPING = {
  OverallQual: 'Overall Quality & Finish',
  GrLivArea: 'Living Area Space',
  YearBuilt: 'Year Built',
  YearRemodAdd: 'Year Remodeled',
  TotalBsmtSF: 'Basement Space',
  GarageCars: 'Garage Capacity',
  GarageArea: 'Garage Area',
  FullBath: 'Full Bathrooms',
  BedroomAbvGr: 'Bedrooms',
  TotRmsAbvGrd: 'Total Rooms',
  Fireplaces: 'Fireplaces',
  '1stFlrSF': '1st Floor Area',
  '2ndFlrSF': '2nd Floor Area',
  LotArea: 'Total Lot Size',
  Neighborhood: 'Neighborhood Location'
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

  const strongPositives = contributions
    .filter((c) => c.contribution > 5000)
    .slice(0, 5);

  const strongNegatives = contributions
    .filter((c) => c.contribution < -5000)
    .slice(0, 5);

  const totalPositivesSum = contributions
    .filter((c) => c.contribution > 0)
    .reduce((acc, c) => acc + c.contribution, 0);

  const totalNegativesSum = Math.abs(
    contributions
      .filter((c) => c.contribution < 0)
      .reduce((acc, c) => acc + c.contribution, 0)
  );

  return (
    <div className="card animate-fade-in">
      <div className="card-title">
        <ShieldCheck size={20} style={{ color: 'var(--color-brand)' }} />
        Valuation Breakdown & Key Factors
      </div>

      {/* Natural language summary box */}
      <div style={{
        backgroundColor: 'var(--color-brand-light)',
        border: '1px solid var(--color-brand-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontWeight: 700, color: 'var(--color-brand-dark)' }}>
          <Sparkles size={18} />
          Model Valuation Summary
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
          {explanation_text}
        </p>
      </div>

      {/* Positive & Negative Factors Side by Side */}
      <div className="factors-grid">
        {/* Positives Card */}
        <div className="factor-card positive">
          <div className="factor-list-title positive">
            <ArrowUpRight size={20} />
            Key Price Boosters (+ Value)
          </div>
          <ul className="factor-list">
            {strongPositives.length > 0 ? (
              strongPositives.map((c) => (
                <li key={c.feature}>
                  <strong>{DISPLAY_NAME_MAPPING[c.feature] || c.feature}</strong> ({c.value}):{' '}
                  <span style={{ color: 'var(--color-positive)', fontWeight: 700 }}>
                    +{c.formatted_contribution}
                  </span>
                </li>
              ))
            ) : (
              <li style={{ color: 'var(--text-secondary)' }}>No major positive factor adjustments.</li>
            )}
          </ul>
        </div>

        {/* Negatives Card */}
        <div className="factor-card negative">
          <div className="factor-list-title negative">
            <ArrowDownRight size={20} />
            Price Reducers (- Value)
          </div>
          <ul className="factor-list">
            {strongNegatives.length > 0 ? (
              strongNegatives.map((c) => (
                <li key={c.feature}>
                  <strong>{DISPLAY_NAME_MAPPING[c.feature] || c.feature}</strong> ({c.value}):{' '}
                  <span style={{ color: 'var(--color-negative)', fontWeight: 700 }}>
                    {c.formatted_contribution}
                  </span>
                </li>
              ))
            ) : (
              <li style={{ color: 'var(--text-secondary)' }}>No major negative factor adjustments.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Simple Equation breakdown */}
      <div style={{ marginTop: '1.75rem', borderTop: '1px dashed var(--color-border)', paddingTop: '1.25rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <Info size={16} />
          Exact Additive Composition:
        </span>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          alignItems: 'center',
          fontSize: '0.9rem',
          padding: '0.85rem 1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>Base Avg ({formatted_baseline})</span>
          <span style={{ fontWeight: 700 }}>+</span>
          <span style={{ color: 'var(--color-positive)', fontWeight: 700 }}>
            Boosts (+{format_lakhs_or_crores(totalPositivesSum)})
          </span>
          <span style={{ fontWeight: 700 }}>-</span>
          <span style={{ color: 'var(--color-negative)', fontWeight: 700 }}>
            Reductions (-{format_lakhs_or_crores(totalNegativesSum)})
          </span>
          <span style={{ fontWeight: 700 }}>=</span>
          <span style={{ color: 'var(--color-brand-dark)', fontWeight: 800, fontSize: '1rem' }}>
            Est. Price ({formatted_lakhs})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExplanationSummary;

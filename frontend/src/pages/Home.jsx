import React from 'react';
import { Home as HomeIcon, Sparkles, Sliders, ShieldCheck, ArrowRight, Award, TrendingUp, Building } from 'lucide-react';

const Home = ({ setCurrentPage }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div
        className="card"
        style={{
          padding: '3.5rem 2rem',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#ffffff',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#93c5fd',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={16} />
            Explainable Real Estate AI Platform
          </div>

          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.03em'
          }}>
            Smart House Price Prediction & Valuation
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: '#cbd5e1',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Estimate property market values with full transparency. Unlike mystery black-box valuation tools, HomeValuer shows you the exact positive and negative factors driving every price.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage('predict')}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem' }}
            >
              Start Price Estimation <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setCurrentPage('explain')}
              className="btn btn-secondary"
              style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              How It Works
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
          Why Use HomeValuer?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          
          {/* Card 1 */}
          <div className="card" style={{ margin: 0 }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-brand-light)',
              color: 'var(--color-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Award size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Multi-Model Accuracy
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Trained on standard residential datasets with predictions converted into ₹ Lakhs/Crores for intuitive clarity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ margin: 0 }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-positive-bg)',
              color: 'var(--color-positive)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Granular Factor Breakdown
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              See exact rupee contributions for square footage, build quality, garage capacity, and neighborhood location.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ margin: 0 }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fff7ed',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Sliders size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Renovation Simulator
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Interactively adjust home parameters to calculate instant price lifts for planned extensions or renovations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card" style={{ margin: 0 }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#f3e8ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <TrendingUp size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Transparent ML Metrics
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Compare R² scores, Mean Absolute Error (MAE), and global feature importance curves across algorithms.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;

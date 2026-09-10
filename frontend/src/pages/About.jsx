import React from 'react';
import { BookOpen, AlertTriangle, Cpu, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Methodology & System Architecture</h1>
        <p className="page-subtitle">Learn about our transparent valuation platform, machine learning models, and explainability algorithms.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Section 1: Objective & Stack */}
        <div className="card">
          <div className="card-title">
            <BookOpen size={20} style={{ color: 'var(--color-brand)' }} />
            System Objective & Technology Stack
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
            HomeValuer was designed to demonstrate transparent real estate price estimation. By combining Explainable Boosting Machines (EBM), SHAP feature attribution, and interactive counterfactual simulation, users can understand why a property is valued at a specific price.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Training Dataset</strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Ames Iowa Housing Dataset with 1,460 property records and 15 highly predictive features.
              </p>
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Core Stack</strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                React + Vite, FastAPI, Scikit-Learn, InterpretML (EBM), Recharts, and Lucide Icons.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Currency Scaling</strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Prices scaled to Indian Rupees (₹ Lakhs / Crores) with real-time USD conversion references.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: XAI Concepts */}
        <div className="card">
          <div className="card-title">
            <Cpu size={20} style={{ color: 'var(--color-brand)' }} />
            Explainable AI (XAI) Architecture
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Why Explainable AI?
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Traditional real estate valuation tools run closed proprietary algorithms without revealing why a property estimate was produced. Explainable AI decomposes predictions into individual, additive feature contributions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <h4 style={{ color: 'var(--color-brand-dark)', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: 700 }}>
                Explainable Boosting Machine (EBM)
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                A state-of-the-art Generalized Additive Model (GAM). Fits non-linear feature curves while preserving 100% mathematical additivity for exact explanations.
              </p>
            </div>

            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <h4 style={{ color: 'var(--color-brand-dark)', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: 700 }}>
                Random Forest & SHAP Values
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Uses game-theoretic Shapley Additive Explanations (SHAP) to fairly allocate feature importance across decision tree ensembles.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Limitations & Causal Warning */}
        <div className="card" style={{ borderColor: 'var(--color-negative-border)' }}>
          <div className="card-title" style={{ color: 'var(--color-negative)' }}>
            <AlertTriangle size={20} />
            Important Model Limitations
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-negative-bg)',
            borderLeft: '4px solid var(--color-negative)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            <strong style={{ color: '#9f1239', display: 'block', marginBottom: '0.25rem' }}>Model Association vs Causal Reality</strong>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
              Explanations reflect what the machine learning model has learned from training data correlations. They indicate model reasoning, not necessarily causal physical real estate guarantees.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;

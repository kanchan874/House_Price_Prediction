import React from 'react';
import { BookOpen, AlertTriangle, Cpu, HelpCircle } from 'lucide-react';

const About = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Project Methodology & XAI Theory</h1>
        <p className="page-subtitle">Academic project report on house price prediction using explainable machine learning models.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Section 1: Objective & Stack */}
        <div className="card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} />
            1. Project Overview & Objective
          </div>
          <p style={{ marginBottom: '1rem' }}>
            The primary objective of this project is to develop a transparent machine learning application for residential real estate valuation. 
            By designing a unified Explainable AI (XAI) framework, we aim to bridge the gap between high accuracy predictions and human understanding.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div>
              <strong>Dataset:</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Ames Housing Dataset (Ames, Iowa). Comprises physical features of 1,460 residential properties, featuring size, quality, location, and age.
              </p>
            </div>
            <div>
              <strong>Feature Selection:</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                15 highly descriptive features selected to keep explanations clear and cognitively manageable (14 numeric features and 1 categorical feature).
              </p>
            </div>
            <div>
              <strong>Technology Stack:</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                <strong>Frontend:</strong> React + Vite, Recharts, Axios.<br />
                <strong>Backend:</strong> Python, FastAPI, Scikit-Learn, InterpretML (EBM), SHAP.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: XAI Concepts */}
        <div className="card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={20} />
            2. Explainable AI (XAI) Concepts
          </div>
          
          <div className="about-section">
            <h3>What is Explainable AI?</h3>
            <p>
              Explainable AI (XAI) is a subfield of machine learning focused on making the decisions of complex algorithms understandable to human domain experts. 
              Traditional machine learning models (like deep neural networks or Random Forests) operate as "black-boxes" where it is hard to trace how an input produces a specific output. 
              XAI restores trust and transparency.
            </p>
          </div>

          <div className="about-section">
            <h3>Global vs Local Explainability</h3>
            <p>
              Our system demonstrates the fundamental distinction between global and local explainability:
            </p>
            <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Global Explainability:</strong> Answers: <em>"What features generally matter to the model across the entire dataset?"</em>. 
                This is visualized on the Model Metrics page, showing that Overall Quality and Living Area carry the largest weights overall.
              </li>
              <li>
                <strong>Local Explainability:</strong> Answers: <em>"Why did this specific house receive its predicted price?"</em>. 
                This decomposes an individual prediction into additive feature adjustments relative to the dataset average (intercept).
              </li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Interpretable Models: Linear Regression & EBM</h3>
            <p>
              Instead of training a black box and retrofitting post-hoc explanations (which can be unstable), we prioritize models that are **inherently interpretable**:
            </p>
            <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Linear Regression:</strong> Fits a linear equation: $Price = \beta_0 + \beta_1(Area) + \beta_2(Quality) ...$. The coefficient directly represents the rate of change. 
                It is highly interpretable but cannot model nonlinear trends (e.g. price flattening for huge properties).
              </li>
              <li>
                <strong>Explainable Boosting Machine (EBM):</strong> A state-of-the-art Generalized Additive Model (GAM) trained via boosting. 
                It represents relation as: $Price = \beta_0 + f_1(Area) + f_2(Quality) ...$. 
                Each feature term $f_i(x_i)$ is a nonlinear curve (spline/tree). EBM fits complex curvilinear trends while maintaining **100% mathematical additivity**, allowing exact local explanations.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: Limitations & Causal Warning */}
        <div className="card" style={{ borderColor: '#fca5a5' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-negative)' }}>
            <AlertTriangle size={20} />
            3. Scientific Integrity & Limitations
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-negative-bg)', borderLeft: '4px solid var(--color-negative)', borderRadius: 'var(--border-radius)', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--color-negative)' }}>
            <strong>CRITICAL CONCEPT: Correlation vs. Causality</strong>
            <p style={{ marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              In explainable machine learning, it is vital to distinguish between model correlation and real-world causality. 
              If the model indicates `Living Area → +₹8.4L`, this means: <em>"The model associates this amount of living area with an increase in the prediction."</em> 
              It does <strong>NOT</strong> prove that adding an extra bedroom causes the property's physical value to rise by exactly that amount. 
              Explanations reflect the model's inner reasoning, not physical laws of causality.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <p>
              <strong>Data Scope:</strong> The dataset is limited to historical sales in Ames, Iowa, from 2006 to 2010. It does not reflect modern real estate conditions in other cities or countries.
            </p>
            <p>
              <strong>Dataset Biases:</strong> Models reflect whatever biases are present in the training data. If older homes were undervalued due to localized historical factors, the model will replicate this undervaluation.
            </p>
            <p>
              <strong>Omitted Variables:</strong> Real property valuations depend on external factors not captured in the dataset, such as school ratings, macroeconomic conditions, interest rates, and specific view properties.
            </p>
          </div>
        </div>

        {/* Project Note */}
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic', marginBottom: '2rem' }}>
          College Project Submission for Explainable Artificial Intelligence (XAI) Subject. © 2026.
        </div>

      </div>
    </div>
  );
};

export default About;

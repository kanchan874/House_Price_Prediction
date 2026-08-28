import React from 'react';
import ModelMetrics from '../components/ModelMetrics';
import FeatureImportanceChart from '../components/FeatureImportanceChart';
import FeatureEffectChart from '../components/FeatureEffectChart';

const Model = ({
  modelMetrics,
  selectedModel,
  globalImportance,
  metadata
}) => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Model Diagnostics & Global Explainability</h1>
        <p className="page-subtitle">
          Compare regression metrics and investigate how the models behave globally across the entire dataset.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Row 1: Model Comparison Table */}
        <ModelMetrics metrics={modelMetrics} selectedModel={selectedModel} />

        {/* Row 2: Two-column grid (Global Importance vs Feature Effect) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            <FeatureImportanceChart 
              importanceData={globalImportance?.[selectedModel]} 
              modelName={selectedModel} 
            />
            <FeatureEffectChart 
              selectedModel={selectedModel} 
              metadata={metadata} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getFeatureEffect } from '../services/api';
import { AlertCircle } from 'lucide-react';

const DISPLAY_NAME_MAPPING = {
  OverallQual: 'Overall Quality',
  GrLivArea: 'Living Area',
  YearBuilt: 'Year Built',
  TotalBsmtSF: 'Basement Area',
  GarageCars: 'Garage Size (Cars)',
  FullBath: 'Bathrooms',
  BedroomAbvGr: 'Bedrooms',
  Neighborhood: 'Neighborhood'
};

const FeatureEffectChart = ({ selectedModel, metadata }) => {
  const [selectedFeature, setSelectedFeature] = useState('GrLivArea');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEffectData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getFeatureEffect(selectedFeature, selectedModel);
        // Convert prices to Lakhs for easier reading on the chart
        const formattedPoints = data.effect_data.map((pt) => ({
          x: pt.x,
          y: parseFloat((pt.y / 100000).toFixed(2)),
          rawY: pt.y
        }));
        setChartData(formattedPoints);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch feature effect data.');
      } finally {
        setLoading(false);
      }
    }
    
    if (selectedModel && selectedFeature) {
      fetchEffectData();
    }
  }, [selectedFeature, selectedModel]);

  const featuresToSelect = Object.keys(DISPLAY_NAME_MAPPING);

  const getFeatureRelationshipText = (feat) => {
    switch (feat) {
      case 'OverallQual':
        return "As the overall quality score increases, the model predicts significantly higher prices. This is typically the most influential ordinal variable in the dataset, showing a strong positive correlation.";
      case 'GrLivArea':
        return "Larger above-grade living area is strongly associated with higher predicted prices. The Explainable Boosting Machine captures potential non-linear steps in this relationship, reflecting real-world market tiers.";
      case 'YearBuilt':
        return "Properties built recently generally correspond to higher valuations, reflecting modern building standards. Noticeable drops may occur for older homes, although remodeling can offset this.";
      case 'TotalBsmtSF':
        return "Increased basement square footage shows a positive contribution. Larger basements add substantial volume, which the model associates with higher property estimates.";
      case 'GarageCars':
        return "Increasing garage capacity from 0 to 2 cars yields clear predicted price increases. However, the curve may flatten out for 3+ cars, indicating diminishing returns for excessively large garages.";
      case 'FullBath':
        return "Additional full bathrooms correlate with higher estimates, representing functional value. The model displays discrete jumps between bathroom counts.";
      case 'Neighborhood':
        return "This plot shows the relative base adjustment the model makes for each neighborhood when holding all other physical characteristics (size, quality) constant. It captures location premium.";
      default:
        return "Varying this feature shows its standalone effect on the model's prediction while keeping other variables constant at typical baseline values.";
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const xVal = payload[0].payload.x;
      const displayX = typeof xVal === 'number' ? xVal.toLocaleString() : xVal;
      return (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '0.5rem 0.75rem', fontSize: '0.85rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--color-academic)' }}>
            {DISPLAY_NAME_MAPPING[selectedFeature] || selectedFeature}: {displayX}
          </p>
          <p style={{ color: 'var(--text-primary)' }}>
            Predicted Price: ₹{payload[0].value.toFixed(2)} Lakhs
          </p>
        </div>
      );
    }
    return null;
  };

  const isCategorical = metadata?.[selectedFeature]?.type === 'categorical';

  return (
    <div className="card">
      <div className="card-title">Feature Effect Visualization (Partial Dependence)</div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Observe how the model's price prediction changes as you vary a single variable, keeping all other house attributes fixed at their median values.
      </p>

      {/* Select Feature Selector */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label">Select Feature to Analyze</label>
        <select
          className="form-control"
          value={selectedFeature}
          onChange={(e) => setSelectedFeature(e.target.value)}
        >
          {featuresToSelect.map((feat) => (
            <option key={feat} value={feat}>
              {DISPLAY_NAME_MAPPING[feat]}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Computing model responses...
        </div>
      )}

      {error && (
        <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!loading && !error && chartData.length > 0 && (
        <>
          <div style={{ width: '100%', height: '260px', marginBottom: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              {isCategorical ? (
                // Use a BarChart for Categorical Feature Effects (e.g. Neighborhood)
                // Wait! Recharts BarChart works great for categorical effects
                // Let's import it or just use LineChart since it's already imported. Wait, LineChart with categorical X axis works, but BarChart is better. Let's make it a line chart with dots, or bar chart if categorical. Let's make a LineChart with dots, it is perfectly clean!
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="x" 
                    stroke="#6b7280" 
                    fontSize={10} 
                    angle={-45} 
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis stroke="#6b7280" unit="L" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="var(--color-academic)" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              ) : (
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" stroke="#6b7280" fontSize={11} type="number" domain={['dataMin', 'dataMax']} />
                  <YAxis stroke="#6b7280" unit="L" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="var(--color-academic)" 
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderLeft: '3px solid var(--color-academic)', borderRadius: '0 var(--border-radius) var(--border-radius) 0', fontSize: '0.875rem' }}>
            <strong>Analysis:</strong> {getFeatureRelationshipText(selectedFeature)}
          </div>
        </>
      )}
    </div>
  );
};

export default FeatureEffectChart;

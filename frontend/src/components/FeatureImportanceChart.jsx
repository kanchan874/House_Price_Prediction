import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

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

const FeatureImportanceChart = ({ importanceData, modelName }) => {
  if (!importanceData || importanceData.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Global Feature Importance</div>
        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No importance data available. Verify backend is running and models are trained.
        </div>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = importanceData.map((item) => ({
    rawName: item.feature,
    name: DISPLAY_NAME_MAPPING[item.feature] || item.feature,
    // Convert to percentage
    percentage: parseFloat((item.importance * 100).toFixed(1)),
    raw: item.raw_importance
  })).slice(0, 10); // Show top 10 for clarity

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '0.5rem 0.75rem', fontSize: '0.85rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--color-academic)' }}>{payload[0].payload.name}</p>
          <p style={{ color: 'var(--text-primary)' }}>Relative weight: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-title">Global Feature Importance ({modelName})</div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Shows the relative weight (0% - 100%) of the top factors that generally drive the predictions of this model.
      </p>

      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" unit="%" domain={[0, 'dataMax + 10']} stroke="#6b7280" fontSize={11} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6b7280"
              fontSize={12}
              width={140}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentage" fill="var(--color-academic)" radius={[0, 4, 4, 0]} barSize={16}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? 'var(--color-academic)' : '#4b5563'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeatureImportanceChart;

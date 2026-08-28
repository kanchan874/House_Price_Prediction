import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getFeatureMetadata = async () => {
  const response = await api.get('/feature-metadata');
  return response.data;
};

export const getModelMetrics = async () => {
  const response = await api.get('/model-metrics');
  return response.data;
};

export const getFeatureImportance = async () => {
  const response = await api.get('/feature-importance');
  return response.data;
};

export const predictPrice = async (modelName, features) => {
  const response = await api.post('/predict', {
    model_name: modelName,
    features: features,
  });
  return response.data;
};

export const explainPrediction = async (modelName, features) => {
  const response = await api.post('/explain', {
    model_name: modelName,
    features: features,
  });
  return response.data;
};

export const runWhatIf = async (modelName, originalFeatures, modifiedFeatures) => {
  const response = await api.post('/what-if', {
    model_name: modelName,
    original_features: originalFeatures,
    modified_features: modifiedFeatures,
  });
  return response.data;
};

export const getFeatureEffect = async (featureName, modelName) => {
  const response = await api.get(`/feature-effect/${featureName}`, {
    params: { model_name: modelName },
  });
  return response.data;
};

export default api;

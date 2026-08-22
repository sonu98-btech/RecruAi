import api from './api';

export const callApi = {
  create: async (callData) => {
    const response = await api.post('/calls', callData);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/calls', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/calls/${id}`);
    return response.data;
  },
};

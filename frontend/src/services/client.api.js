import api from './api';

export const clientApi = {
  create: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/clients', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

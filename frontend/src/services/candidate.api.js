import api from './api';

export const candidateApi = {
  create: async (candidateData) => {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/candidates', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },
  update: async (id, candidateData) => {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
  uploadResume: async (id, file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post(`/candidates/${id}/resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

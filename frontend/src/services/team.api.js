import api from './api';

export const teamApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  create: async (memberData) => {
    const response = await api.post('/users', memberData);
    return response.data;
  },
  update: async (id, memberData) => {
    const response = await api.patch(`/users/${id}`, memberData);
    return response.data;
  },
};

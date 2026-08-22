import api from './api';

export const followupApi = {
  create: async (followupData) => {
    const response = await api.post('/followups', followupData);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/followups', { params });
    return response.data;
  },
  update: async (id, followupData) => {
    const response = await api.put(`/followups/${id}`, followupData);
    return response.data;
  },
};

export const campaignApi = {
  create: async (campaignData) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/campaigns', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },
  update: async (id, campaignData) => {
    const response = await api.put(`/campaigns/${id}`, campaignData);
    return response.data;
  },
  start: async (id) => {
    const response = await api.post(`/campaigns/${id}/start`);
    return response.data;
  },
  pause: async (id) => {
    const response = await api.post(`/campaigns/${id}/pause`);
    return response.data;
  },
};

export const dashboardApi = {
  getOverview: async () => {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  readNotification: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  readAllNotifications: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
};

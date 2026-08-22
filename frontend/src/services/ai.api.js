import api from './api';

export const aiApi = {
  analyzeTranscript: async (transcript) => {
    const response = await api.post('/ai/analyze-call', { transcript });
    return response.data;
  },
  analyzeCallById: async (id) => {
    const response = await api.post(`/ai/calls/${id}/analyze`);
    return response.data;
  },
};

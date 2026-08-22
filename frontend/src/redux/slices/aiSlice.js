import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiApi } from '../../services/ai.api';

export const analyzeTranscript = createAsyncThunk('ai/analyzeTranscript', async (transcript, { rejectWithValue }) => {
  try {
    const response = await aiApi.analyzeTranscript(transcript);
    return response.data; // summary, sentiment, candidateScore, recommendation, decision, pipeline
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to analyze transcript');
  }
});

export const analyzeCallById = createAsyncThunk('ai/analyzeCallById', async (id, { rejectWithValue }) => {
  try {
    const response = await aiApi.analyzeCallById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to analyze call');
  }
});

const initialState = {
  analysisResult: null,
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAnalysisResult: (state) => {
      state.analysisResult = null;
    },
    clearAiError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeTranscript.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeTranscript.fulfilled, (state, action) => {
        state.loading = false;
        state.analysisResult = action.payload;
      })
      .addCase(analyzeTranscript.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(analyzeCallById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeCallById.fulfilled, (state, action) => {
        state.loading = false;
        state.analysisResult = action.payload;
      })
      .addCase(analyzeCallById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalysisResult, clearAiError } = aiSlice.actions;
export default aiSlice.reducer;

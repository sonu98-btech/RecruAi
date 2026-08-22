import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { callApi } from '../../services/call.api';

export const fetchCalls = createAsyncThunk('calls/fetchAll', async (filters, { rejectWithValue }) => {
  try {
    const response = await callApi.getAll(filters);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch calls');
  }
});

export const triggerCall = createAsyncThunk('calls/trigger', async (callData, { rejectWithValue }) => {
  try {
    const response = await callApi.create(callData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to place call');
  }
});

export const fetchCallById = createAsyncThunk('calls/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await callApi.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch call details');
  }
});

const initialState = {
  calls: [],
  selectedCall: null,
  loading: false,
  error: null,
};

const callSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    clearCallError: (state) => {
      state.error = null;
    },
    addRealtimeCall: (state, action) => {
      state.calls.unshift(action.payload);
    },
    updateRealtimeCall: (state, action) => {
      const index = state.calls.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.calls[index] = action.payload;
      }
      if (state.selectedCall?._id === action.payload._id) {
        state.selectedCall = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalls.fulfilled, (state, action) => {
        state.loading = false;
        state.calls = action.payload?.items || (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(fetchCalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(triggerCall.pending, (state) => {
        state.loading = true;
      })
      .addCase(triggerCall.fulfilled, (state, action) => {
        state.loading = false;
        state.calls.unshift(action.payload);
      })
      .addCase(triggerCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCallById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCallById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCall = action.payload;
      })
      .addCase(fetchCallById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCallError, addRealtimeCall, updateRealtimeCall } = callSlice.actions;
export default callSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { candidateApi } from '../../services/candidate.api';

export const fetchCandidates = createAsyncThunk('candidates/fetchAll', async (filters, { rejectWithValue }) => {
  try {
    const response = await candidateApi.getAll(filters);
    return response.data; // usually an array or { docs, total, page, limit }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidates');
  }
});

export const addCandidate = createAsyncThunk('candidates/add', async (candidateData, { rejectWithValue }) => {
  try {
    const response = await candidateApi.create(candidateData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add candidate');
  }
});

export const updateCandidate = createAsyncThunk('candidates/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await candidateApi.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update candidate');
  }
});

export const deleteCandidate = createAsyncThunk('candidates/delete', async (id, { rejectWithValue }) => {
  try {
    await candidateApi.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete candidate');
  }
});

const initialState = {
  candidates: [],
  totalCandidates: 0,
  totalPages: 1,
  currentPage: 1,
  selectedCandidate: null,
  loading: false,
  error: null,
};

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
    clearCandidateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items) {
          state.candidates = action.payload.items;
          state.totalCandidates = action.payload.pagination?.total || 0;
          state.totalPages = action.payload.pagination?.pages || 1;
          state.currentPage = action.payload.pagination?.page || 1;
        } else {
          state.candidates = Array.isArray(action.payload) ? action.payload : [];
          state.totalCandidates = state.candidates.length;
        }
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addCandidate.fulfilled, (state, action) => {
        state.candidates.unshift(action.payload);
      })
      // Update
      .addCase(updateCandidate.fulfilled, (state, action) => {
        const index = state.candidates.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
        if (state.selectedCandidate?._id === action.payload._id) {
          state.selectedCandidate = action.payload;
        }
      })
      // Delete
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.candidates = state.candidates.filter(c => c._id !== action.payload);
      });
  },
});

export const { setSelectedCandidate, clearCandidateError } = candidateSlice.actions;
export default candidateSlice.reducer;

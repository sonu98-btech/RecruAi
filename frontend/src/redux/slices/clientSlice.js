import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientApi } from '../../services/client.api';

export const fetchClients = createAsyncThunk('clients/fetchAll', async (filters, { rejectWithValue }) => {
  try {
    const response = await clientApi.getAll(filters);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
  }
});

export const addClient = createAsyncThunk('clients/add', async (clientData, { rejectWithValue }) => {
  try {
    const response = await clientApi.create(clientData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add client');
  }
});

export const updateClient = createAsyncThunk('clients/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await clientApi.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update client');
  }
});

export const deleteClient = createAsyncThunk('clients/delete', async (id, { rejectWithValue }) => {
  try {
    await clientApi.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete client');
  }
});

const initialState = {
  clients: [],
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearClientError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload?.items || (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.clients.unshift(action.payload);
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(c => c._id !== action.payload);
      });
  },
});

export const { clearClientError } = clientSlice.actions;
export default clientSlice.reducer;

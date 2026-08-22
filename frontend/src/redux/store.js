import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import candidateReducer from './slices/candidateSlice';
import clientReducer from './slices/clientSlice';
import callReducer from './slices/callSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidates: candidateReducer,
    clients: clientReducer,
    calls: callReducer,
    ai: aiReducer,
  },
});

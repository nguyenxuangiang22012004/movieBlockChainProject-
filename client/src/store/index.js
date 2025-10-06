import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [], 
      },
    }),
});

export default store;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAll } from '../../services/catalogService';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    console.log('🚀 fetchMovies thunk started');
    try {
      const response = await getAll();
      return response;
    } catch (error) {
      console.error('💥 fetchMovies error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.data;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching movies';
        console.error('Error fetching movies:', action.payload);
      });
  },
});

export default movieSlice.reducer;
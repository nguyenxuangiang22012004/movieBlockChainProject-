import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAll } from '../../services/catalogService';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    console.log('🚀 fetchMovies thunk started');
    try {
      const response = await getAll();
      console.log('API response:', response); // Debug dữ liệu API
      return response;
    } catch (error) {
      console.error('💥 fetchMovies error:', error);
      return rejectWithValue(error.message || 'Failed to fetch movies');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    filteredMovies: [], // Danh sách phim sau khi lọc
    filters: {
      genre: '0', // Mặc định: All genres
      quality: '0', // Mặc định: Any quality
      rating: '0', // Mặc định: Any rating
      sort: '0', // Mặc định: Relevance
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Áp dụng logic lọc
      let filtered = [...state.movies];

      // Lọc theo genre
      if (state.filters.genre !== '0') {
        filtered = filtered.filter(movie =>
          movie.genres && Array.isArray(movie.genres) && movie.genres.includes(state.filters.genre)
        );
      }

      // Lọc theo quality
      if (state.filters.quality !== '0') {
        filtered = filtered.filter(movie => movie.quality === state.filters.quality);
      }

      // Lọc theo rating
      if (state.filters.rating !== '0') {
        const minRating = parseFloat(state.filters.rating);
        filtered = filtered.filter(movie =>
          (movie.imdb_rating || movie.rating || 0) >= minRating
        );
      }

      // Sắp xếp
      filtered.sort((a, b) => {
        if (state.filters.sort === '1') { // Newest
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        } else if (state.filters.sort === '2') { // Highest Rated
          return (b.imdb_rating || b.rating || 0) - (a.imdb_rating || a.rating || 0);
        }
        return 0; // Relevance (giữ nguyên thứ tự)
      });

      state.filteredMovies = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        const movies = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.movies = movies;
        state.filteredMovies = movies; // Khởi tạo filteredMovies
        // Áp dụng lại bộ lọc nếu có
        if (state.filters.genre !== '0' || state.filters.quality !== '0' || state.filters.rating !== '0' || state.filters.sort !== '0') {
          let filtered = [...movies];
          if (state.filters.genre !== '0') {
            filtered = filtered.filter(movie =>
              movie.genres && Array.isArray(movie.genres) && movie.genres.includes(state.filters.genre)
            );
          }
          if (state.filters.quality !== '0') {
            filtered = filtered.filter(movie => movie.quality === state.filters.quality);
          }
          if (state.filters.rating !== '0') {
            const minRating = parseFloat(state.filters.rating);
            filtered = filtered.filter(movie =>
              (movie.imdb_rating || movie.rating || 0) >= minRating
            );
          }
          filtered.sort((a, b) => {
            if (state.filters.sort === '1') {
              const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
              const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
              return dateB - dateA;
            } else if (state.filters.sort === '2') {
              return (b.imdb_rating || b.rating || 0) - (a.imdb_rating || a.rating || 0);
            }
            return 0;
          });
          state.filteredMovies = filtered;
        }
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching movies';
        console.error('Error fetching movies:', action.payload);
      });
  },
});

export const { setFilters } = movieSlice.actions;
export default movieSlice.reducer;
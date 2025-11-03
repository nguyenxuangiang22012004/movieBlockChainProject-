import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAll, getCatalogItemById } from '../../services/catalogService'; 

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAll();
      return response;
    } catch (error) {
      console.error('💥 fetchMovies error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCatalogItemById(id);
      if (!response.success) {
        throw new Error(response.message || 'Movie not found');
      }
      if (!response.data) {
        throw new Error('No data returned for movie');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch movie details');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    filteredMovies: [],
    currentMovie: null,
    filters: {
      genre: '0',
      quality: '0',
      rating: '0',
      sort: '0',
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      let filtered = [...state.movies];

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
        state.filteredMovies = movies;
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
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fetched new movie:', action.payload); // Debug
        state.currentMovie = { ...action.payload }; // Deep copy để detect thay đổi
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching movie details';
      });
  },
});

export const { setFilters } = movieSlice.actions;
export default movieSlice.reducer;
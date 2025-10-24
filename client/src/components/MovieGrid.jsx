import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MovieCard from './MovieCard';
import { fetchMovies } from '../store/slices/movieSlice';

function MovieGrid() {
  const dispatch = useDispatch();
  const { filteredMovies, movies, loading, error } = useSelector((state) => state.movies);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Chỉ dispatch fetchMovies một lần khi component mount
  useEffect(() => {
    if (movies.length === 0) { // Chỉ gọi API nếu chưa có dữ liệu
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.length]);

  // Cập nhật displayedMovies khi filteredMovies hoặc page thay đổi
  useEffect(() => {
    setDisplayedMovies(filteredMovies.slice(0, page * itemsPerPage));
  }, [filteredMovies, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const hasMoreMovies = displayedMovies.length < filteredMovies.length;

  return (
    <div className="section section--catalog">
      <div className="container">
        {loading && <div>Đang tải...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && displayedMovies.length === 0 && !error && (
          <div>Không có phim nào để hiển thị</div>
        )}
        <div className="row">
          {displayedMovies.map((movie) => (
            <MovieCard
              key={movie.id || movie._id}
              movie={{
                id: movie.id || movie._id,
                cover_image_url: movie.cover_image_url,
                rating: movie.imdb_rating || movie.imdb_rating || 0,
                title: movie.title,
                categories: movie.genres || [],
              }}
            />
          ))}
        </div>
        {hasMoreMovies && (
          <div className="row">
            <div className="col-12">
              <button
                className="section__more"
                type="button"
                onClick={handleLoadMore}
                disabled={loading}
              >
                Load more
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieGrid;
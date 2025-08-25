import React from 'react';
import MovieCard from './MovieCard';

// Dữ liệu mẫu - Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu này từ API
const moviesData = [
    { id: 1, cover: '/img/covers/cover.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 2, cover: '/img/covers/cover2.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
    { id: 3, cover: '/img/covers/cover3.jpg', rate: 6.3, title: 'Whitney', categories: ['Romance', 'Drama', 'Music'] },
    // ... Thêm dữ liệu cho các phim khác
];

function MovieGrid() {
  return (
    <div className="section section--catalog">
      <div className="container">
        <div className="row">
          {moviesData.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <div className="row">
          <div className="col-12">
            <button className="section__more" type="button">Load more</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieGrid;
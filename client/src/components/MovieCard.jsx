import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const rateColor = movie.rate > 8 ? 'green' : movie.rate > 6 ? 'yellow' : 'red';

  return (
    <div className="col-6 col-sm-4 col-lg-3 col-xl-2">
      <div className="item">
        <div className="item__cover">
          <img src={movie.cover} alt="" />
          <Link to={`/details/${movie.id}`} className="item__play">
            <i className="ti ti-player-play-filled"></i>
          </Link>
          <span className={`item__rate item__rate--${rateColor}`}>{movie.rate}</span>
          <button className="item__favorite" type="button"><i className="ti ti-bookmark"></i></button>
        </div>
        <div className="item__content">
          <h3 className="item__title"><Link to={`/details/${movie.id}`}>{movie.title}</Link></h3>
          <span className="item__category">
            {movie.categories.map((category, index) => (
              <Link key={index} to="#">{category}</Link>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
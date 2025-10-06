import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../store/slices/movieSlice';
import '../../public/css/slimselect.css';

function FilterBar({ isFixed = true }) {
  const dispatch = useDispatch();
  const { filters, movies, filteredMovies } = useSelector((state) => state.movies);
  const genreSelect = useRef(null);
  const qualitySelect = useRef(null);
  const rateSelect = useRef(null);
  const sortSelect = useRef(null);

  useEffect(() => {
    if (window.SlimSelect) {
      genreSelect.current = new window.SlimSelect({
        select: '#filter__genre',
        events: {
          afterChange: (newVal) => {
            dispatch(setFilters({ genre: newVal[0].value }));
          },
        },
      });
      qualitySelect.current = new window.SlimSelect({
        select: '#filter__quality',
        settings: { showSearch: false },
        events: {
          afterChange: (newVal) => {
            dispatch(setFilters({ quality: newVal[0].value }));
          },
        },
      });
      rateSelect.current = new window.SlimSelect({
        select: '#filter__rate',
        settings: { showSearch: false },
        events: {
          afterChange: (newVal) => {
            dispatch(setFilters({ rating: newVal[0].value }));
          },
        },
      });
      sortSelect.current = new window.SlimSelect({
        select: '#filter__sort',
        settings: { showSearch: false },
        events: {
          afterChange: (newVal) => {
            dispatch(setFilters({ sort: newVal[0].value }));
          },
        },
      });
    }

    return () => {
      if (genreSelect.current) genreSelect.current.destroy();
      if (qualitySelect.current) qualitySelect.current.destroy();
      if (rateSelect.current) rateSelect.current.destroy();
      if (sortSelect.current) sortSelect.current.destroy();
    };
  }, [dispatch]);

  return (
    <div className={`filter ${isFixed ? 'filter--fixed' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="filter__content">
              <button className="filter__menu" type="button">
                <i className="ti ti-filter"></i>Filter
              </button>
              <div className="filter__items">
                <select className="filter__select" id="filter__genre" value={filters.genre}>
                  <option value="0">All genres</option>
                  <option value="Action/Adventure">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Animation">Animation</option>
                  <option value="Documentary">Documentary</option>
                </select>

                <select className="filter__select" name="quality" id="filter__quality" value={filters.quality}>
                  <option value="0">Any quality</option>
                  <option value="HD 1080">HD 1080</option>
                  <option value="4K">4K</option>
                  <option value="SD">SD</option>
                </select>
                <select className="filter__select" id="filter__rate" value={filters.rating}>
                  <option value="0">Any rating</option>
                  <option value="1.0">From 1.0</option>
                  <option value="2.0">From 2.0</option>
                  <option value="3.0">From 3.0</option>
                  <option value="4.0">From 4.0</option>
                  <option value="5.0">From 5.0</option>
                  <option value="6.0">From 6.0</option>
                  <option value="7.0">From 7.0</option>
                  <option value="8.0">From 8.0</option>
                  <option value="9.0">From 9.0</option>
                </select>
                <select className="filter__select" id="filter__sort" value={filters.sort}>
                  <option value="0">Relevance</option>
                  <option value="1">Newest</option>
                  <option value="2">Highest Rated</option>
                  <option value="3">Most Viewed</option>
                  <option value="4">Most Commented</option>
                </select>
              </div>
              <button
                className="filter__btn"
                type="button"
                onClick={() => {
                  dispatch(setFilters({
                    genre: genreSelect.current?.selected() || '0',
                    quality: qualitySelect.current?.selected() || '0',
                    rating: rateSelect.current?.selected() || '0',
                    sort: sortSelect.current?.selected() || '0',
                  }));
                }}
              >
                Apply
              </button>
              <span className="filter__amount">
                Showing {filteredMovies.length} of {movies.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
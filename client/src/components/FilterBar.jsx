import React, { useEffect, useRef } from 'react';
import '../../public/css/slimselect.css';

function FilterBar({ isFixed = true }) {
  const genreSelect = useRef(null);
  const qualitySelect = useRef(null);
  const rateSelect = useRef(null);
  const sortSelect = useRef(null);

  useEffect(() => {
    // Bây giờ chúng ta có thể chắc chắn CSS đã được tải trước khi JS chạy
    if (window.SlimSelect) {
      genreSelect.current = new window.SlimSelect({ 
        select: '#filter__genre' 
      });
      qualitySelect.current = new window.SlimSelect({
        select: '#filter__quality',
        settings: { showSearch: false },
      });
      rateSelect.current = new window.SlimSelect({
        select: '#filter__rate',
        settings: { showSearch: false },
      });
      sortSelect.current = new window.SlimSelect({
        select: '#filter__sort',
        settings: { showSearch: false },
      });
    }

    return () => {
      if (genreSelect.current) genreSelect.current.destroy();
      if (qualitySelect.current) qualitySelect.current.destroy();
      if (rateSelect.current) rateSelect.current.destroy();
      if (sortSelect.current) sortSelect.current.destroy();
    };
  }, []);

  return (
     <div className={`filter ${isFixed ? 'filter--fixed' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="filter__content">
              {/* menu btn */}
              <button className="filter__menu" type="button">
                <i className="ti ti-filter"></i>Filter
              </button>
              {/* filter desk */}
              <div className="filter__items">
                <select className="filter__select" name="genre" id="filter__genre">
                  <option value="0">All genres</option>
                  <option value="1">Action/Adventure</option>
                  <option value="2">Animals</option>
                  {/* ... các option khác ... */}
                </select>
                <select className="filter__select" name="quality" id="filter__quality">
                  <option value="0">Any quality</option>
                  <option value="1">HD 1080</option>
                  {/* ... các option khác ... */}
                </select>
                <select className="filter__select" name="rate" id="filter__rate">
                  <option value="0">Any rating</option>
                  <option value="1">from 3.0</option>
                  {/* ... các option khác ... */}
                </select>
                <select className="filter__select" name="sort" id="filter__sort">
                  <option value="0">Relevance</option>
                  <option value="1">Newest</option>
                  {/* ... các option khác ... */}
                </select>
              </div>
              {/* filter btn */}
              <button className="filter__btn" type="button">
                Apply
              </button>
              {/* amount */}
              <span className="filter__amount">Showing 18 of 1713</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
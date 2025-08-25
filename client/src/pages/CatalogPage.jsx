import React from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import PremiereSection from '../components/PremiereSection';

// Dữ liệu mẫu - Trong ứng dụng thực tế, bạn sẽ fetch dữ liệu này từ API
const catalogMovies = [
    { id: 1, cover: '/img/covers/cover.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 2, cover: '/img/covers/cover2.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
    { id: 3, cover: '/img/covers/cover3.jpg', rate: 6.3, title: 'Whitney', categories: ['Romance', 'Drama', 'Music'] },
    { id: 4, cover: '/img/covers/cover4.jpg', rate: 6.9, title: 'Blindspotting', categories: ['Comedy', 'Drama'] },
    { id: 5, cover: '/img/covers/cover5.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 6, cover: '/img/covers/cover6.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
    { id: 7, cover: '/img/covers/cover7.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
    { id: 8, cover: '/img/covers/cover8.jpg', rate: 5.5, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 9, cover: '/img/covers/cover9.jpg', rate: 6.7, title: 'Blindspotting', categories: ['Comedy', 'Drama'] },
    { id: 10, cover: '/img/covers/cover10.jpg', rate: 5.6, title: 'Whitney', categories: ['Romance', 'Drama', 'Music'] },
    { id: 11, cover: '/img/covers/cover11.jpg', rate: 9.2, title: 'Benched', categories: ['Comedy'] },
    { id: 12, cover: '/img/covers/cover12.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 13, cover: '/img/covers/cover13.jpg', rate: 8.0, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 14, cover: '/img/covers/cover14.jpg', rate: 7.2, title: 'Benched', categories: ['Comedy'] },
    { id: 15, cover: '/img/covers/cover15.jpg', rate: 5.9, title: 'Whitney', categories: ['Romance', 'Drama', 'Music'] },
    { id: 16, cover: '/img/covers/cover16.jpg', rate: 8.3, title: 'Blindspotting', categories: ['Comedy', 'Drama'] },
    { id: 17, cover: '/img/covers/cover17.jpg', rate: 8.0, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 18, cover: '/img/covers/cover18.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
];

function CatalogPage() {
  return (
    <>
      {/* page title */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">Catalog</h1>
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">Catalog</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end page title */}

      {/* filter: sử dụng component FilterBar với isFixed={false} */}
      <FilterBar isFixed={false} />
      {/* end filter */}
      
      {/* catalog */}
      <div className="section section--catalog">
        <div className="container">
          <div className="row">
            {catalogMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className="row">
            <Pagination />
          </div>
        </div>
      </div>
      {/* end catalog */}

      {/* expected premiere */}
      <PremiereSection />
      {/* end expected premiere */}
    </>
  );
}

export default CatalogPage;
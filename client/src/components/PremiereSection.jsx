import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu mẫu cho các phim sắp ra mắt
const premiereMovies = [
    { id: 1, cover: '/img/covers/cover.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 2, cover: '/img/covers/cover2.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
    { id: 3, cover: '/img/covers/cover3.jpg', rate: 6.3, title: 'Whitney', categories: ['Romance', 'Drama', 'Music'] },
    { id: 4, cover: '/img/covers/cover4.jpg', rate: 6.9, title: 'Blindspotting', categories: ['Comedy', 'Drama'] },
    { id: 5, cover: '/img/covers/cover5.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 6, cover: '/img/covers/cover6.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
    // Thêm các phim khác nếu muốn
];

function PremiereSection() {
    useEffect(() => {
        // Khởi tạo Splide slider cho section này
        if (window.Splide && document.querySelector('.section__carousel')) {
            new window.Splide('.section__carousel', {
                type: 'loop',
                perPage: 6,
                drag: true,
                pagination: false,
                speed: 800,
                gap: 24,
                arrows: false,
                focus: 0,
                breakpoints: {
                    575: { arrows: false, perPage: 2 },
                    767: { arrows: false, perPage: 3 },
                    991: { arrows: false, perPage: 3 },
                    1199: { arrows: false, perPage: 4 },
                }
            }).mount();
        }
    }, []);

    const getRateColor = (rate) => rate > 8 ? 'green' : rate > 6 ? 'yellow' : 'red';

    return (
        <section className="section section--border">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section__title-wrap">
                            <h2 className="section__title">Expected premiere</h2>
                            <Link to="/catalog" className="section__view section__view--carousel">View All</Link>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="section__carousel splide splide--content">
                            <div className="splide__arrows">
                                <button className="splide__arrow splide__arrow--prev" type="button">
                                    <i className="ti ti-chevron-left"></i>
                                </button>
                                <button className="splide__arrow splide__arrow--next" type="button">
                                    <i className="ti ti-chevron-right"></i>
                                </button>
                            </div>
                            <div className="splide__track">
                                <ul className="splide__list">
                                    {premiereMovies.map(movie => (
                                        <li key={movie.id} className="splide__slide">
                                            <div className="item item--carousel">
                                                <div className="item__cover">
                                                    <img src={movie.cover} alt="" />
                                                    <Link to={`/details/${movie.id}`} className="item__play">
                                                        <i className="ti ti-player-play-filled"></i>
                                                    </Link>
                                                    <span className={`item__rate item__rate--${getRateColor(movie.rate)}`}>{movie.rate}</span>
                                                    <button className="item__favorite" type="button"><i className="ti ti-bookmark"></i></button>
                                                </div>
                                                <div className="item__content">
                                                    <h3 className="item__title"><Link to={`/details/${movie.id}`}>{movie.title}</Link></h3>
                                                    <span className="item__category">
                                                        {movie.categories.map((cat, index) => (
                                                            <Link key={index} to="#">{cat}</Link>
                                                        ))}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PremiereSection;
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
    useEffect(() => {
        // Khởi tạo Splide slider cho phần Roadmap
        if (window.Splide && document.querySelector('.section__roadmap')) {
            new window.Splide('.section__roadmap', {
                type: 'loop',
                perPage: 3,
                drag: true,
                pagination: false,
                speed: 800,
                gap: 30,
                arrows: false,
                focus: 0,
                breakpoints: {
                    767: { gap: 20, arrows: false, perPage: 1 },
                    991: { arrows: false, perPage: 2 },
                    1199: { arrows: false, perPage: 3 },
                }
            }).mount();
        }
    }, []);

  return (
    <>
      {/* page title */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">About Us</h1>
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">About Us</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end page title */}
      
      {/* about */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section__title"><b>HotFlix</b> – Best Place for Movies</h2>
              <p className="section__text">Welcome to <b>HotFlix</b> movie site, the ultimate destination for all film enthusiasts...</p>
              <p className="section__text">Indulge in the joy of cinema with our curated collections...</p>
            </div>
            {/* ... Thêm các div feature ở đây ... */}
          </div>
        </div>
      </section>
      {/* end about */}

      {/* how it works */}
      <section className="section section--border">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section__title">How it works?</h2>
            </div>
            <div className="col-12 col-lg-4">
              <div className="how">
                <span className="how__number">01</span>
                <h3 className="how__title">Create an account</h3>
                <p className="how__text">Start your movie-watching journey...</p>
              </div>
            </div>
            {/* ... Thêm các how box khác ... */}
          </div>
        </div>
      </section>
      {/* end how it works */}

      {/* roadmap */}
      <section className="section section--border">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section__title">Roadmap</h2>
            </div>
            <div className="col-12">
              <div className="section__roadmap splide splide--roadmap">
                <div className="splide__arrows">
                  <button className="splide__arrow splide__arrow--prev" type="button"><i className="ti ti-chevron-left"></i></button>
                  <button className="splide__arrow splide__arrow--next" type="button"><i className="ti ti-chevron-right"></i></button>
                </div>
                <div className="splide__track">
                  <ul className="splide__list">
                    <li className="splide__slide">
                      <div className="roadmap roadmap--active">
                        <h3 className="roadmap__title">2023 Q4</h3>
                        <ul className="roadmap__list">
                          <li>Conduct market research...</li>
                          <li>Determine the main goals...</li>
                        </ul>
                      </div>
                    </li>
                    {/* ... Thêm các roadmap slide khác ... */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end roadmap */}

      {/* partners */}
      <section className="section section--pt">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-9">
              <h2 className="section__title">Our Partners</h2>
              <p className="section__text">We strive for long-term cooperation... <Link to="/contacts">Become a partner</Link></p>
            </div>
          </div>
          <div className="row">
            <div className="col-6 col-sm-4 col-lg-2">
              <a href="#" className="partner">
                <img src="/img/partners/themeforest-light-background.png" alt="" className="partner__img" />
              </a>
            </div>
            {/* ... Thêm các partner khác ... */}
          </div>
        </div>
      </section>
      {/* end partners */}
    </>
  );
}

export default AboutPage;
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function HeroSlider() {
  // useEffect để khởi tạo slider và các hiệu ứng JS khác
  useEffect(() => {
    // Khởi tạo ảnh nền động
    document.querySelectorAll('.hero__slide').forEach(function(element) {
      if (element.getAttribute("data-bg")) {
        element.style.background = `url(${element.getAttribute('data-bg')})`;
        element.style.backgroundPosition = 'center center';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundSize = 'cover';
      }
    });

    // Khởi tạo Splide slider
    if (window.Splide) {
      const heroSplide = new window.Splide('.hero.splide--hero', {
        type: 'loop',
        perPage: 1,
        drag: true,
        pagination: true,
        speed: 1200,
        gap: 24,
        arrows: false,
        focus: 0,
      });
      heroSplide.mount();
    }
  }, []);

  return (
    <section className="home home--hero">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="hero splide splide--hero">
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
                  <li className="splide__slide">
                    <div className="hero__slide" data-bg="/img/bg/slide__bg-1.jpg">
                      <div className="hero__content">
                        <h2 className="hero__title">Savage Beauty <sub className="green">9.8</sub></h2>
                        <p className="hero__text">A brilliant scientist discovers a way to harness the power...</p>
                        <p className="hero__category">
                          <Link to="#">Action</Link>
                          <Link to="#">Drama</Link>
                          <Link to="#">Comedy</Link>
                        </p>
                        <div className="hero__actions">
                          <Link to="/details/1" className="hero__btn">
                            <span>Watch now</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                  {/* ...Thêm các <li className="splide__slide"> khác ở đây... */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
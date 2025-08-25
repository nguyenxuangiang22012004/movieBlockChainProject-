import React from 'react';
import { Link } from 'react-router-dom';
import PricingSection from '../components/PricingSection'; // Tái sử dụng component đã có
import PlanModal from '../components/PlanModal'; // Tái sử dụng modal

function PricingPage() {
  return (
    <>
      {/* page title */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">Pricing plan</h1>
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">Pricing plan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end page title */}

      {/* pricing: Tái sử dụng component PricingSection */}
      <div className="section section--notitle">
          <PricingSection />
      </div>
      {/* end pricing */}

      {/* features */}
      <section className="section section--border">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-11">
              <h2 className="section__title">Our Features</h2>
              <p className="section__text">Welcome to HotFlix movie site...</p>
            </div>
          </div>
          <div className="row">
            {/* feature */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="ti ti-badge-hd"></i>
                <h3 className="feature__title">Ultra HD</h3>
                <p className="feature__text">Experience movies like never before with our Ultra HD feature...</p>
              </div>
            </div>
            {/* ... các feature khác ... */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="ti ti-movie"></i>
                <h3 className="feature__title">Large movie database</h3>
                <p className="feature__text">Discover a vast and diverse collection of movies...</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="ti ti-device-tv"></i>
                <h3 className="feature__title">Online TV</h3>
                <p className="feature__text">Expand your entertainment horizons with our Online TV...</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="ti ti-ticket"></i>
                <h3 className="feature__title">Early access to new items</h3>
                <p className="feature__text">Be the first to experience the latest movies...</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="ti ti-cast"></i>
                <h3 className="feature__title">Airplay</h3>
                <p className="feature__text">Seamlessly stream movies from your device...</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="ti ti-language"></i>
                <h3 className="feature__title">Multi language subtitles</h3>
                <p className="feature__text">Break language barriers and enjoy movies...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end features */}

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
            {/* ... các partner khác ... */}
          </div>
        </div>
      </section>
      {/* end partners */}
      
      {/* Tái sử dụng component modal */}
      <PlanModal />
    </>
  );
}

export default PricingPage;
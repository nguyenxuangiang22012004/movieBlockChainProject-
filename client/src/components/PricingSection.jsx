import React from 'react';
import { Link } from 'react-router-dom';

function PricingSection() {
  return (
    <section className="section section--border">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="section__title">Select your plan</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 col-lg-4 order-md-2 order-lg-1">
            <div className="plan">
              <h3 className="plan__title">Basic</h3>
              <span className="plan__price">Free</span>
              <ul className="plan__list">
                <li className="plan__item"><i className="ti ti-circle-check"></i> 7 days</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> 720p Resolution</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> Limited Availability</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> Desktop Only</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> Limited Support</li>
              </ul>
              <Link to="/signup" className="plan__btn">Register</Link>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-4 order-md-1 order-lg-2">
            <div className="plan plan--orange">
              <h3 className="plan__title">Premium</h3>
              <span className="plan__price">$34.99 <sub>/ month</sub></span>
              <ul className="plan__list">
                <li className="plan__item"><i className="ti ti-circle-check"></i> 1 Month</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Full HD</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Limited Availability</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> TV & Desktop</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> 24/7 Support</li>
              </ul>
              <button className="plan__btn" type="button" data-bs-toggle="modal" data-bs-target="#plan-modal">Choose Plan</button>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 order-md-3">
            <div className="plan plan--red">
              <h3 className="plan__title">Cinematic</h3>
              <span className="plan__price">$49.99 <sub>/ month</sub></span>
              <ul className="plan__list">
                <li className="plan__item"><i className="ti ti-circle-check"></i> 2 Months</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Ultra HD</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Limited Availability</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Any Device</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> 24/7 Support</li>
              </ul>
              <button className="plan__btn" type="button" data-bs-toggle="modal" data-bs-target="#plan-modal">Choose Plan</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
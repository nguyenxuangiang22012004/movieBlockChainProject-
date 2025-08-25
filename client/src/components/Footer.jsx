import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  // Hàm xử lý cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer__content">
              <Link to="/" className="footer__logo">
                <img src="/img/logo.svg" alt="" />
              </Link>

              <span className="footer__copyright">
                © HOTFLIX, 2019—2024 <br /> 
                Create by <a href="https://themeforest.net/user/dmitryvolkov/portfolio" target="_blank" rel="noopener noreferrer">Dmitry Volkov</a>
              </span>

              <nav className="footer__nav">
                <Link to="/about">About Us</Link>
                <Link to="/contacts">Contacts</Link>
                <Link to="/privacy">Privacy policy</Link>
              </nav>

              <button className="footer__back" type="button" onClick={scrollToTop}>
                <i className="ti ti-arrow-narrow-up"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
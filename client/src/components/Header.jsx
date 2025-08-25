import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Hàm để bật/tắt menu mobile
  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  // Hàm để bật/tắt thanh tìm kiếm
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
  };
  
  // Xử lý khi click ra ngoài để đóng menu (cho mobile)
  useEffect(() => {
      const closeMenu = () => setIsNavActive(false);
      if (isNavActive) {
          document.body.addEventListener('click', closeMenu);
      }
      return () => {
          document.body.removeEventListener('click', closeMenu);
      }
  }, [isNavActive]);


  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="header__content">
              {/* header logo */}
              <Link to="/" className="header__logo">
                <img src="/img/logo.svg" alt="" />
              </Link>
              {/* end header logo */}

              {/* header nav */}
              <ul className={`header__nav ${isNavActive ? 'header__nav--active' : ''}`}>
                {/* dropdown */}
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Home <i className="ti ti-chevron-down"></i></a>
                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><Link to="/">Home style 1</Link></li>
                    <li><Link to="/">Home style 2</Link></li>
                    <li><Link to="/">Home style 3</Link></li>
                  </ul>
                </li>
                {/* end dropdown */}

                {/* dropdown */}
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Catalog <i className="ti ti-chevron-down"></i></a>
                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><Link to="/catalog">Catalog style 1</Link></li>
                    <li><Link to="/catalog">Catalog style 2</Link></li>
                    <li><Link to="/details/1">Details Movie</Link></li>
                    <li><Link to="/details/1">Details TV Series</Link></li>
                  </ul>
                </li>
                {/* end dropdown */}

                <li className="header__nav-item">
                  <Link to="/pricing" className="header__nav-link">Pricing plan</Link>
                </li>

                {/* dropdown */}
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Pages <i className="ti ti-chevron-down"></i></a>
                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/actor">Actor</Link></li>
                    <li><Link to="/contacts">Contacts</Link></li>
                    <li><Link to="/faq">Help center</Link></li>
                    <li><Link to="/privacy">Privacy policy</Link></li>
                  </ul>
                </li>
                {/* end dropdown */}
              </ul>
              {/* end header nav */}

              {/* header auth */}
              <div className="header__auth">
                <form action="#" className={`header__search ${isSearchActive ? 'header__search--active' : ''}`}>
                  <input className="header__search-input" type="text" placeholder="Search..." />
                  <button className="header__search-button" type="button">
                    <i className="ti ti-search"></i>
                  </button>
                  <button className="header__search-close" type="button" onClick={toggleSearch}>
                    <i className="ti ti-x"></i>
                  </button>
                </form>

                <button className="header__search-btn" type="button" onClick={toggleSearch}>
                  <i className="ti ti-search"></i>
                </button>

                {/* dropdown */}
                <div className="header__lang">
                  <a className="header__nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">EN <i className="ti ti-chevron-down"></i></a>
                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><a href="#">English</a></li>
                    <li><a href="#">Spanish</a></li>
                    <li><a href="#">French</a></li>
                  </ul>
                </div>
                {/* end dropdown */}

                {/* dropdown */}
                <div className="header__profile">
                  <a className="header__sign-in header__sign-in--user" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="ti ti-user"></i>
                    <span>Nickname</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                    <li><Link to="/profile"><i className="ti ti-ghost"></i>Profile</Link></li>
                    <li><Link to="/profile"><i className="ti ti-stereo-glasses"></i>Subscription</Link></li>
                    <li><Link to="/profile"><i className="ti ti-bookmark"></i>Favorites</Link></li>
                    <li><Link to="/profile"><i className="ti ti-settings"></i>Settings</Link></li>
                    <li><a href="#"><i className="ti ti-logout"></i>Logout</a></li>
                  </ul>
                </div>
                {/* end dropdown */}
              </div>
              {/* end header auth */}

              {/* header menu btn */}
              <button className={`header__btn ${isNavActive ? 'header__btn--active' : ''}`} type="button" onClick={(e) => { e.stopPropagation(); toggleNav(); }}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              {/* end header menu btn */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
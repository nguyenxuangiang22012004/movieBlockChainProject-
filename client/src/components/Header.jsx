import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService'; // Import logout function

function Header() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
  };

  useEffect(() => {
    const closeMenu = () => setIsNavActive(false);
    if (isNavActive) {
      document.body.addEventListener('click', closeMenu);
    }
    return () => {
      document.body.removeEventListener('click', closeMenu);
    }
  }, [isNavActive]);

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout(); // Xóa token và user từ localStorage
      setUser(null);
      navigate('/login'); // Chuyển về trang login
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="header__content">
              <Link to="/" className="header__logo">
                <img src="/img/logo.svg" alt="" />
              </Link>
              {/* header nav */}
              <ul className={`header__nav ${isNavActive ? 'header__nav--active' : ''}`}>
                <li className="header__nav-item">
                  <Link to="/catalog?type=movie" className="header__nav-link">
                    Movie
                  </Link>
                </li>

                <li className="header__nav-item">
                  <Link to="/catalog?type=tvseries" className="header__nav-link">
                    TV Series
                  </Link>
                </li>
                {/* dropdown */}
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Catalog <i className="ti ti-chevron-down"></i></a>
                  <ul className="dropdown-menu header__dropdown-menu">
                    <li><Link to="/catalog">Catalog style 1</Link></li>
                    <li><Link to="/catalog">Catalog style 2</Link></li>
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
                {user ? (
                  <div className="header__profile">
                    <a className="header__sign-in header__sign-in--user" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="ti ti-user"></i>
                      <span>{user.username || user.email}</span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                      <li><Link to="/profile"><i className="ti ti-ghost"></i>Profile</Link></li>
                      <li><Link to="/profile"><i className="ti ti-stereo-glasses"></i>Subscription</Link></li>
                      <li><Link to="/profile"><i className="ti ti-bookmark"></i>Favorites</Link></li>
                      <li><Link to="/profile"><i className="ti ti-settings"></i>Settings</Link></li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                          <i className="ti ti-logout"></i>Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link to="/login" className="header__sign-in">
                    <i className="ti ti-login"></i>
                    <span>Sign In</span>
                  </Link>
                )}
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
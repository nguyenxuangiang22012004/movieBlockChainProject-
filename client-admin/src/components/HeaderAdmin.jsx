import React from 'react';
import { Link } from 'react-router-dom';

function HeaderAdmin() {
  return (
    <header className="header">
      <div className="header__content">
        <Link to="/admin" className="header__logo">
          <img src="/img/logo.svg" alt="" />
        </Link>
        <button className="header__btn" type="button">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default HeaderAdmin;
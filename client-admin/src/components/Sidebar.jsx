import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <Link to="/admin" className="sidebar__logo">
        <img src="/img/logo.svg" alt="" />
      </Link>

      <div className="sidebar__user">
        <div className="sidebar__user-img">
          <img src="/img/user.svg" alt="" />
        </div>
        <div className="sidebar__user-title">
          <span>Admin</span>
          <p>John Doe</p>
        </div>
        <button className="sidebar__user-btn" type="button" onClick={onLogout}>
          <i className="ti ti-logout"></i>
        </button>

      </div>

      <div className="sidebar__nav-wrap">
        <ul className="sidebar__nav">
          <li className="sidebar__nav-item">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `sidebar__nav-link ${isActive ? "sidebar__nav-link--active" : ""}`
              }
            >
              <i className="ti ti-layout-grid"></i> <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink
              to="/admin/catalog"
              className={({ isActive }) =>
                `sidebar__nav-link ${isActive ? "sidebar__nav-link--active" : ""}`
              }
            >
              <i className="ti ti-movie"></i> <span>Catalog</span>
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `sidebar__nav-link ${isActive ? "sidebar__nav-link--active" : ""}`
              }
            >
              <i className="ti ti-users"></i> <span>Users</span>
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink
              to="/admin/comments"
              className={({ isActive }) =>
                `sidebar__nav-link ${isActive ? "sidebar__nav-link--active" : ""}`
              }
            >
              <i className="ti ti-message"></i> <span>Comments</span>
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `sidebar__nav-link ${isActive ? "sidebar__nav-link--active" : ""}`
              }
            >
              <i className="ti ti-star-half-filled"></i> <span>Reviews</span>
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `sidebar__nav-link ${isActive ? "sidebar__nav-link--active" : ""}`
              }
            >
              <i className="ti ti-settings"></i> <span>Settings</span>
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <a
              className="sidebar__nav-link"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-files"></i> <span>Pages</span>{" "}
              <i className="ti ti-chevron-down"></i>
            </a>
            <ul className="dropdown-menu sidebar__dropdown-menu">
              <li>
                <Link to="/admin/add-item">Add item</Link>
              </li>
              <li>
                <Link to="/admin/edit-admin">Edit user</Link>
              </li>
            </ul>
          </li>
          <li className="sidebar__nav-item">
            <a
              href="http://localhost:5173"
              className="sidebar__nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ti ti-arrow-left"></i>{" "}
              <span>Back to HotFlix</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="sidebar__copyright">
        © HOTFLIX, 2025. <br />
        Create by{" "}
        <a
          href="https://themeforest.net/user/dmitryvolkov/portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Giang
        </a>
      </div>
    </div>
  );
}

export default Sidebar;

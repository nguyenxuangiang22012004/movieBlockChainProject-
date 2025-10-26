import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);

  const sortSelectRef = useRef(null);

  // Fetch users từ API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers({
        page: currentPage,
        limit: usersPerPage,
        search: searchTerm,
      });
      
      // Đảm bảo data luôn có cấu trúc đúng
      setUsers(Array.isArray(data?.data) ? data.data : []);
      setTotal(typeof data?.total === 'number' ? data.total : 0);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API mỗi khi page hoặc search thay đổi
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  // Khởi tạo SlimSelect (dropdown sort)
  useEffect(() => {
    if (window.SlimSelect && !sortSelectRef.current) {
      sortSelectRef.current = new window.SlimSelect({
        select: "#filter__sort",
        settings: { showSearch: false },
      });
    }
    return () => {
      if (sortSelectRef.current) {
        sortSelectRef.current.destroy();
        sortSelectRef.current = null;
      }
    };
  }, []);

  const totalPages = Math.ceil(total / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Format date consistently
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return "N/A";
    }
  };

  // Get display name
  const getDisplayName = (user) => {
    return user?.full_name || user?.username || "Unknown";
  };

  // Get pricing plan
  const getPricingPlan = (user) => {
    return user?.subscriptionCache?.planName || user?.subscription?.planName || "Free";
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* main title */}
        <div className="col-12">
          <div className="main__title">
            <h2>Users</h2>
            <span className="main__title-stat">{total} Total</span>
            <div className="main__title-wrap">
              <button
                type="button"
                data-bs-toggle="modal"
                className="main__title-link main__title-link--wrap"
                data-bs-target="#modal-user"
              >
                Add user
              </button>
              <select className="filter__select" name="sort" id="filter__sort">
                <option value="0">Date created</option>
                <option value="1">Pricing plan</option>
                <option value="2">Status</option>
              </select>
              <form
                className="main__title-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  placeholder="Find user.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button">
                  <i className="ti ti-search"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* end main title */}

        {/* users table */}
        <div className="col-12">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="catalog catalog--1">
              <table className="catalog__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>BASIC INFO</th>
                    <th>USERNAME</th>
                    <th>PRICING PLAN</th>
                    <th>COMMENTS</th>
                    <th>REVIEWS</th>
                    <th>STATUS</th>
                    <th>CREATED DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user._id || user.id || index}>
                        <td>
                          <div className="catalog__text">
                            {(currentPage - 1) * usersPerPage + index + 1}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__user">
                            <div className="catalog__avatar">
                              <img
                                src={user.avatar_url || user.avatar || "/img/user.svg"}
                                alt={getDisplayName(user)}
                                onError={(e) => {
                                  e.target.src = "/img/user.svg";
                                }}
                              />
                            </div>
                            <div className="catalog__meta">
                              <h3>{getDisplayName(user)}</h3>
                              <span>{user.email || "No email"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {user.username || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {getPricingPlan(user)}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {user.comments?.total || user.commentsCount || 0}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {user.reviews?.total || user.reviewsCount || 0}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`catalog__text ${
                              user.status === "approved" || user.status === "active"
                                ? "catalog__text--green"
                                : "catalog__text--red"
                            }`}
                          >
                            {user.status || "pending"}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {formatDate(user.createdAt || user.created_at)}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__btns">
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              className="catalog__btn catalog__btn--banned"
                              data-bs-target="#modal-status"
                            >
                              <i className="ti ti-lock"></i>
                            </button>
                            <Link
                              to={`/admin/edit-user/${user._id || user.id}`}
                              className="catalog__btn catalog__btn--edit"
                            >
                              <i className="ti ti-edit"></i>
                            </Link>
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              className="catalog__btn catalog__btn--delete"
                              data-bs-target="#modal-delete"
                            >
                              <i className="ti ti-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-3">
                        <div className="catalog__text">
                          {searchTerm ? "Không tìm thấy kết quả" : "Không có dữ liệu"}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* end users table */}

        {/* paginator */}
        <div className="col-12">
          <div className="main__paginator">
            <span className="main__paginator-pages">
              {total > 0
                ? `${(currentPage - 1) * usersPerPage + 1}-${Math.min(
                    currentPage * usersPerPage,
                    total
                  )}`
                : "0"}{" "}
              of {total}
            </span>
            <ul className="main__paginator-list">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    paginate(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "disabled" : ""}
                >
                  <i className="ti ti-chevron-left"></i>
                  <span>Prev</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    paginate(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "disabled" : ""}
                >
                  <span>Next</span>
                  <i className="ti ti-chevron-right"></i>
                </a>
              </li>
            </ul>
            <ul className="paginator">
              <li className="paginator__item paginator__item--prev">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    paginate(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "disabled" : ""}
                >
                  <i className="ti ti-chevron-left"></i>
                </a>
              </li>
              {[...Array(totalPages).keys()].map((number) => (
                <li
                  key={number + 1}
                  className={`paginator__item ${
                    currentPage === number + 1 ? "paginator__item--active" : ""
                  }`}
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      paginate(number + 1);
                    }}
                  >
                    {number + 1}
                  </a>
                </li>
              ))}
              <li className="paginator__item paginator__item--next">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    paginate(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "disabled" : ""}
                >
                  <i className="ti ti-chevron-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* end paginator */}
      </div>
    </div>
  );
}

export default UsersPage;
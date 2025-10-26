import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllUsers, createUser } from "../services/userService";
import Swal from "sweetalert2";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      Swal.fire("Thiếu dữ liệu", "Vui lòng nhập đầy đủ thông tin", "warning");
      return;
    }

    try {
      const res = await createUser(newUser);
      if (res.success) {
        Swal.fire("Thành công", "Đã thêm người dùng mới!", "success");
        setNewUser({ username: "", email: "", password: "" });
        fetchUsers(); // 🔄 Reload danh sách
        // Đóng modal (nếu dùng Bootstrap modal)
        const modalEl = document.getElementById("modal-user");
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      } else {
        Swal.fire("Lỗi", res.message || "Không thể thêm người dùng", "error");
      }
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err.response?.data?.message || "Không thể kết nối tới server",
        "error"
      );
    }
  };

  return (
    <>
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
                              className={`catalog__text ${user.status === "approved" || user.status === "active"
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
                    className={`paginator__item ${currentPage === number + 1 ? "paginator__item--active" : ""
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

      {/* Modal Add User */}
      <div className="modal fade" id="modal-user" tabIndex="-1" aria-labelledby="modal-user" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content">
              <button className="modal__close" type="button" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-x"></i>
              </button>
              <h4 className="modal__title">Add user</h4>
              <p className="modal__text">Fill in the form below to add a new user</p>
              <form className="modal__form" onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                  <div className="col-12">
                    <div className="sign__group">
                      <label className="sign__label" htmlFor="username">Username</label>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        value={newUser.username}
                        onChange={handleInputChange}
                        className="sign__input"
                        placeholder="Username"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="sign__group">
                      <label className="sign__label" htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        className="sign__input"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="sign__group">
                      <label className="sign__label" htmlFor="password">Password</label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        className="sign__input"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      className="sign__btn"
                      type="button"
                      onClick={handleAddUser}
                    >
                      Add user
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end modal add user */}

      {/* Modal Status */}
      <div className="modal fade" id="modal-status" tabIndex="-1" aria-labelledby="modal-status" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content">
              <button className="modal__close" type="button" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-x"></i>
              </button>
              <h4 className="modal__title">Change user status</h4>
              <p className="modal__text">Are you sure you want to change the status of this user?</p>
              <div className="modal__btns">
                <button className="modal__btn modal__btn--apply" type="button">Change</button>
                <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end modal status */}

      {/* Modal Delete */}
      <div className="modal fade" id="modal-delete" tabIndex="-1" aria-labelledby="modal-delete" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content">
              <button className="modal__close" type="button" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-x"></i>
              </button>
              <h4 className="modal__title">Delete user</h4>
              <p className="modal__text">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="modal__btns">
                <button className="modal__btn modal__btn--apply" type="button">Delete</button>
                <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end modal delete */}
    </>
  );
}

export default UsersPage;
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserByIdService, updateUserService, deleteUserService, updateUserStatusService } from "../services/userService";
function EditUserPage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  //  const [subscription, setSubscription] = useState("Basic");
  // const [rights, setRights] = useState("User");

  // const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // const subscriptionOptions = ["Basic", "Premium", "Cinematic"];
  // const rightsOptions = ["User", "Moderator", "Admin"];
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    role: "user",
    subscriptionPlan: "Basic",
    walletAddress: "",
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserByIdService(userId);
        setUser(res.data);
        setForm({
          username: res.data.username,
          email: res.data.email,
          full_name: res.data.full_name || "",
          role: res.data.role || "user",
          subscriptionPlan: res.data.subscriptionCache?.planName || "Basic",
          walletAddress: res.data.walletAddress || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        Swal.fire("Lỗi", "Không thể tải thông tin người dùng!", "error");
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (user) console.log("User state updated:", user);
  }, [user]);
  // ✅ Submit cập nhật user
  const handleSave = async () => {
    try {
      const updateData = {
        username: form.username,
        email: form.email,
        full_name: form.full_name,
        role: form.role,
        subscriptionCache: { planName: form.subscriptionPlan },
        walletAddress: form.walletAddress,
      };

      const res = await updateUserService(userId, updateData);

      Swal.fire("Thành công", res.message || "Cập nhật người dùng thành công!", "success");
    } catch (err) {
      console.error("Update user error:", err);
      Swal.fire("Lỗi", err.response?.data?.message || "Cập nhật thất bại!", "error");
    }
  };


  // ✅ Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleStatus = async () => {
    if (!user?._id) return;

    const newStatus = user.status === "approved" ? "banned" : "approved";

    const confirm = await Swal.fire({
      title: "Thay đổi trạng thái?",
      text: `Bạn có chắc muốn chuyển người dùng này sang trạng thái '${newStatus}' không?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      reverseButtons: false,
    });

    if (confirm.isConfirmed) {
      try {
        const res = await updateUserStatusService(user._id, newStatus);
        Swal.fire("Thành công", res.message || "Cập nhật trạng thái thành công!", "success");
        // Cập nhật lại state user
        setUser((prev) => ({ ...prev, status: newStatus }));
      } catch (err) {
        Swal.fire("Lỗi", err.response?.data?.message || "Không thể thay đổi trạng thái!", "error");
      }
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        {/* main title */}
        <div className="col-12">
          <div className="main__title">
            <h2>Edit user</h2>
          </div>
        </div>
        {/* end main title */}

        {/* profile */}
        <div className="col-12">
          <div className="profile__content">
            <div className="profile__user">
              <div className="profile__avatar">
                <img
                  src={user?.avatar || "/img/user.svg"}
                  alt={user?.username || "user"}
                />
              </div>

              <div className="profile__meta profile__meta--green">
                <h3>
                  {user?.username || "Unknown"}{" "}
                  <span>({user?.status || "Pending"})</span>
                </h3>
                <span>HotFlix ID: {user?._id?.slice(-6) || "N/A"}</span>
              </div>
            </div>

            <ul className="nav nav-tabs profile__tabs" id="profile__tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={activeTab === 'profile' ? 'active' : ''}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={activeTab === 'comments' ? 'active' : ''}
                  onClick={() => setActiveTab('comments')}
                >
                  Comments
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={activeTab === 'reviews' ? 'active' : ''}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </li>
            </ul>

            <div className="profile__actions">
              <button
                type="button"
                className="profile__action profile__action--banned"
                onClick={handleToggleStatus}
              >
                <i className="ti ti-lock"></i>
              </button>
              <button
                className="profile__action profile__action--delete"
                type="button"
                onClick={async () => {
                  const confirm = await Swal.fire({
                    title: "Xóa người dùng?",
                    text: "Hành động này sẽ xóa vĩnh viễn người dùng khỏi hệ thống!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Xóa",
                    cancelButtonText: "Hủy",
                    reverseButtons: false,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                  });

                  if (confirm.isConfirmed) {
                    try {
                      const res = await deleteUserService(userId);
                      await Swal.fire(
                        "Đã xóa!",
                        res.message || "Người dùng đã bị xóa thành công!",
                        "success"
                      );
                      window.location.href = "/admin/users";
                    } catch (err) {
                      console.error("❌ Delete user error:", err);
                      Swal.fire(
                        "Lỗi",
                        err.response?.data?.message || "Không thể xóa người dùng!",
                        "error"
                      );
                    }
                  }
                }}
              >
                <i className="ti ti-trash"></i>
              </button>
            </div>
          </div>
        </div>
        {/* end profile */}

        {/* content tabs */}
        <div className="tab-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-pane fade show active">
              <div className="col-12">
                <div className="row">
                  {/* details form */}
                  <div className="col-12 col-lg-6">
                    <form className="sign__form sign__form--profile">
                      <div className="row">
                        <div className="col-12">
                          <h4 className="sign__title">Profile details</h4>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="username">Username</label>
                            <input
                              id="username"
                              name="username"
                              type="text"
                              className="sign__input"
                              value={form.username}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="email">Email</label>
                            <input
                              id="email"
                              name="email"
                              type="text"
                              className="sign__input"
                              value={form.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="full_name">Full name</label>
                            <input
                              id="full_name"
                              name="full_name"
                              type="text"
                              className="sign__input"
                              value={form.full_name}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="subscription">Subscription</label>
                            <select
                              id="subscription"
                              name="subscriptionPlan"
                              className="sign__select"
                              value={form.subscriptionPlan}
                              onChange={handleChange}
                            >
                              <option value="Basic">Basic</option>
                              <option value="Premium">Premium</option>
                              <option value="Cinematic">Cinematic</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="role">Rights</label>
                            <select
                              id="role"
                              name="role"
                              className="sign__select"
                              value={form.role}
                              onChange={handleChange}
                            >
                              <option value="user">User</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="walletAddress">Wallet Address</label>
                            <input
                              id="walletAddress"
                              name="walletAddress"
                              type="text"
                              className="sign__input"
                              placeholder="0x..."
                              value={form.walletAddress}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <button
                            className="sign__btn sign__btn--small"
                            type="button"
                            onClick={handleSave}
                          >
                            <span>Save</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* end details form */}

                  {/* password form */}
                  <div className="col-12 col-lg-6">
                    <form action="#" className="sign__form sign__form--profile">
                      <div className="row">
                        <div className="col-12">
                          <h4 className="sign__title">Change password</h4>
                        </div>

                        <div className="col-12 col-md-6 col-lg-12 col-xxl-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="oldpass">Old Password</label>
                            <input id="oldpass" type="password" name="oldpass" className="sign__input" />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-12 col-xxl-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="newpass">New Password</label>
                            <input id="newpass" type="password" name="newpass" className="sign__input" />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-12 col-xxl-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="confirmpass">Confirm New Password</label>
                            <input id="confirmpass" type="password" name="confirmpass" className="sign__input" />
                          </div>
                        </div>

                        <div className="col-12">
                          <button className="sign__btn sign__btn--small" type="button">
                            <span>Change</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* end password form */}
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="tab-pane fade show active">
              <div className="col-12">
                <div className="catalog catalog--1">
                  <table className="catalog__table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>ITEM</th>
                        <th>AUTHOR</th>
                        <th>TEXT</th>
                        <th>LIKE / DISLIKE</th>
                        <th>CRAETED DATE</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>
                          <div className="catalog__text">11</div>
                        </td>
                        <td>
                          <div className="catalog__text"><a href="#">I Dream in Another Language</a></div>
                        </td>
                        <td>
                          <div className="catalog__text">Charlize Theron</div>
                        </td>
                        <td>
                          <div className="catalog__text">When a renowned archaeologist goes...</div>
                        </td>
                        <td>
                          <div className="catalog__text">12 / 7</div>
                        </td>
                        <td>
                          <div className="catalog__text">05.02.2023</div>
                        </td>
                        <td>
                          <div className="catalog__btns">
                            <button type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--view" data-bs-target="#modal-view">
                              <i className="ti ti-eye"></i>
                            </button>

                            <button type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--delete" data-bs-target="#modal-delete">
                              <i className="ti ti-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Additional comment rows would go here */}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* paginator */}
              <div className="col-12">
                <div className="main__paginator">
                  <span className="main__paginator-pages">10 of 169</span>

                  <ul className="main__paginator-list">
                    <li>
                      <a href="#">
                        <i className="ti ti-chevron-left"></i>
                        <span>Prev</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span>Next</span>
                        <i className="ti ti-chevron-right"></i>
                      </a>
                    </li>
                  </ul>

                  <ul className="paginator">
                    <li className="paginator__item paginator__item--prev">
                      <a href="#"><i className="ti ti-chevron-left"></i></a>
                    </li>
                    <li className="paginator__item"><a href="#">1</a></li>
                    <li className="paginator__item paginator__item--active"><a href="#">2</a></li>
                    <li className="paginator__item"><a href="#">3</a></li>
                    <li className="paginator__item"><a href="#">4</a></li>
                    <li className="paginator__item"><span>...</span></li>
                    <li className="paginator__item"><a href="#">29</a></li>
                    <li className="paginator__item"><a href="#">30</a></li>
                    <li className="paginator__item paginator__item--next">
                      <a href="#"><i className="ti ti-chevron-right"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* end paginator */}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="tab-pane fade show active">
              <div className="col-12">
                <div className="catalog catalog--2">
                  <table className="catalog__table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>ITEM</th>
                        <th>AUTHOR</th>
                        <th>TEXT</th>
                        <th>RATING</th>
                        <th>CRAETED DATE</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>
                          <div className="catalog__text">11</div>
                        </td>
                        <td>
                          <div className="catalog__text"><a href="#">I Dream in Another Language</a></div>
                        </td>
                        <td>
                          <div className="catalog__text">Gene Graham</div>
                        </td>
                        <td>
                          <div className="catalog__text">Her father and uncover the secrets...</div>
                        </td>
                        <td>
                          <div className="catalog__text catalog__text--rate">7.9</div>
                        </td>
                        <td>
                          <div className="catalog__text">06.02.2023</div>
                        </td>
                        <td>
                          <div className="catalog__btns">
                            <button type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--view" data-bs-target="#modal-view2">
                              <i className="ti ti-eye"></i>
                            </button>

                            <button type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--delete" data-bs-target="#modal-delete2">
                              <i className="ti ti-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Additional review rows would go here */}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* paginator */}
              <div className="col-12">
                <div className="main__paginator">
                  <span className="main__paginator-pages">10 of 169</span>

                  <ul className="main__paginator-list">
                    <li>
                      <a href="#">
                        <i className="ti ti-chevron-left"></i>
                        <span>Prev</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span>Next</span>
                        <i className="ti ti-chevron-right"></i>
                      </a>
                    </li>
                  </ul>

                  <ul className="paginator">
                    <li className="paginator__item paginator__item--prev">
                      <a href="#"><i className="ti ti-chevron-left"></i></a>
                    </li>
                    <li className="paginator__item"><a href="#">1</a></li>
                    <li className="paginator__item paginator__item--active"><a href="#">2</a></li>
                    <li className="paginator__item"><a href="#">3</a></li>
                    <li className="paginator__item"><a href="#">4</a></li>
                    <li className="paginator__item"><span>...</span></li>
                    <li className="paginator__item"><a href="#">29</a></li>
                    <li className="paginator__item"><a href="#">30</a></li>
                    <li className="paginator__item paginator__item--next">
                      <a href="#"><i className="ti ti-chevron-right"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* end paginator */}
            </div>
          )}
        </div>
        {/* end content tabs */}
      </div>

      {/* Modals */}
      {/* view modal */}
      <div className="modal fade" id="modal-view" tabIndex="-1" aria-labelledby="modal-view" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content modal__content--view">
              <div className="comments__autor">
                <img className="comments__avatar" src="/img/user.svg" alt="" />
                <span className="comments__name">John Doe</span>
                <span className="comments__time">30.08.2023, 17:53</span>
              </div>
              <p className="comments__text">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>
              <div className="comments__actions">
                <div className="comments__rate">
                  <span><i className="ti ti-thumb-up"></i>12</span>

                  <span>7<i className="ti ti-thumb-down"></i></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end view modal */}

      {/* delete modal */}
      <div className="modal fade" id="modal-delete" tabIndex="-1" aria-labelledby="modal-delete" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content">
              <form action="#" className="modal__form">
                <h4 className="modal__title">Comment delete</h4>

                <p className="modal__text">Are you sure to permanently delete this comment?</p>

                <div className="modal__btns">
                  <button className="modal__btn modal__btn--apply" type="button"><span>Delete</span></button>
                  <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal" aria-label="Close"><span>Dismiss</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end delete modal */}

      {/* view modal */}
      <div className="modal fade" id="modal-view2" tabIndex="-1" aria-labelledby="modal-view2" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content modal__content--view">
              <div className="reviews__autor">
                <img className="reviews__avatar" src="/img/user.svg" alt="" />
                <span className="reviews__name">Best Marvel movie in my opinion</span>
                <span className="reviews__time">24.08.2018, 17:53 by John Doe</span>

                <span className="reviews__rating reviews__rating--green">8.4</span>
              </div>
              <p className="reviews__text">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>
            </div>
          </div>
        </div>
      </div>
      {/* end view modal */}

      {/* delete modal */}
      <div className="modal fade" id="modal-delete2" tabIndex="-1" aria-labelledby="modal-delete2" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content">
              <form action="#" className="modal__form">
                <h4 className="modal__title">Review delete</h4>

                <p className="modal__text">Are you sure to permanently delete this review?</p>

                <div className="modal__btns">
                  <button className="modal__btn modal__btn--apply" type="button"><span>Delete</span></button>
                  <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal" aria-label="Close"><span>Dismiss</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end delete modal */}

      {/* status modal */}
      <div className="modal fade" id="modal-status3" tabIndex="-1" aria-labelledby="modal-status3" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content">
              <form action="#" className="modal__form">
                <h4 className="modal__title">Status change</h4>

                <p className="modal__text">Are you sure about immediately change status?</p>

                <div className="modal__btns">
                  <button className="modal__btn modal__btn--apply" type="button"><span>Apply</span></button>
                  <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal" aria-label="Close"><span>Dismiss</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end status modal */}

      {/* delete modal */}
      <div className="modal fade" id="modal-delete3" tabIndex="-1" aria-labelledby="modal-delete3" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal__content">
              <form action="#" className="modal__form">
                <h4 className="modal__title">User delete</h4>

                <p className="modal__text">Are you sure to permanently delete this user?</p>

                <div className="modal__btns">
                  <button className="modal__btn modal__btn--apply" type="button"><span>Delete</span></button>
                  <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal" aria-label="Close"><span>Dismiss</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end delete modal */}
    </div>
  );
}

export default EditUserPage;
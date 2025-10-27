import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

function EditUserPage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  //  const [subscription, setSubscription] = useState("Basic");
  // const [rights, setRights] = useState("User");

  // const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // const subscriptionOptions = ["Basic", "Premium", "Cinematic"];
  // const rightsOptions = ["User", "Moderator", "Admin"];

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
                <img src="/img/user.svg" alt="" />
              </div>
              <div className="profile__meta profile__meta--green">
                <h3>John Doe <span>(Approved)</span></h3>
                <span>HotFlix ID: 23562</span>
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
              <button type="button" data-bs-toggle="modal" className="profile__action profile__action--banned" data-bs-target="#modal-status3">
                <i className="ti ti-lock"></i>
              </button>
              <button type="button" data-bs-toggle="modal" className="profile__action profile__action--delete" data-bs-target="#modal-delete3">
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
                    <form action="#" className="sign__form sign__form--profile">
                      <div className="row">
                        <div className="col-12">
                          <h4 className="sign__title">Profile details</h4>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="username">Username</label>
                            <input id="username" type="text" name="username" className="sign__input" placeholder="User 123" />
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="email2">Email</label>
                            <input id="email2" type="text" name="email" className="sign__input" placeholder="email@email.com" />
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="fname">Name</label>
                            <input id="fname" type="text" name="fname" className="sign__input" placeholder="John Doe" />
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="sign__gallery-upload">Avatar</label>
                            <div className="sign__gallery">
                              <label id="gallery1" htmlFor="sign__gallery-upload">Upload (40x40)</label>
                              <input data-name="#gallery1" id="sign__gallery-upload" name="gallery" className="sign__gallery-upload" type="file" accept=".png, .jpg, .jpeg" multiple="" />
                            </div>
                          </div>
                        </div>

                        {/* Subscription */}
                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label
                              className="sign__label"
                              htmlFor="subscription"
                            >
                              Subscription
                            </label>
                            <select className="sign__select" id="subscription">
                              <option value="Basic">Basic</option>
                              <option value="Premium">Premium</option>
                              <option value="Cinematic">Cinematic</option>
                            </select>
                          </div>
                        </div>

                        {/* Rights */}
                        <div className="col-12 col-md-6">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="rights">
                              Rights
                            </label>
                            <select className="sign__select" id="rights">
                              <option value="User">User</option>
                              <option value="Moderator">Moderator</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-12">
                          <button className="sign__btn sign__btn--small" type="button">
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
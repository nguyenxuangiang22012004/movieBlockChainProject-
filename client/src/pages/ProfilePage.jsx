import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import PlanModal from '../components/PlanModal';

// Dữ liệu mẫu - bạn sẽ thay thế bằng dữ liệu thật từ API
const favoriteMovies = [
    { id: 1, cover: '/img/covers/cover.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 2, cover: '/img/covers/cover2.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
    //... thêm các phim yêu thích khác
];

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile'); // State để quản lý tab đang hoạt động

  return (
    <>
      {/* page title */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">My HotFlix</h1>
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">Profile</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end page title */}

      {/* content */}
      <div className="content">
        {/* profile */}
        <div className="profile">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="profile__content">
                  <div className="profile__user">
                    <div className="profile__avatar">
                      <img src="/img/user.svg" alt="" />
                    </div>
                    <div className="profile__meta">
                      <h3>John Doe</h3>
                      <span>HOTFLIX ID: 78123</span>
                    </div>
                  </div>

                  {/* content tabs nav */}
                  <ul className="nav nav-tabs content__tabs content__tabs--profile" id="content__tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className={activeTab === 'subs' ? 'active' : ''} onClick={() => setActiveTab('subs')}>Subs</button>
                    </li>
                    <li className="nav-item" role="presentation">
                       <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>Favorites</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</button>
                    </li>
                  </ul>
                  {/* end content tabs nav */}

                  <button className="profile__logout" type="button">
                    <i className="ti ti-logout"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end profile */}

        <div className="container">
          {/* content tabs */}
          <div className="tab-content">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  {/* stats */}
                  <div className="col-12 col-md-6 col-xl-3"><div className="stats"><span>Premium plan</span><p>$34.99 / month</p><i className="ti ti-credit-card"></i></div></div>
                  <div className="col-12 col-md-6 col-xl-3"><div className="stats"><span>Films watched</span><p>1 678</p><i className="ti ti-movie"></i></div></div>
                  <div className="col-12 col-md-6 col-xl-3"><div className="stats"><span>Your comments</span><p>2 573</p><i className="ti ti-message-circle"></i></div></div>
                  <div className="col-12 col-md-6 col-xl-3"><div className="stats"><span>Your reviews</span><p>1 021</p><i className="ti ti-star-half-filled"></i></div></div>
                  {/* end stats */}
                </div>
                 {/* ... dashbox tables ... */}
              </div>
            )}

            {/* Subs Tab */}
            {activeTab === 'subs' && (
              <div className="tab-pane fade show active">
                <div className="row">
                   {/* ... plan cards ... */}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  {favoriteMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
                <div className="row">
                    <Pagination />
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  {/* details form */}
                  <div className="col-12 col-lg-6">
                    <form action="#" className="sign__form sign__form--full">
                       {/* ... profile details form fields ... */}
                    </form>
                  </div>
                  {/* end details form */}
                  {/* password form */}
                  <div className="col-12 col-lg-6">
                    <form action="#" className="sign__form sign__form--full">
                       {/* ... change password form fields ... */}
                    </form>
                  </div>
                  {/* end password form */}
                </div>
              </div>
            )}
          </div>
          {/* end content tabs */}
        </div>
      </div>
      {/* end content */}
      <PlanModal />
    </>
  );
}

export default ProfilePage;
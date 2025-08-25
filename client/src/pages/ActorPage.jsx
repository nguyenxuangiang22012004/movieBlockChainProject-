import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard'; // Tái sử dụng MovieCard
import Pagination from '../components/Pagination'; // Tái sử dụng Pagination

// Dữ liệu mẫu cho các phim đã đóng
const filmographyMovies = [
    { id: 1, cover: '/img/covers/cover.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 2, cover: '/img/covers/cover2.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
    // ... Thêm dữ liệu phim khác
];

function ActorPage() {
  const { actorId } = useParams(); // Lấy ID diễn viên từ URL, ví dụ: /actor/michelle-rodriguez

  useEffect(() => {
    // ---- KHỞI TẠO CÁC THƯ VIỆN JAVASCRIPT ----

    // 1. Đặt ảnh nền động
    const detailsBg = document.querySelector('.section__details-bg');
    if (detailsBg && detailsBg.getAttribute('data-bg')) {
      const bgUrl = detailsBg.getAttribute('data-bg');
      detailsBg.style.background = `url(${bgUrl}) center center / cover no-repeat`;
    }

    // 2. Khởi tạo PhotoSwipe Gallery
    // LƯU Ý: Mã này cần được đặt trong useEffect để đảm bảo các phần tử DOM đã tồn tại.
    // Đây là mã đã được điều chỉnh từ file main.js của bạn.
    const initPhotoSwipeFromDOM = (gallerySelector) => {
        // ... (Sao chép toàn bộ mã hàm initPhotoSwipeFromDOM từ file main.js gốc vào đây)
        // ... Hoặc từ các câu trả lời trước tôi đã cung cấp cho DetailsPage
    };

    // Khởi chạy gallery khi component được mount
    initPhotoSwipeFromDOM('.gallery');

  }, [actorId]); // Chạy lại hiệu ứng nếu actorId thay đổi

  return (
    <>
      {/* details */}
      <section className="section section--details">
        <div className="section__details-bg" data-bg="/img/bg/actor__bg.jpg"></div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="section__title section__title--head">Michelle Rodriguez</h1>
            </div>
            <div className="col-12 col-lg-9 col-xl-6">
              <div className="item item--details">
                <div className="row">
                  <div className="col-12 col-sm-5 col-md-5">
                    <div className="item__cover">
                      <img src="/img/covers/actor.jpg" alt="" />
                    </div>
                  </div>
                  <div className="col-12 col-md-7">
                    <div className="item__content">
                      <ul className="item__meta">
                        <li><span>Career:</span> Actress</li>
                        <li><span>Height:</span> 1.65 m</li>
                        <li><span>Date of birth:</span> July 12, 1978</li>
                        <li><span>Genres:</span> <Link to="#">Action</Link> <Link to="#">Triler</Link> <Link to="#">Drama</Link></li>
                        <li><span>Best movie:</span> <Link to="/details/1">Avatar</Link></li>
                        {/* ... Các thông tin khác ... */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end details */}

      {/* content */}
      <section className="content">
        <div className="content__head content__head--mt">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="content__title">Discover</h2>
                <ul className="nav nav-tabs content__tabs" id="content__tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button id="1-tab" className="active" data-bs-toggle="tab" data-bs-target="#tab-1" type="button" role="tab" aria-controls="tab-1" aria-selected="true">Filmography</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button id="2-tab" data-bs-toggle="tab" data-bs-target="#tab-2" type="button" role="tab" aria-controls="tab-2" aria-selected="false">Photos</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tab-content">
                <div className="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="1-tab" tabIndex="0">
                  <div className="row">
                    {filmographyMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                  </div>
                  <div className="row">
                    <Pagination />
                  </div>
                </div>
                <div className="tab-pane fade" id="tab-2" role="tabpanel" aria-labelledby="2-tab" tabIndex="0">
                  <div className="gallery gallery--full" itemScope>
                    <div className="row">
                      <figure className="col-12 col-sm-6 col-xl-4" itemProp="associatedMedia" itemScope>
                        <a href="/img/gallery/project-1.jpg" itemProp="contentUrl" data-size="1920x1280">
                          <img src="/img/gallery/project-1.jpg" itemProp="thumbnail" alt="Image description" />
                        </a>
                        <figcaption itemProp="caption description">Some image caption 1</figcaption>
                      </figure>
                      {/* ... Thêm các <figure> khác ... */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end content */}

      {/* PhotoSwipe Root Element (Bắt buộc phải có) */}
      <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
          {/* ... Sao chép toàn bộ cấu trúc của div.pswp từ file HTML gốc ... */}
      </div>
    </>
  );
}

export default ActorPage;

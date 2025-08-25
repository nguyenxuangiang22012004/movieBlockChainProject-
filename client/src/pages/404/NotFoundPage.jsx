import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  const page404Ref = useRef(null);

  useEffect(() => {
    // Tái tạo lại chức năng đặt ảnh nền từ data-bg
    if (page404Ref.current && page404Ref.current.getAttribute('data-bg')) {
      const bgUrl = page404Ref.current.getAttribute('data-bg');
      page404Ref.current.style.background = `url(${bgUrl})`;
      page404Ref.current.style.backgroundPosition = 'center center';
      page404Ref.current.style.backgroundRepeat = 'no-repeat';
      page404Ref.current.style.backgroundSize = 'cover';
    }
  }, []);

  return (
    <div className="page-404 section--bg" data-bg="/img/bg/section__bg.jpg" ref={page404Ref}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="page-404__wrap">
              <div className="page-404__content">
                <h1 className="page-404__title">404</h1>
                <p className="page-404__text">The page you are looking for <br />not available!</p>
                <Link to="/" className="page-404__btn">go back</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
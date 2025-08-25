import React from 'react';
import { Link } from 'react-router-dom';

function FaqPage() {
  return (
    <>
      {/* page title */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">FAQ</h1>
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">FAQ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end page title */}

      {/* faq */}
      <section className="section section--notitle">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="accordion" id="accordion">
                <div className="row">
                  <div className="col-12 col-xl-6">
                    <div className="accordion__card">
                      <button className="collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapse1">
                        Why is a video is not loading?
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,11H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z" /></svg>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,11H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z" /></svg>
                        </span>
                      </button>
                      <div id="collapse1" className="collapse" data-bs-parent="#accordion">
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page <b>when looking at its layout</b>. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                      </div>
                    </div>

                    <div className="accordion__card">
                      <button className="collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                        Why isn't there a HD version of this video?
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,11H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z" /></svg>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,11H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z" /></svg>
                        </span>
                      </button>
                      <div id="collapse2" className="collapse" data-bs-parent="#accordion">
                        <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text...</p>
                      </div>
                    </div>

                    {/* ... Thêm các accordion__card khác cho cột trái ... */}

                  </div>

                  <div className="col-12 col-xl-6">
                    <div className="accordion__card">
                      <button className="collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                        How do I make the video go fullscreen?
                        <span>
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,11H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z"/></svg>
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,11H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z"/></svg>
                        </span>
                      </button>
                      <div id="collapse5" className="collapse" data-bs-parent="#accordion">
                        <p>If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text...</p>
                      </div>
                    </div>

                    {/* ... Thêm các accordion__card khác cho cột phải ... */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end faq */}
    </>
  );
}

export default FaqPage;

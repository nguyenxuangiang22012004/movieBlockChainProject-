import React from 'react';
import { Link } from 'react-router-dom';

function ContactsPage() {
    // Trong ứng dụng thực tế, bạn sẽ dùng useState để quản lý dữ liệu form
    const handleSubmit = (event) => {
        event.preventDefault();
        // Xử lý logic gửi form ở đây
        console.log('Form submitted!');
    };

  return (
    <>
      {/* page title */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">Contacts</h1>
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">Contacts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end page title */}

      {/* contacts */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-8">
              <div className="row">
                <div className="col-12">
                  <h2 className="section__title">Contact Form</h2>
                </div>
                <div className="col-12">
                  <form action="#" className="sign__form sign__form--full" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-12 col-xl-6">
                        <div className="sign__group">
                          <label className="sign__label" htmlFor="firstname">Name</label>
                          <input id="firstname" type="text" name="firstname" className="sign__input" placeholder="John" />
                        </div>
                      </div>
                      <div className="col-12 col-xl-6">
                        <div className="sign__group">
                          <label className="sign__label" htmlFor="email">Email</label>
                          <input id="email" type="text" name="email" className="sign__input" placeholder="email@email.com" />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="sign__group">
                          <label className="sign__label" htmlFor="subject">Subject</label>
                          <input id="subject" type="text" name="subject" className="sign__input" placeholder="Partnership" />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="sign__group">
                          <label className="sign__label" htmlFor="message">Message</label>
                          <textarea id="message" name="message" className="sign__textarea" placeholder="Type your message..."></textarea>
                        </div>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="sign__btn sign__btn--small">Send</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <div className="row">
                <div className="col-12">
                  <h2 className="section__title section__title--mt">Get In Touch</h2>
                  <p className="section__text">We are always happy to help and provide more information about our services. You can contact us through email, phone, or by filling out the form on our website. Thank you for considering us!</p>
                  <ul className="contacts__list">
                    <li><a href="tel:+18002345678">+1 800 234 56 78</a></li>
                    <li><a href="mailto:support@hotflix.com">support@hotflix.template</a></li>
                  </ul>
                  <div className="contacts__social">
                    <a href="#"><i className="ti ti-brand-facebook"></i></a>
                    <a href="#"><i className="ti ti-brand-x"></i></a>
                    <a href="https://www.instagram.com/volkov_des1gn/" target="_blank" rel="noopener noreferrer"><i className="ti ti-brand-instagram"></i></a>
                    <a href="#"><i className="ti ti-brand-discord"></i></a>
                    <a href="#"><i className="ti ti-brand-telegram"></i></a>
                    <a href="#"><i className="ti ti-brand-tiktok"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end contacts */}
    </>
  );
}

export default ContactsPage;
import React, { useState } from 'react';

function SettingsPage() {
  // Trong ứng dụng thực tế, bạn sẽ dùng useState để quản lý từng giá trị trong form
  // Ví dụ: const [title, setTitle] = useState('HotFlix – Online Movies...');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // Xử lý logic lưu cài đặt ở đây
    console.log('Settings saved!');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* main title */}
        <div className="col-12">
          <div className="main__title">
            <h2>General settings</h2>
          </div>
        </div>
        {/* end main title */}

        {/* form */}
        <div className="col-12">
          <form action="#" className="sign__form sign__form--add" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12">
                <h3 className="sign__title">Meta settings</h3>
              </div>

              <div className="col-12 col-lg-4">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="sitetitle">Title <b>*</b></label>
                  <input type="text" className="sign__input" id="sitetitle" defaultValue="HotFlix – Online Movies, TV Shows & Cinema HTML Template" />
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="semail">Email <b>*</b></label>
                  <input type="text" className="sign__input" id="semail" />
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="sphone">Phone</label>
                  <input type="text" className="sign__input" id="sphone" />
                </div>
              </div>

              <div className="col-12">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="description">Description</label>
                  <textarea id="description" name="description" className="sign__textarea"></textarea>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="sign__btn sign__btn--small"><span>Save</span></button>
              </div>

              <div className="col-12">
                <h3 className="sign__title sign__title--mt">Home page</h3>
              </div>

              <div className="col-12 col-xl-4">
                <div className="sign__group">
                  <label className="sign__label">Hero type:</label>
                  <ul className="sign__radio">
                    <li><input id="hero1" type="radio" name="hero" defaultChecked /><label htmlFor="hero1">Single carousel</label></li>
                    <li><input id="hero2" type="radio" name="hero" /><label htmlFor="hero2">Carousel + bg img</label></li>
                    <li><input id="hero3" type="radio" name="hero" /><label htmlFor="hero3">Hero carousel</label></li>
                  </ul>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="sign__group">
                  <label className="sign__label">Content type:</label>
                  <ul className="sign__radio">
                    <li><input id="content1" type="radio" name="content" defaultChecked /><label htmlFor="content1">Tabs</label></li>
                    <li><input id="content2" type="radio" name="content" /><label htmlFor="content2">Pagination</label></li>
                    <li><input id="content3" type="radio" name="content" /><label htmlFor="content3">Load more</label></li>
                  </ul>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="sign__group sign__group--checkbox">
                  <label className="sign__label">Sections:</label>
                  <input id="premieres" name="premieres" type="checkbox" defaultChecked />
                  <label htmlFor="premieres">Show premieres</label>
                </div>
                <div className="sign__group sign__group--checkbox">
                  <input id="subscriptions" name="subscriptions" type="checkbox" defaultChecked />
                  <label htmlFor="subscriptions">Show subscriptions</label>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="sign__btn sign__btn--small"><span>Save</span></button>
              </div>
            </div>
          </form>
        </div>
        {/* end form */}
      </div>
    </div>
  );
}

export default SettingsPage;
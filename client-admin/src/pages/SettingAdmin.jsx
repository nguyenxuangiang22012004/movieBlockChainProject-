import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function SettingAdmin() {
  // Ref để lưu instance của SlimSelect
  const selectRef = useRef(null);

  // useEffect để khởi tạo và hủy SlimSelect
  useEffect(() => {
    if (window.SlimSelect && !selectRef.current) {
        selectRef.current = new window.SlimSelect({
        select: '#select-settings', // Đặt ID duy nhất cho select này
        settings: { showSearch: false }
      });
    }
    
    return () => {
      if (selectRef.current) {
        selectRef.current.destroy();
        selectRef.current = null;
      }
    };
  }, []); // Mảng rỗng đảm bảo chỉ chạy một lần

  return (
    <div className="container-fluid">
      <div className="row">
        {/* main title */}
        <div className="col-12">
          <div className="main__title">
            <h2>Settings</h2>
          </div>
        </div>
        {/* end main title */}

        {/* content */}
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
                      <input id="username" type="text" name="username" className="sign__input" placeholder="User 123" defaultValue="John Doe" />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <label className="sign__label" htmlFor="email2">Email</label>
                      <input id="email2" type="text" name="email" className="sign__input" placeholder="email@email.com" defaultValue="admin@hotflix.com" />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <label className="sign__label" htmlFor="fname">Name</label>
                      <input id="fname" type="text" name="fname" className="sign__input" placeholder="John Doe" defaultValue="John" />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <label className="sign__label" htmlFor="sign__gallery-upload">Avatar</label>
                      <div className="sign__gallery">
                        <label id="gallery1" htmlFor="sign__gallery-upload">Upload (40x40)</label>
                        <input data-name="#gallery1" id="sign__gallery-upload" name="gallery" className="sign__gallery-upload" type="file" accept=".png, .jpg, .jpeg" />
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <button className="sign__btn sign__btn--small" type="button"><span>Save</span></button>
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
                  
                  {/* Trường select này không có trong HTML gốc của admin settings, nhưng tôi giữ lại từ trang profile, bạn có thể xóa nếu không cần */}
                  <div className="col-12 col-md-6 col-lg-12 col-xxl-6">
                    <div className="sign__group">
                      <label className="sign__label" htmlFor="select-settings">Select</label>
                      <select name="select" id="select-settings" className="sign__selectjs">
                        <option value="0">Option</option>
                        <option value="1">Option 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    <button className="sign__btn sign__btn--small" type="button"><span>Change</span></button>
                  </div>
                </div>
              </form>
            </div>
            {/* end password form */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingAdmin;
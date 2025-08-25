import React from 'react';

function PlanModal() {
  // Trong ứng dụng thực tế, bạn sẽ dùng useState để quản lý các giá trị của form này.
  return (
    <div className="modal fade" id="plan-modal" tabIndex="-1" aria-labelledby="plan-modal" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal__content">
            <button className="modal__close" type="button" data-bs-dismiss="modal" aria-label="Close"><i className="ti ti-x"></i></button>
            <form action="#" className="modal__form">
              <h4 className="modal__title">Select plan</h4>
              <div className="sign__group">
                <label htmlFor="fullname" className="sign__label">Name</label>
                <input id="fullname" type="text" name="name" className="sign__input" placeholder="Full name" />
              </div>
              <div className="sign__group">
                <label htmlFor="email" className="sign__label">Email</label>
                <input id="email" type="text" name="email" className="sign__input" placeholder="example@domain.com" />
              </div>
              <div className="sign__group">
                <label className="sign__label" htmlFor="value">Choose plan:</label>
                <select className="sign__select" name="value" id="value">
                  <option value="35">Premium - $34.99</option>
                  <option value="50">Cinematic - $49.99</option>
                </select>
                <span className="sign__text">You can spend money from your account...</span>
              </div>
              <div className="sign__group">
                <label className="sign__label">Payment method:</label>
                <ul className="sign__radio">
                  <li>
                    <input id="type1" type="radio" name="type" defaultChecked />
                    <label htmlFor="type1">Visa</label>
                  </li>
                  <li>
                    <input id="type2" type="radio" name="type" />
                    <label htmlFor="type2">Mastercard</label>
                  </li>
                  <li>
                    <input id="type3" type="radio" name="type" />
                    <label htmlFor="type3">Paypal</label>
                  </li>
                </ul>
              </div>
              <button type="button" className="sign__btn sign__btn--modal">
                <span>Proceed</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanModal;
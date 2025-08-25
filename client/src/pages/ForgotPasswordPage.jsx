import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const signBgRef = useRef(null);

  useEffect(() => {
    if (signBgRef.current && signBgRef.current.getAttribute('data-bg')) {
      const bgUrl = signBgRef.current.getAttribute('data-bg');
      signBgRef.current.style.background = `url(${bgUrl})`;
      signBgRef.current.style.backgroundPosition = 'center center';
      signBgRef.current.style.backgroundRepeat = 'no-repeat';
      signBgRef.current.style.backgroundSize = 'cover';
    }
  }, []);

  return (
    <div className="sign section--bg" data-bg="/img/bg/section__bg.jpg" ref={signBgRef}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sign__content">
              {/* forgot form */}
              <form action="#" className="sign__form">
                <Link to="/" className="sign__logo">
                  <img src="/img/logo.svg" alt="" />
                </Link>

                <div className="sign__group">
                  <input type="text" className="sign__input" placeholder="Email" />
                </div>

                <div className="sign__group sign__group--checkbox">
                  <input id="remember" name="remember" type="checkbox" defaultChecked />
                  <label htmlFor="remember">I agree to the <Link to="/privacy">Privacy Policy</Link></label>
                </div>

                <button className="sign__btn" type="button">Send</button>

                <span className="sign__text">We will send a password to your Email</span>
              </form>
              {/* end forgot form */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link

function RegisterPage() {
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
              {/* registration form */}
              <form action="#" className="sign__form">
                <Link to="/" className="sign__logo">
                  <img src="/img/logo.svg" alt="" />
                </Link>

                <div className="sign__group">
                  <input type="text" className="sign__input" placeholder="Name" />
                </div>

                <div className="sign__group">
                  <input type="text" className="sign__input" placeholder="Email" />
                </div>

                <div className="sign__group">
                  <input type="password" className="sign__input" placeholder="Password" />
                </div>

                <div className="sign__group sign__group--checkbox">
                  <input id="remember" name="remember" type="checkbox" defaultChecked />
                  <label htmlFor="remember">I agree to the <Link to="/privacy">Privacy Policy</Link></label>
                </div>

                <button className="sign__btn" type="button">Sign up</button>

                <span className="sign__delimiter">or</span>

                <div className="sign__social">
                  <a className="fb" href="#"><i className="ti ti-brand-facebook"></i>Sign up with</a>
                  <a className="tw" href="#"><i className="ti ti-brand-x"></i>Sign up with</a>
                  <a className="gl" href="#"><i className="ti ti-brand-google"></i>Sign up with</a>
                </div>

                <span className="sign__text">Already have an account? <Link to="/login">Sign in!</Link></span>
              </form>
              {/* end registration form */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
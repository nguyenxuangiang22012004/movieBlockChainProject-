import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; 

function LoginPage() {
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
              <form action="#" className="sign__form">
                <Link to="/" className="sign__logo">
                  <img src="/img/logo.svg" alt="" />
                </Link>

                <div className="sign__group">
                  <input type="text" className="sign__input" placeholder="Email" />
                </div>

                <div className="sign__group">
                  <input type="password" className="sign__input" placeholder="Password" />
                </div>

                <div className="sign__group sign__group--checkbox">
                  <input id="remember" name="remember" type="checkbox" defaultChecked />
                  <label htmlFor="remember">Remember Me</label>
                </div>

                <button className="sign__btn" type="button">Sign in</button>

                <span className="sign__delimiter">or</span>

                <div className="sign__social">
                  <a className="fb" href="#">Sign in with<i className="ti ti-brand-facebook"></i></a>
                  <a className="tw" href="#">Sign in with<i className="ti ti-brand-x"></i></a>
                  <a className="gl" href="#">Sign in with<i className="ti ti-brand-google"></i></a>
                </div>

                <span className="sign__text">Don't have an account? <Link to="/register">Sign up!</Link></span>
                <span className="sign__text"><Link to="/forgot">Forgot password?</Link></span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
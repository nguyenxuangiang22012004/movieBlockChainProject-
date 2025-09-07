import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/authService";

function LoginPage() {
  const signBgRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (signBgRef.current && signBgRef.current.getAttribute("data-bg")) {
      const bgUrl = signBgRef.current.getAttribute("data-bg");
      signBgRef.current.style.background = `url(${bgUrl})`;
      signBgRef.current.style.backgroundPosition = "center center";
      signBgRef.current.style.backgroundRepeat = "no-repeat";
      signBgRef.current.style.backgroundSize = "cover";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); 
      navigate("/admin/"); 
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div
      className="sign section--bg"
      data-bg="/img/bg/section__bg.jpg"
      ref={signBgRef}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sign__content">
              <form className="sign__form" onSubmit={handleSubmit}>
                <Link to="/" className="sign__logo">
                  <img src="/img/logo.svg" alt="" />
                </Link>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className="sign__group">
                  <input
                    type="text"
                    className="sign__input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="sign__group">
                  <input
                    type="password"
                    className="sign__input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="sign__group sign__group--checkbox">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    defaultChecked
                  />
                  <label htmlFor="remember">Remember Me</label>
                </div>

                <button className="sign__btn" type="submit">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

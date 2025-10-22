import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function LoginPage() {
  const signBgRef = useRef(null);
  const navigate = useNavigate();

  // State cho form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  // State cho loading và error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (signBgRef.current && signBgRef.current.getAttribute('data-bg')) {
      const bgUrl = signBgRef.current.getAttribute('data-bg');
      signBgRef.current.style.background = `url(${bgUrl})`;
      signBgRef.current.style.backgroundPosition = 'center center';
      signBgRef.current.style.backgroundRepeat = 'no-repeat';
      signBgRef.current.style.backgroundSize = 'cover';
    }
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Xóa lỗi khi user bắt đầu nhập
    if (error) setError('');
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      
      if (response.success) {
        // Đăng nhập thành công - chuyển về trang chủ
        navigate('/');
      }
    } catch (err) {
      // Hiển thị lỗi
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign section--bg" data-bg="/img/bg/section__bg.jpg" ref={signBgRef}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sign__content">
              <form onSubmit={handleSubmit} className="sign__form">
                <Link to="/" className="sign__logo">
                  <img src="/img/logo.svg" alt="" />
                </Link>

                {/* Hiển thị lỗi */}
                {error && (
                  <div className="sign__error" style={{
                    color: '#ff5151',
                    backgroundColor: 'rgba(255, 81, 81, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {error}
                  </div>
                )}

                <div className="sign__group">
                  <input 
                    type="email" 
                    className="sign__input" 
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="sign__group">
                  <input 
                    type="password" 
                    className="sign__input" 
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="sign__group sign__group--checkbox">
                  <input 
                    id="remember" 
                    name="remember" 
                    type="checkbox"
                    checked={formData.remember}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label htmlFor="remember">Remember Me</label>
                </div>

                <button 
                  className="sign__btn" 
                  type="submit"
                  disabled={loading}
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Đang đăng nhập...' : 'Sign in'}
                </button>

                <span className="sign__delimiter">or</span>

                <div className="sign__social">
                  <a className="fb" href="#" onClick={(e) => e.preventDefault()}>
                    Sign in with<i className="ti ti-brand-facebook"></i>
                  </a>
                  <a className="tw" href="#" onClick={(e) => e.preventDefault()}>
                    Sign in with<i className="ti ti-brand-x"></i>
                  </a>
                  <a className="gl" href="#" onClick={(e) => e.preventDefault()}>
                    Sign in with<i className="ti ti-brand-google"></i>
                  </a>
                </div>

                <span className="sign__text">
                  Don't have an account? <Link to="/register">Sign up!</Link>
                </span>
                <span className="sign__text">
                  <Link to="/forgot">Forgot password?</Link>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
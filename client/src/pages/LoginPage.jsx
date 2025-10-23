import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../services/authService';

function LoginPage() {
  const signBgRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State cho form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  // State cho loading và error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Set background
    if (signBgRef.current && signBgRef.current.getAttribute('data-bg')) {
      const bgUrl = signBgRef.current.getAttribute('data-bg');
      signBgRef.current.style.background = `url(${bgUrl})`;
      signBgRef.current.style.backgroundPosition = 'center center';
      signBgRef.current.style.backgroundRepeat = 'no-repeat';
      signBgRef.current.style.backgroundSize = 'cover';
    }

    // Kiểm tra verified param từ URL
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setSuccessMessage('Email đã được xác minh thành công! Bạn có thể đăng nhập.');
    }
  }, [searchParams]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Xóa lỗi khi user bắt đầu nhập
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  // Validate form
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không đúng định dạng');
      return false;
    }

    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    return true;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await login(formData.email, formData.password);

      if (response.success) {
        // Đăng nhập thành công
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
        
        // Chuyển về trang chủ sau 1 giây
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
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
                  <img src="/img/logo.svg" alt="Logo" />
                </Link>

                {/* Hiển thị thông báo thành công */}
                {successMessage && (
                  <div className="sign__message sign__message--success" style={{
                    color: '#00d451',
                    backgroundColor: 'rgba(0, 212, 81, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    textAlign: 'center',
                    border: '1px solid rgba(0, 212, 81, 0.2)'
                  }}>
                    {successMessage}
                  </div>
                )}

                {/* Hiển thị lỗi */}
                {error && (
                  <div className="sign__message sign__message--error" style={{
                    color: '#ff5151',
                    backgroundColor: 'rgba(255, 81, 81, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 81, 81, 0.2)'
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
                    autoComplete="email"
                  />
                </div>

                <div className="sign__group">
                  <input 
                    type="password" 
                    className="sign__input" 
                    placeholder="Mật khẩu"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="current-password"
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
                  <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                </div>

                <button 
                  className="sign__btn" 
                  type="submit"
                  disabled={loading}
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ marginRight: '8px' }}>⏳</span>
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>

                <span className="sign__delimiter">hoặc</span>

                <div className="sign__social">
                  <a 
                    className="fb" 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setError('Tính năng đang phát triển');
                    }}
                  >
                    Đăng nhập với <i className="ti ti-brand-facebook"></i>
                  </a>
                  <a 
                    className="tw" 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setError('Tính năng đang phát triển');
                    }}
                  >
                    Đăng nhập với <i className="ti ti-brand-x"></i>
                  </a>
                  <a 
                    className="gl" 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setError('Tính năng đang phát triển');
                    }}
                  >
                    Đăng nhập với <i className="ti ti-brand-google"></i>
                  </a>
                </div>

                <span className="sign__text">
                  Chưa có tài khoản? <Link to="/register">Đăng ký ngay!</Link>
                </span>
                <span className="sign__text">
                  <Link to="/forgot">Quên mật khẩu?</Link>
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
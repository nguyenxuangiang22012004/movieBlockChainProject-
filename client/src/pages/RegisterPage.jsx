import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

function RegisterPage() {
  const signBgRef = useRef(null);
  const navigate = useNavigate();

  // State cho form - chỉ giữ các trường cần thiết
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreePolicy: false
  });

  // State cho loading và error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Validate username
    if (!formData.username.trim()) {
      errors.username = 'Username là bắt buộc';
    } else if (formData.username.length < 3) {
      errors.username = 'Username phải có ít nhất 3 ký tự';
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password là bắt buộc';
    } else if (formData.password.length < 6) {
      errors.password = 'Password phải có ít nhất 6 ký tự';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Validate policy agreement
    if (!formData.agreePolicy) {
      errors.agreePolicy = 'Bạn phải đồng ý với chính sách bảo mật';
    }

    return errors;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});
    setSuccessMessage('');

    try {
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await register(userData);

      if (response) {
        // ✅ Không navigate nữa
        setSuccessMessage('🎉 Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreePolicy: false
        });
      } else {
        setError(response?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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

                {/* Hiển thị lỗi chung */}
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

                {successMessage && (
                  <div className="sign__success" style={{
                    color: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {successMessage}
                  </div>
                )}

                <div className="sign__group">
                  <input
                    type="text"
                    className={`sign__input ${fieldErrors.username ? 'error' : ''}`}
                    placeholder="Username *"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {fieldErrors.username && (
                    <span style={{ color: '#ff5151', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                      {fieldErrors.username}
                    </span>
                  )}
                </div>

                <div className="sign__group">
                  <input
                    type="email"
                    className={`sign__input ${fieldErrors.email ? 'error' : ''}`}
                    placeholder="Email *"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {fieldErrors.email && (
                    <span style={{ color: '#ff5151', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                      {fieldErrors.email}
                    </span>
                  )}
                </div>

                <div className="sign__group">
                  <input
                    type="password"
                    className={`sign__input ${fieldErrors.password ? 'error' : ''}`}
                    placeholder="Password *"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {fieldErrors.password && (
                    <span style={{ color: '#ff5151', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                      {fieldErrors.password}
                    </span>
                  )}
                </div>

                <div className="sign__group">
                  <input
                    type="password"
                    className={`sign__input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm Password *"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {fieldErrors.confirmPassword && (
                    <span style={{ color: '#ff5151', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                      {fieldErrors.confirmPassword}
                    </span>
                  )}
                </div>

                <div className="sign__group sign__group--checkbox">
                  <input
                    id="agreePolicy"
                    name="agreePolicy"
                    type="checkbox"
                    checked={formData.agreePolicy}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label htmlFor="agreePolicy">
                    I agree to the <Link to="/privacy">Privacy Policy</Link>
                  </label>
                  {fieldErrors.agreePolicy && (
                    <span style={{ color: '#ff5151', fontSize: '12px', marginTop: '5px', display: 'block', marginLeft: '28px' }}>
                      {fieldErrors.agreePolicy}
                    </span>
                  )}
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
                  {loading ? 'Đang đăng ký...' : 'Sign up'}
                </button>

                <span className="sign__text">
                  Already have an account? <Link to="/login">Sign in!</Link>
                </span>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
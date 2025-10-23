import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/authService';

function ResetPasswordPage() {
  const signBgRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Kiểm tra token
    if (!token) {
      setMessage({ 
        type: 'error', 
        text: 'Link đặt lại mật khẩu không hợp lệ' 
      });
    }

    // Set background
    if (signBgRef.current && signBgRef.current.getAttribute('data-bg')) {
      const bgUrl = signBgRef.current.getAttribute('data-bg');
      signBgRef.current.style.background = `url(${bgUrl})`;
      signBgRef.current.style.backgroundPosition = 'center center';
      signBgRef.current.style.backgroundRepeat = 'no-repeat';
      signBgRef.current.style.backgroundSize = 'cover';
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    if (!token) {
      setMessage({ type: 'error', text: 'Token không hợp lệ' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await resetPassword(token, formData.newPassword);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Đặt lại mật khẩu thành công! Đang chuyển hướng...' 
        });
        
        // Redirect sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
      });
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

                <h3 style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
                  Đặt lại mật khẩu
                </h3>

                {/* Message display */}
                {message.text && (
                  <div 
                    className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                    style={{
                      padding: '10px 15px',
                      marginBottom: '20px',
                      borderRadius: '6px',
                      backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                      color: message.type === 'success' ? '#155724' : '#721c24',
                      border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                    }}
                  >
                    {message.text}
                  </div>
                )}

                <div className="sign__group">
                  <input 
                    type="password" 
                    className="sign__input" 
                    placeholder="Mật khẩu mới" 
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={loading || !token}
                    required
                  />
                </div>

                <div className="sign__group">
                  <input 
                    type="password" 
                    className="sign__input" 
                    placeholder="Xác nhận mật khẩu mới" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading || !token}
                    required
                  />
                </div>

                <button 
                  className="sign__btn" 
                  type="submit"
                  disabled={loading || !token}
                >
                  {loading ? 'Đang xử lý...' : 'Reset Password'}
                </button>

                <span className="sign__text">
                  <Link to="/login">Back to Sign In</Link>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
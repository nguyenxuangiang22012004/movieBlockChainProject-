import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { GENRES } from "../constants/genres";
import { ethers } from 'ethers';

function Header() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [user, setUser] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletError, setWalletError] = useState('');
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
  };

  useEffect(() => {
    const closeMenu = () => setIsNavActive(false);
    if (isNavActive) {
      document.body.addEventListener('click', closeMenu);
    }
    return () => {
      document.body.removeEventListener('click', closeMenu);
    }
  }, [isNavActive]);

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Đồng bộ walletAddress từ user object vào localStorage
      if (parsedUser.walletAddress && parsedUser.walletAddress !== '') {
        localStorage.setItem('walletAddress', parsedUser.walletAddress);
      }
    }
  }, []);

  // Hàm lấy số dư ETH
  const fetchEthBalance = async () => {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    
    if (!storedWalletAddress) {
      setEthBalance(null);
      return;
    }

    try {
      setIsLoadingBalance(true);
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const balance = await provider.getBalance(storedWalletAddress);
      const balanceInEth = ethers.formatEther(balance);
      setEthBalance(parseFloat(balanceInEth).toFixed(4));
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      setEthBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Lấy số dư khi component mount và khi user thay đổi
  useEffect(() => {
    if (user) {
      fetchEthBalance();
      
      // Cập nhật số dư mỗi 10 giây
      const interval = setInterval(fetchEthBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Lắng nghe sự kiện cập nhật số dư từ các component khác
  useEffect(() => {
    const handleBalanceUpdate = () => {
      fetchEthBalance();
    };

    window.addEventListener('updateEthBalance', handleBalanceUpdate);
    return () => {
      window.removeEventListener('updateEthBalance', handleBalanceUpdate);
    };
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
      setUser(null);
      setEthBalance(null);
      navigate('/login');
    }
  };

  const handleWalletClick = () => {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (!storedWalletAddress || storedWalletAddress === '') {
      setShowWalletModal(true);
    } else {
      // Nếu đã có ví, có thể hiển thị thông tin hoặc cho phép thay đổi
      const confirmChange = window.confirm(
        `Địa chỉ ví hiện tại: ${storedWalletAddress}\n\nBạn có muốn thay đổi địa chỉ ví không?`
      );
      if (confirmChange) {
        setWalletAddress(storedWalletAddress);
        setShowWalletModal(true);
      }
    }
  };

  // Validate địa chỉ Ethereum
  const isValidEthAddress = (address) => {
    return ethers.isAddress(address);
  };

  // Xử lý submit địa chỉ ví
  const handleWalletSubmit = async (e) => {
    e.preventDefault();
    setWalletError('');

    if (!walletAddress.trim()) {
      setWalletError('Vui lòng nhập địa chỉ ví');
      return;
    }

    if (!isValidEthAddress(walletAddress)) {
      setWalletError('Địa chỉ ví không hợp lệ');
      return;
    }

    try {
      // Kiểm tra kết nối với node
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const balance = await provider.getBalance(walletAddress);
      
      // Lưu vào localStorage
      localStorage.setItem('walletAddress', walletAddress);
      
      // Cập nhật user object trong localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      userData.walletAddress = walletAddress;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Gọi API để cập nhật walletAddress trên server
      try {
        await updateUserWallet(userData.id, walletAddress);
        console.log('✅ Wallet address updated on server');
      } catch (apiError) {
        console.warn('⚠️ Failed to update wallet on server:', apiError);
        // Vẫn cho phép tiếp tục nếu API fail
      }

      // Đóng modal và reset form
      setShowWalletModal(false);
      setWalletAddress('');
      
      // Cập nhật số dư
      fetchEthBalance();
      
      alert('Cập nhật địa chỉ ví thành công!');
    } catch (error) {
      console.error('Error verifying wallet:', error);
      setWalletError('Không thể kết nối với node hoặc địa chỉ không tồn tại');
    }
  };

  // Lấy danh sách địa chỉ từ Hardhat
  const handleGetHardhatAddress = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        // ✅ Luôn dùng account#0 (giống như khi deploy contract)
        const account0 = accounts[0].address;
        setWalletAddress(account0);
        setWalletError('');
        
        // Hiển thị thông tin
        console.log('✅ Using Hardhat Account#0:', account0);
        const balance = await provider.getBalance(account0);
        console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');
      } else {
        setWalletError('Không tìm thấy tài khoản Hardhat');
      }
    } catch (error) {
      console.error('Error getting Hardhat accounts:', error);
      setWalletError('Không thể kết nối với Hardhat node. Đảm bảo Hardhat đang chạy (npx hardhat node)');
    }
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header__content">
                <Link to="/" className="header__logo">
                  <img src="/img/logo.svg" alt="" />
                </Link>
                
                {/* header nav */}
                <ul className={`header__nav ${isNavActive ? 'header__nav--active' : ''}`}>
                  <li className="header__nav-item">
                    <Link to="/catalog?type=movie" className="header__nav-link">
                      Movie
                    </Link>
                  </li>

                  <li className="header__nav-item">
                    <Link to="/catalog?type=tvseries" className="header__nav-link">
                      TV Series
                    </Link>
                  </li>
                  
                  {/* dropdown */}
                  <li className="header__nav-item">
                    <a className="header__nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Genre <i className="ti ti-chevron-down"></i>
                    </a>
                    <ul className="dropdown-menu header__dropdown-menu">
                      {GENRES.map((genre) => (
                        <li key={genre}>
                          <Link to={`/catalog?genre=${genre.toLowerCase()}`}>{genre}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* end dropdown */}

                  <li className="header__nav-item">
                    <Link to="/pricing" className="header__nav-link">Pricing plan</Link>
                  </li>

                  {/* dropdown */}
                  <li className="header__nav-item">
                    <a className="header__nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Pages <i className="ti ti-chevron-down"></i>
                    </a>
                    <ul className="dropdown-menu header__dropdown-menu">
                      <li><Link to="/about">About Us</Link></li>
                      <li><Link to="/profile">Profile</Link></li>
                      <li><Link to="/actor">Actor</Link></li>
                      <li><Link to="/contacts">Contacts</Link></li>
                      <li><Link to="/faq">Help center</Link></li>
                      <li><Link to="/privacy">Privacy policy</Link></li>
                    </ul>
                  </li>
                  {/* end dropdown */}
                </ul>
                {/* end header nav */}

                {/* header auth */}
                <div className="header__auth">
                  <form action="#" className={`header__search ${isSearchActive ? 'header__search--active' : ''}`}>
                    <input className="header__search-input" type="text" placeholder="Search..." />
                    <button className="header__search-button" type="button">
                      <i className="ti ti-search"></i>
                    </button>
                    <button className="header__search-close" type="button" onClick={toggleSearch}>
                      <i className="ti ti-x"></i>
                    </button>
                  </form>

                  <button className="header__search-btn" type="button" onClick={toggleSearch}>
                    <i className="ti ti-search"></i>
                  </button>

                  {/* ETH Balance Display */}
                  {user && (
                    <div 
                      className="header__wallet" 
                      onClick={handleWalletClick}
                      style={{ 
                        cursor: 'pointer',
                        marginRight: '15px',
                        padding: '8px 15px',
                        background: ethBalance ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 193, 7, 0.15)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        border: ethBalance ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 193, 7, 0.3)'
                      }}
                      title={ethBalance ? `ETH Balance - Click to change wallet` : 'Click to add wallet address'}
                    >
                      <i className="ti ti-wallet" style={{ 
                        fontSize: '18px',
                        color: ethBalance ? '#22c55e' : '#ffc107'
                      }}></i>
                      {isLoadingBalance ? (
                        <span style={{ fontSize: '14px', color: '#fff' }}>...</span>
                      ) : ethBalance !== null ? (
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                          {ethBalance} ETH
                        </span>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#ffc107', fontWeight: '500' }}>
                          Add Wallet
                        </span>
                      )}
                    </div>
                  )}

                  {/* dropdown */}
                  {user ? (
                    <div className="header__profile">
                      <a className="header__sign-in header__sign-in--user" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="ti ti-user"></i>
                        <span>{user.username || user.email}</span>
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                        <li><Link to="/profile"><i className="ti ti-ghost"></i>Profile</Link></li>
                        <li><Link to="/profile"><i className="ti ti-stereo-glasses"></i>Subscription</Link></li>
                        <li><Link to="/profile"><i className="ti ti-bookmark"></i>Favorites</Link></li>
                        <li><Link to="/profile"><i className="ti ti-settings"></i>Settings</Link></li>
                        <li>
                          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                            <i className="ti ti-logout"></i>Logout
                          </a>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <Link to="/login" className="header__sign-in">
                      <i className="ti ti-login"></i>
                      <span>Sign In</span>
                    </Link>
                  )}
                  {/* end dropdown */}
                </div>
                {/* end header auth */}

                {/* header menu btn */}
                <button className={`header__btn ${isNavActive ? 'header__btn--active' : ''}`} type="button" onClick={(e) => { e.stopPropagation(); toggleNav(); }}>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
                {/* end header menu btn */}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>Thêm Địa Chỉ Ví ETH</h3>
              <button 
                onClick={() => {
                  setShowWalletModal(false);
                  setWalletAddress('');
                  setWalletError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleWalletSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#fff', display: 'block', marginBottom: '8px' }}>
                  Địa chỉ ví Ethereum
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    setWalletError('');
                  }}
                  placeholder="0x..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
                {walletError && (
                  <p style={{ color: '#ff5555', fontSize: '13px', marginTop: '8px', marginBottom: 0 }}>
                    {walletError}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={handleGetHardhatAddress}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#444',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <i className="ti ti-refresh" style={{ marginRight: '8px' }}></i>
                  Lấy địa chỉ từ Hardhat
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowWalletModal(false);
                    setWalletAddress('');
                    setWalletError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#333',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#ff5555',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
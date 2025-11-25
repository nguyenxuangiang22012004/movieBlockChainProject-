import React, { useState, useEffect } from 'react';
import { getAllTransactions, checkAdminBalance } from '../services/paymentService';
import api from '../config/axios';
import '../../public/css/AdminTransactions.css';

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminBalance, setAdminBalance] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    uniqueUsers: 0,
    averageTransaction: 0
  });
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Lấy số dư admin (Account #1)
      const balanceInfo = await checkAdminBalance();
      setAdminBalance(balanceInfo.balance);

      // Lấy số dư user (Account #0) để so sánh
      try {
        const userBalanceInfo = await api.get('/transactions/stats/user-balance');
        setUserBalance(userBalanceInfo.data.balance);
      } catch (err) {
        console.log('Could not fetch user balance');
      }

      // Lấy danh sách giao dịch
      const response = await getAllTransactions();
      console.log(response);
      if (response.success) {
        setTransactions(response.transactions);
      }

      // Lấy thống kê
      const statsResponse = await api.get('/transactions/stats/revenue');
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Không thể tải dữ liệu giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 10)}...${address.substring(38)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã copy vào clipboard!');
  };

  const getFilteredTransactions = () => {
    if (filter === 'all') return transactions;

    const now = new Date();
    return transactions.filter(tx => {
      const txDate = new Date(tx.createdAt);
      
      if (filter === 'today') {
        return txDate.toDateString() === now.toDateString();
      } else if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= weekAgo;
      } else if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return txDate >= monthAgo;
      }
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  if (loading) {
    return (
      <div className="admin-transactions">
        <div className="loading">
          <i className="ti ti-loader"></i>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-transactions">
      <div className="admin-header">
        <div className="admin-title">
          <i className="ti ti-wallet"></i>
          <div>
            <h1>Quản Lý Giao Dịch</h1>
            <p>Theo dõi doanh thu và lịch sử thanh toán</p>
          </div>
        </div>
        <button onClick={fetchData} className="refresh-btn">
          <i className="ti ti-refresh"></i>
          Refresh
        </button>
      </div>

      {/* Balance Cards */}
      <div className="balance-section">
        <div className="balance-card balance-card--admin">
          <div className="balance-header">
            <i className="ti ti-building-bank"></i>
            <span className="balance-label">Admin Wallet</span>
          </div>
          <div className="balance-amount">
            {adminBalance ? `${adminBalance.toFixed(4)} ETH` : 'Loading...'}
          </div>
          <div className="balance-address">
            <code onClick={() => copyToClipboard('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')}>
              0x7099...dc79C8
            </code>
            <span className="account-badge">Account #1</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card--blue">
          <div className="stat-icon">
            <i className="ti ti-coin"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalRevenue || '0.0000'} ETH</h3>
            <p>Tổng Doanh Thu</p>
            <small>Từ tất cả giao dịch</small>
          </div>
        </div>

        <div className="stat-card stat-card--orange">
          <div className="stat-icon">
            <i className="ti ti-receipt"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalTransactions || 0}</h3>
            <p>Tổng Giao Dịch</p>
            <small>Giao dịch thành công</small>
          </div>
        </div>

        <div className="stat-card stat-card--purple">
          <div className="stat-icon">
            <i className="ti ti-users"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.uniqueUsers || 0}</h3>
            <p>Người Dùng</p>
            <small>Đã mua gói</small>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon">
            <i className="ti ti-chart-line"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.averageTransaction || '0.0000'} ETH</h3>
            <p>Trung Bình</p>
            <small>Mỗi giao dịch</small>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table-container">
        <div className="table-header">
          <h2>Lịch Sử Giao Dịch</h2>
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              Tất cả
            </button>
            <button 
              className={filter === 'today' ? 'active' : ''} 
              onClick={() => setFilter('today')}
            >
              Hôm nay
            </button>
            <button 
              className={filter === 'week' ? 'active' : ''} 
              onClick={() => setFilter('week')}
            >
              7 ngày
            </button>
            <button 
              className={filter === 'month' ? 'active' : ''} 
              onClick={() => setFilter('month')}
            >
              30 ngày
            </button>
          </div>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <i className="ti ti-folder-off"></i>
            <p>Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Thời gian</th>
                  <th>User</th>
                  <th>Gói</th>
                  <th>Số tiền</th>
                  <th>From (User)</th>
                  <th>To (Admin)</th>
                  <th>Transaction Hash</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <tr key={tx._id || tx.id}>
                    <td>{index + 1}</td>
                    <td className="tx-date">{formatDate(tx.createdAt)}</td>
                    <td>
                      <div className="user-info">
                        <strong>{tx.userId?.username || 'Unknown'}</strong>
                        <small>{tx.userId?.email || 'N/A'}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`plan-badge plan-badge--${tx.planName?.toLowerCase()}`}>
                        {tx.planName || 'N/A'}
                      </span>
                    </td>
                    <td className="amount">
                      <strong>+{parseFloat(tx.amount).toFixed(4)} ETH</strong>
                    </td>
                    <td>
                      <code 
                        className="address-code user-address"
                        onClick={() => copyToClipboard(tx.fromAddress)}
                        title="Click to copy"
                      >
                        {formatAddress(tx.fromAddress)}
                      </code>
                    </td>
                    <td>
                      <code 
                        className="address-code admin-address"
                        onClick={() => copyToClipboard(tx.toAddress)}
                        title="Click to copy"
                      >
                        {formatAddress(tx.toAddress)}
                      </code>
                    </td>
                    <td>
                      <code 
                        className="address-code tx-hash"
                        onClick={() => copyToClipboard(tx.transactionHash)}
                        title="Click to copy"
                      >
                        {formatAddress(tx.transactionHash)}
                      </code>
                      {tx.contractTransactionHash && (
                        <small className="contract-hash">
                          Contract: {formatAddress(tx.contractTransactionHash)}
                        </small>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredTransactions.length > 0 && (
          <div className="table-footer">
            <p>Hiển thị {filteredTransactions.length} / {transactions.length} giao dịch</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTransactions;
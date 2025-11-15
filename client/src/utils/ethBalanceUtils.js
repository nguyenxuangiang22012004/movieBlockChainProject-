// utils/ethBalanceUtils.js

/**
 * Trigger cập nhật số dư ETH trong Header
 * Gọi hàm này sau khi thực hiện giao dịch để cập nhật realtime
 */
export const triggerBalanceUpdate = () => {
  const event = new Event('updateEthBalance');
  window.dispatchEvent(event);
};

/**
 * Lưu địa chỉ ví vào localStorage
 * @param {string} walletAddress - Địa chỉ ví Ethereum
 */
export const saveWalletAddress = (walletAddress) => {
  if (walletAddress && walletAddress.startsWith('0x')) {
    localStorage.setItem('walletAddress', walletAddress);
    triggerBalanceUpdate();
  } else {
    throw new Error('Invalid wallet address');
  }
};

/**
 * Lấy địa chỉ ví từ localStorage
 * @returns {string|null} Địa chỉ ví hoặc null
 */
export const getWalletAddress = () => {
  return localStorage.getItem('walletAddress');
};

/**
 * Xóa địa chỉ ví khỏi localStorage
 */
export const removeWalletAddress = () => {
  localStorage.removeItem('walletAddress');
  triggerBalanceUpdate();
};

/**
 * Kiểm tra xem user đã có ví chưa
 * @returns {boolean}
 */
export const hasWallet = () => {
  const address = getWalletAddress();
  return address !== null && address.startsWith('0x');
};
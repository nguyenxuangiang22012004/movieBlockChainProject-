import { ethers } from 'ethers';
import api from '../config/axios.js';

// Hardhat local accounts
const HARDHAT_ACCOUNTS = {
  USER: {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  },
  ADMIN: {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
  }
};

const RPC_URL = 'http://127.0.0.1:8545';

export const checkUserBalance = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const balance = await provider.getBalance(HARDHAT_ACCOUNTS.USER.address);
    const balanceInEth = parseFloat(ethers.formatEther(balance));
    
    return {
      success: true,
      address: HARDHAT_ACCOUNTS.USER.address,
      balance: balanceInEth,
      balanceFormatted: balanceInEth.toFixed(4)
    };
  } catch (error) {
    console.error('❌ Error checking balance:', error);
    throw error;
  }
};

/**
 * Kiểm tra số dư của admin (Account #1)
 */
export const checkAdminBalance = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const balance = await provider.getBalance(HARDHAT_ACCOUNTS.ADMIN.address);
    const balanceInEth = parseFloat(ethers.formatEther(balance));
    
    return {
      success: true,
      address: HARDHAT_ACCOUNTS.ADMIN.address,
      balance: balanceInEth,
      balanceFormatted: balanceInEth.toFixed(4)
    };
  } catch (error) {
    console.error('❌ Error checking admin balance:', error);
    throw error;
  }
};

/**
 * Chuyển tiền từ user (Account #0) sang admin (Account #1)
 * Đây là giao dịch thanh toán cho gói subscription
 */
export const sendPaymentToAdmin = async (amountInEth, planName) => {
  try {
    console.log('💰 Starting payment to admin...');
    console.log(`📦 Plan: ${planName}`);
    console.log(`💵 Amount: ${amountInEth} ETH`);
    
    // Kết nối với Hardhat node
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Tạo wallet từ private key của user (Account #0)
    const userWallet = new ethers.Wallet(HARDHAT_ACCOUNTS.USER.privateKey, provider);
    
    console.log(`👤 From (User): ${userWallet.address}`);
    console.log(`👨‍💼 To (Admin): ${HARDHAT_ACCOUNTS.ADMIN.address}`);
    
    // Kiểm tra số dư user trước khi chuyển
    const userBalance = await provider.getBalance(userWallet.address);
    const userBalanceInEth = parseFloat(ethers.formatEther(userBalance));
    console.log(`💰 User balance: ${userBalanceInEth.toFixed(4)} ETH`);
    
    // Kiểm tra số dư admin trước khi nhận
    const adminBalanceBefore = await provider.getBalance(HARDHAT_ACCOUNTS.ADMIN.address);
    const adminBalanceBeforeInEth = parseFloat(ethers.formatEther(adminBalanceBefore));
    console.log(`💰 Admin balance before: ${adminBalanceBeforeInEth.toFixed(4)} ETH`);
    
    if (userBalanceInEth < amountInEth) {
      throw new Error(
        `Số dư không đủ!\n` +
        `Cần: ${amountInEth} ETH\n` +
        `Hiện có: ${userBalanceInEth.toFixed(4)} ETH`
      );
    }
    
    // Chuyển đổi số tiền sang Wei
    const amountInWei = ethers.parseEther(amountInEth.toString());
    
    // Tạo và gửi transaction
    console.log('📤 Sending payment transaction...');
    const tx = await userWallet.sendTransaction({
      to: HARDHAT_ACCOUNTS.ADMIN.address,
      value: amountInWei
    });
    
    console.log(`📝 Transaction hash: ${tx.hash}`);
    console.log('⏳ Waiting for confirmation...');
    
    // Đợi transaction được confirm
    const receipt = await tx.wait();
    
    console.log('✅ Payment transaction confirmed!');
    console.log(`📦 Block number: ${receipt.blockNumber}`);
    console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
    
    // Lấy số dư mới sau giao dịch
    const newUserBalance = await provider.getBalance(userWallet.address);
    const newUserBalanceInEth = parseFloat(ethers.formatEther(newUserBalance));
    
    const newAdminBalance = await provider.getBalance(HARDHAT_ACCOUNTS.ADMIN.address);
    const newAdminBalanceInEth = parseFloat(ethers.formatEther(newAdminBalance));
    
    console.log(`💰 User balance after: ${newUserBalanceInEth.toFixed(4)} ETH`);
    console.log(`💰 Admin balance after: ${newAdminBalanceInEth.toFixed(4)} ETH`);
    console.log(`📈 Admin received: ${(newAdminBalanceInEth - adminBalanceBeforeInEth).toFixed(4)} ETH`);
    
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      from: userWallet.address,
      to: HARDHAT_ACCOUNTS.ADMIN.address,
      amount: amountInEth,
      gasUsed: receipt.gasUsed.toString(),
      userBalanceBefore: userBalanceInEth.toFixed(4),
      userBalanceAfter: newUserBalanceInEth.toFixed(4),
      adminBalanceBefore: adminBalanceBeforeInEth.toFixed(4),
      adminBalanceAfter: newAdminBalanceInEth.toFixed(4),
      adminReceived: (newAdminBalanceInEth - adminBalanceBeforeInEth).toFixed(4)
    };
    
  } catch (error) {
    console.error('❌ Payment error:', error);
    throw error;
  }
};

/**
 * Lưu thông tin giao dịch thanh toán vào database (MongoDB)
 */
export const savePaymentTransaction = async (paymentData) => {
  try {
    const response = await api.post('/transactions', {
      transactionHash: paymentData.transactionHash,
      fromAddress: paymentData.from,
      toAddress: paymentData.to,
      amount: paymentData.amount,
      planName: paymentData.planName,
      status: 'completed',
      blockNumber: paymentData.blockNumber,
      gasUsed: paymentData.gasUsed,
      contractTransactionHash: paymentData.contractTransactionHash
    });
    
    return response.data;
  } catch (error) {
    console.error('⚠️ Error saving transaction to database:', error);
    // Không throw error vì giao dịch blockchain đã thành công
    return null;
  }
};

/**
 * Lấy lịch sử giao dịch của user hiện tại
 */
export const getUserTransactions = async () => {
  try {
    const response = await api.get('/transactions/user');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Lấy tất cả giao dịch (dành cho admin)
 */
export const getAllTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching all transactions:', error);
    throw error;
  }
};

/**
 * Kiểm tra xem có đủ số dư để mua gói hay không
 */
export const canAffordPlan = async (priceInEth) => {
  try {
    const balanceInfo = await checkUserBalance();
    return {
      canAfford: balanceInfo.balance >= priceInEth,
      currentBalance: balanceInfo.balance,
      required: priceInEth,
      shortfall: Math.max(0, priceInEth - balanceInfo.balance)
    };
  } catch (error) {
    console.error('❌ Error checking affordability:', error);
    throw error;
  }
};

export default {
  checkUserBalance,
  checkAdminBalance,
  sendPaymentToAdmin,
  savePaymentTransaction,
  getUserTransactions,
  getAllTransactions,
  canAffordPlan,
  HARDHAT_ACCOUNTS
};
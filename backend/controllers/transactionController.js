// controllers/transactionController.js
import Transaction from '../models/Transaction.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';
/**
 * Lưu thông tin giao dịch thanh toán
 * POST /api/transactions
 */
export const createTransaction = async (req, res) => {
  try {
    const {
      transactionHash,
      fromAddress,
      toAddress,
      amount,
      planName,
      status,
      blockNumber,
      gasUsed,
      contractTransactionHash,
      metadata
    } = req.body;

    // Lấy userId từ req (từ auth middleware)
    const userId = req.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User ID not found'
      });
    }

    // Kiểm tra xem transaction hash đã tồn tại chưa
    const existingTx = await Transaction.findOne({ transactionHash });
    if (existingTx) {
      return res.status(400).json({
        success: false,
        message: 'Transaction already exists'
      });
    }

    // Tạo transaction mới
    const transaction = new Transaction({
      userId,
      transactionHash,
      fromAddress,
      toAddress,
      amount,
      planName,
      status: status || 'completed',
      blockNumber,
      gasUsed,
      contractTransactionHash,
      metadata
    });

    await transaction.save();

    console.log('✅ Transaction saved:', transaction._id);

    res.status(201).json({
      success: true,
      message: 'Transaction saved successfully',
      transaction
    });

  } catch (error) {
    console.error('❌ Error saving transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save transaction',
      error: error.message
    });
  }
};

/**
 * Lấy lịch sử giao dịch của user hiện tại
 * GET /api/transactions/user
 */
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      transactions,
      total: transactions.length
    });

  } catch (error) {
    console.error('❌ Error fetching user transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

/**
 * Lấy tất cả giao dịch (cho admin)
 * GET /api/transactions
 */
export const getAllTransactions = async (req, res) => {
  try {
    const { limit = 100, page = 1, status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('❌ Error fetching all transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

/**
 * Lấy thông tin chi tiết một giao dịch
 * GET /api/transactions/:transactionHash
 */
export const getTransactionByHash = async (req, res) => {
  try {
    const { transactionHash } = req.params;

    const transaction = await Transaction.findOne({ transactionHash })
      .populate('userId', 'username email walletAddress')
      .lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      transaction
    });

  } catch (error) {
    console.error('❌ Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};

/**
 * Lấy tổng doanh thu (cho admin dashboard)
 * GET /api/transactions/stats/revenue
 */
export const getRevenueStats = async (req, res) => {
  try {
    const stats = await Transaction.getTotalRevenue();

    res.json({
      success: true,
      stats: {
        totalRevenue: stats.totalRevenue.toFixed(4),
        totalTransactions: stats.totalTransactions,
        uniqueUsers: stats.uniqueUsers,
        averageTransaction: stats.totalTransactions > 0 
          ? (stats.totalRevenue / stats.totalTransactions).toFixed(4)
          : 0
      }
    });

  } catch (error) {
    console.error('❌ Error fetching revenue stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};

/**
 * Lấy thống kê giao dịch theo ngày
 * GET /api/transactions/stats/daily
 */
export const getDailyStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const dailyStats = await Transaction.getDailyStats(parseInt(days));

    res.json({
      success: true,
      dailyStats
    });

  } catch (error) {
    console.error('❌ Error fetching daily stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily stats',
      error: error.message
    });
  }
};

/**
 * Lấy giao dịch theo plan
 * GET /api/transactions/stats/by-plan
 */
export const getStatsByPlan = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$planName',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$amount' }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]);

    res.json({
      success: true,
      stats: stats.map(item => ({
        planName: item._id,
        count: item.count,
        totalRevenue: item.totalRevenue.toFixed(4)
      }))
    });

  } catch (error) {
    console.error('❌ Error fetching plan stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plan stats',
      error: error.message
    });
  }
};

/**
 * Lấy số dư của user (nếu cần)
 * GET /api/transactions/stats/user-balance
 */
export const getUserBalance = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Chuyển userId thành ObjectId đúng cách
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Tính tổng số tiền đã chi tiêu
    const result = await Transaction.aggregate([
      { 
        $match: { 
          userId: userObjectId,  // ← Sử dụng với 'new'
          status: 'completed' 
        } 
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    const balance = result.length > 0 ? result[0] : { totalSpent: 0, transactionCount: 0 };

    res.json({
      success: true,
      balance: {
        totalSpent: balance.totalSpent.toFixed(4),
        transactionCount: balance.transactionCount
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch balance',
      error: error.message
    });
  }
};
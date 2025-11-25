// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Thông tin giao dịch thanh toán (user -> admin)
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  fromAddress: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  
  toAddress: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Thông tin gói đăng ký
  planName: {
    type: String,
    enum: ['Basic', 'Premium', 'Cinematic'],
    required: true
  },
  
  // Thông tin blockchain
  blockNumber: {
    type: Number,
    required: true
  },
  
  gasUsed: {
    type: String
  },
  
  // Transaction hash từ smart contract (nếu có)
  contractTransactionHash: {
    type: String,
    index: true
  },
  
  // Trạng thái
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
    index: true
  },
  
  // Metadata
  metadata: {
    userBalanceBefore: String,
    userBalanceAfter: String,
    adminBalanceBefore: String,
    adminBalanceAfter: String,
    adminReceived: String
  }
  
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Index cho tìm kiếm
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });

// Virtual để format số tiền
transactionSchema.virtual('amountFormatted').get(function() {
  return this.amount.toFixed(4) + ' ETH';
});

// Method để lấy thông tin ngắn gọn
transactionSchema.methods.getShortInfo = function() {
  return {
    id: this._id,
    transactionHash: this.transactionHash.substring(0, 10) + '...',
    amount: this.amountFormatted,
    planName: this.planName,
    status: this.status,
    createdAt: this.createdAt
  };
};

// Static method để lấy tổng doanh thu
transactionSchema.statics.getTotalRevenue = async function() {
  const result = await this.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    }
  ]);
  
  if (result.length === 0) {
    return {
      totalRevenue: 0,
      totalTransactions: 0,
      uniqueUsers: 0
    };
  }
  
  return {
    totalRevenue: result[0].totalRevenue,
    totalTransactions: result[0].totalTransactions,
    uniqueUsers: result[0].uniqueUsers.length
  };
};

// Static method để lấy thống kê theo ngày
transactionSchema.statics.getDailyStats = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const result = await this.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        transactionCount: { $sum: 1 },
        dailyRevenue: { $sum: '$amount' }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);
  
  return result.map(item => ({
    date: item._id,
    transactionCount: item.transactionCount,
    dailyRevenue: item.dailyRevenue
  }));
};

// Middleware trước khi save
transactionSchema.pre('save', function(next) {
  // Chuyển địa chỉ về lowercase
  if (this.fromAddress) {
    this.fromAddress = this.fromAddress.toLowerCase();
  }
  if (this.toAddress) {
    this.toAddress = this.toAddress.toLowerCase();
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
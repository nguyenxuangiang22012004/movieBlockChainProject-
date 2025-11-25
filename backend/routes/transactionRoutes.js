// routes/transactionRoutes.js
import express from "express";
import * as transactionController from "../controllers/transactionController.js";

const router = express.Router();

// ============================================
// ROUTES CHO USER
// ============================================

/**
 * Tạo transaction mới (khi user mua gói)
 * POST /api/transactions
 */
router.post("/", transactionController.createTransaction);

/**
 * Lấy lịch sử giao dịch của user hiện tại
 * GET /api/transactions/user
 */
router.get("/user", transactionController.getUserTransactions);

// ============================================
// ROUTES CHO ADMIN (Statistics)
// ============================================

/**
 * Lấy tổng doanh thu
 * GET /api/transactions/stats/revenue
 */
router.get("/stats/revenue", transactionController.getRevenueStats);

/**
 * Lấy thống kê theo ngày
 * GET /api/transactions/stats/daily
 */
router.get("/stats/daily", transactionController.getDailyStats);

/**
 * Lấy thống kê theo plan
 * GET /api/transactions/stats/by-plan
 */
router.get("/stats/by-plan", transactionController.getStatsByPlan);

// ============================================
// ROUTES CHUNG
// ============================================

/**
 * Lấy tất cả giao dịch (cho admin)
 * GET /api/transactions
 */
router.get("/", transactionController.getAllTransactions);

/**
 * Lấy chi tiết một giao dịch theo hash
 * GET /api/transactions/:transactionHash
 * 
 * ⚠️ Route này phải đặt cuối cùng để không conflict với các route khác
 */
router.get("/:transactionHash", transactionController.getTransactionByHash);

router.get('/stats/user-balance', transactionController.getUserBalance); 
export default router;
import User from "../../models/user.model.js";
import Comment from "../../models/comment.model.js";
import Review from "../../models/review.model.js";

export const getAllUsersService = async (filters) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    plan,
    startDate,
    endDate,
  } = filters;

  const query = {};

  // 🔍 Tìm kiếm theo username hoặc email
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // 🧩 Lọc theo status
  if (status) query.status = status;

  // 💎 Lọc theo subscription plan
  if (plan) query["subscriptionCache.planName"] = plan;

  // 📅 Lọc theo ngày tạo
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  // 📄 Phân trang
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // 🧮 Lấy dữ liệu users
  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password"),
    User.countDocuments(query),
  ]);

  // 🧩 Gắn thêm dữ liệu comment & review cho từng user
  const userData = await Promise.all(
    users.map(async (user) => {
      // Lấy comment gần nhất
      const [recentComment] = await Comment.find({ user_id: user._id })
        .sort({ createdAt: -1 })
        .limit(1);

      // Lấy review gần nhất
      const [recentReview] = await Review.find({ user_id: user._id })
        .sort({ createdAt: -1 })
        .limit(1);

      // Tổng số lượng
      const [commentCount, reviewCount] = await Promise.all([
        Comment.countDocuments({ user_id: user._id }),
        Review.countDocuments({ user_id: user._id }),
      ]);

      return {
        ...user.toObject(),
        comments: {
          total: commentCount,
          recent: recentComment || null,
        },
        reviews: {
          total: reviewCount,
          recent: recentReview || null,
        },
      };
    })
  );

  return {
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    data: userData,
  };
};

export const createUserService = async (data) => {
  const { email, username, password } = data;

  // 🧩 Tạo user mới
  const newUser = await User.create({
    email,
    username,
    password,
  });

  // Ẩn password khi trả về
  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;

  return userWithoutPassword;
};

export const updateUserService = async (userId, updateData) => {
  const allowedFields = [
    "username",
    "email",
    "full_name",
    "address",
    "phone",
    "avatar_url",
    "role",
    "status",
    "subscriptionPlan",
  ];

  const updateFields = {};

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) updateFields[key] = updateData[key];
  }

  // ⚡ Nếu có thay đổi gói subscription
  if (updateData.subscriptionPlan) {
    updateFields["subscriptionCache.planName"] = updateData.subscriptionPlan;
    updateFields["subscriptionCache.isActive"] =
      updateData.subscriptionPlan !== null;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
    new: true,
    runValidators: true,
  }).select("-password");

  return updatedUser;
};

export const deleteUserService = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
};

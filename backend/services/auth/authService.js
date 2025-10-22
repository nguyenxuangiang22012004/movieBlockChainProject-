import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const loginService = async (email, password) => {
  try {
    // Kiểm tra input
    if (!email || !password) {
      return {
        success: false,
        message: "Email và password là bắt buộc",
      };
    }

    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      };
    }

    // Kiểm tra trạng thái user
    if (user.status === "banned") {
      return {
        success: false,
        message: "Tài khoản của bạn đã bị khóa",
      };
    }

    // So sánh password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      };
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Trả về thông tin user (không bao gồm password)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
      subscriptionCache: user.subscriptionCache,
    };

    return {
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: userResponse,
    };
  } catch (error) {
    console.error("Login service error:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi trong quá trình đăng nhập",
    };
  }
};

export const registerService = async (userData) => {
  const { username, email, password } = userData;

  // 1️⃣ Kiểm tra input
  if (!username || !email || !password) {
    return {
      success: false,
      statusCode: 400,
      message: "Vui lòng điền đầy đủ thông tin bắt buộc",
    };
  }

  // 2️⃣ Kiểm tra email hoặc username đã tồn tại
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const message =
      existingUser.email === email
        ? "Email đã được sử dụng"
        : "Username đã được sử dụng";

    return { success: false, statusCode: 400, message };
  }

  // 3️⃣ Mã hóa password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4️⃣ Tạo user mới
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // 5️⃣ Tạo token JWT
  const token = jwt.sign(
    {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // 6️⃣ Chuẩn hóa response
  return {
    success: true,
    statusCode: 201,
    message: "Đăng ký thành công",
    data: {
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    },
  };
};
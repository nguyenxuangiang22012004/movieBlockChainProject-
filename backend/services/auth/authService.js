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
  try {
    const { username, email, password, walletAddress, full_name } = userData;

    // Kiểm tra input
    if (!username || !email || !password || !walletAddress) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      };
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ $or: [{ email }, { username }, { walletAddress }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return { success: false, message: "Email đã được sử dụng" };
      }
      if (existingUser.username === username) {
        return { success: false, message: "Username đã được sử dụng" };
      }
      if (existingUser.walletAddress === walletAddress) {
        return { success: false, message: "Wallet address đã được sử dụng" };
      }
    }

    // Mã hóa password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      walletAddress,
      full_name: full_name || "",
    });

    await newUser.save();

    // Tạo token cho user mới
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      walletAddress: newUser.walletAddress,
      full_name: newUser.full_name,
      avatar_url: newUser.avatar_url,
      role: newUser.role,
    };

    return {
      success: true,
      message: "Đăng ký thành công",
      token,
      user: userResponse,
    };
  } catch (error) {
    console.error("Register service error:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi trong quá trình đăng ký",
    };
  }
};
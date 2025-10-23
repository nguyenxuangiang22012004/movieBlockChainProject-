import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../../email/mailer.js";

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
      address: user.address,
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

  try {
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

    // 4️⃣ Tạo user mới (chưa xác minh)
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // 5️⃣ Tạo token xác minh email
    const verifyToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6️⃣ Tạo URL xác minh
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;

    // 7️⃣ Soạn email gửi đi
    const mailOptions = {
      from: `"Movie App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Xác minh địa chỉ email của bạn",
      html: `
        <h3>Xin chào ${username},</h3>
        <p>Cảm ơn bạn đã đăng ký tài khoản Movie App.</p>
        <p>Vui lòng nhấn vào liên kết bên dưới để xác minh email của bạn:</p>
        <a href="${verifyUrl}" target="_blank" 
          style="
            display:inline-block;
            background:#007bff;
            color:#fff;
            padding:10px 20px;
            border-radius:6px;
            text-decoration:none;">
          Xác minh email
        </a>
        <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
      `,
    };

    // 8️⃣ Gửi email
    await transporter.sendMail(mailOptions);

    // 9️⃣ Trả về response
    return {
      success: true,
      statusCode: 201,
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác minh.",
      data: {
        userId: newUser._id,
        email: newUser.email,
      },
    };
  } catch (error) {
    console.error("Register service error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    };
  }
};


export const verifyEmailService = async (token) => {
  try {
    if (!token) {
      return {
        success: false,
        statusCode: 400,
        message: "Thiếu token xác minh.",
      };
    }

    // 🔹 Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Tìm user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: "Người dùng không tồn tại.",
      };
    }

    // 🔹 Kiểm tra xem đã xác minh chưa
    if (user.isVerified) {
      return {
        success: false,
        statusCode: 400,
        message: "Email này đã được xác minh trước đó.",
      };
    }

    // 🔹 Cập nhật trạng thái xác minh
    user.isVerified = true;
    await user.save();

    return {
      success: true,
      statusCode: 200,
      message: "Xác minh email thành công.",
      data: { email: user.email },
    };
  } catch (error) {
    console.error("Verify email service error:", error);
    return {
      success: false,
      statusCode: 400,
      message: "Token không hợp lệ hoặc đã hết hạn.",
    };
  }
};
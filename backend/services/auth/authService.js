import dotenv from "dotenv";
dotenv.config();
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../../email/mailer.js";

export const loginService = async (email, password) => {
  try {
    if (!email || !password) {
      return {
        success: false,
        statusCode: 400,
        message: "Email và mật khẩu là bắt buộc",
      };
    }

    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        statusCode: 401,
        message: "Email hoặc mật khẩu không đúng",
      };
    }

    // Kiểm tra email đã xác minh chưa
    if (!user.isVerified) {
      return {
        success: false,
        statusCode: 403,
        message: "Vui lòng xác minh email trước khi đăng nhập",
      };
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status === "banned") {
      return {
        success: false,
        statusCode: 403,
        message: "Tài khoản của bạn đã bị khóa",
      };
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        statusCode: 401,
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
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Chuẩn bị dữ liệu user trả về (loại bỏ các thông tin nhạy cảm)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      address: user.address || "",
      full_name: user.full_name || "",
      avatar_url: user.avatar_url || "",
      walletAddress:user.walletAddress || "",
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      subscriptionCache: user.subscriptionCache || null,
      createdAt: user.createdAt,
    };

    return {
      success: true,
      statusCode: 200,
      message: "Đăng nhập thành công",
      data: {
        token,
        user: userResponse,
      },
    };
  } catch (error) {
    console.error("Login service error:", error);
    return {
      success: false,
      statusCode: 500,
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

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;
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

export const forgotPasswordService = async (email) => {
  try {
    // 1️⃣ Kiểm tra input
    if (!email) {
      return {
        success: false,
        statusCode: 400,
        message: "Email là bắt buộc",
      };
    }

    // 2️⃣ Tìm user theo email
    const user = await User.findOne({ email });
    
    // 🔒 Bảo mật: Không tiết lộ email có tồn tại hay không
    if (!user) {
      return {
        success: true,
        statusCode: 200,
        message: "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi",
      };
    }

    // 3️⃣ Kiểm tra email đã xác minh chưa
    if (!user.isVerified) {
      return {
        success: false,
        statusCode: 403,
        message: "Vui lòng xác minh email trước khi đặt lại mật khẩu",
      };
    }

    // 4️⃣ Tạo reset token (có thời hạn ngắn hơn - 1 giờ)
    const resetToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        type: 'password-reset' // Thêm type để phân biệt
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5️⃣ Tạo URL reset password
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // 6️⃣ Soạn email
    const mailOptions = {
      from: `"Movie App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Đặt lại mật khẩu tài khoản",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Đặt lại mật khẩu</h2>
          <p>Xin chào <strong>${user.username}</strong>,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
          <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
              style="
                display: inline-block;
                background: #007bff;
                color: #fff;
                padding: 12px 30px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: bold;
              ">
              Đặt lại mật khẩu
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Hoặc copy link sau vào trình duyệt:<br>
            <a href="${resetUrl}" style="color: #007bff; word-break: break-all;">
              ${resetUrl}
            </a>
          </p>
          <p style="color: #e74c3c; font-weight: bold;">
            ⚠️ Link này sẽ hết hạn sau 1 giờ.
          </p>
          <p style="color: #666; font-size: 13px; margin-top: 30px;">
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 Movie App. All rights reserved.
          </p>
        </div>
      `,
    };

    // 7️⃣ Gửi email
    await transporter.sendMail(mailOptions);

    // 8️⃣ Trả về response
    return {
      success: true,
      statusCode: 200,
      message: "Link đặt lại mật khẩu đã được gửi đến email của bạn",
    };
  } catch (error) {
    console.error("Forgot password service error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    };
  }
};

// Reset Password Service - Cập nhật mật khẩu mới
export const resetPasswordService = async (token, newPassword) => {
  try {
    // 1️⃣ Kiểm tra input
    if (!token || !newPassword) {
      return {
        success: false,
        statusCode: 400,
        message: "Thiếu thông tin bắt buộc",
      };
    }

    // 2️⃣ Validate password
    if (newPassword.length < 6) {
      return {
        success: false,
        statusCode: 400,
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      };
    }

    // 3️⃣ Giải mã token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Kiểm tra type token
      if (decoded.type !== 'password-reset') {
        return {
          success: false,
          statusCode: 400,
          message: "Token không hợp lệ",
        };
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: "Token không hợp lệ hoặc đã hết hạn",
      };
    }

    // 4️⃣ Tìm user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: "Người dùng không tồn tại",
      };
    }

    // 5️⃣ Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 6️⃣ Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    // 7️⃣ Gửi email thông báo (optional)
    const mailOptions = {
      from: `"Movie App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Mật khẩu đã được thay đổi",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Mật khẩu đã được thay đổi</h2>
          <p>Xin chào <strong>${user.username}</strong>,</p>
          <p>Mật khẩu tài khoản của bạn đã được thay đổi thành công.</p>
          <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 Movie App. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // 8️⃣ Trả về response
    return {
      success: true,
      statusCode: 200,
      message: "Đặt lại mật khẩu thành công",
    };
  } catch (error) {
    console.error("Reset password service error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    };
  }
};
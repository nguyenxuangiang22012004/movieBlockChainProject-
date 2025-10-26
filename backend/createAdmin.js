import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/user.model.js'; // Đảm bảo đường dẫn đến model User là chính xác

// --- THAY ĐỔI CÁC GIÁ TRỊ NÀY ---
const MONGO_URI = 'mongodb://127.0.0.1:27017/movieWebBlockChain'; // Thay bằng chuỗi kết nối MongoDB của bạn
const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin1234'; // Thay bằng mật khẩu bạn muốn đặt
const ADMIN_WALLET = '0xYourAdminWalletAddress'; // Thay bằng địa chỉ ví của admin
// ------------------------------------

const createAdminAccount = async () => {
  try {
    // 1. Kết nối đến cơ sở dữ liệu
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully.');

    // 2. Kiểm tra xem tài khoản admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin account already exists.');
      return; // Dừng lại nếu đã có admin
    }

    // 3. Hash mật khẩu
    // `bcrypt.genSalt(10)`: Tạo "muối" với độ phức tạp là 10. Con số càng cao càng an toàn nhưng càng tốn thời gian. 10 là mức tốt.
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
    console.log('Password hashed successfully.');

    // 4. Tạo người dùng admin mới
    const adminUser = new User({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword, // << Sử dụng mật khẩu đã được hash
      walletAddress: ADMIN_WALLET,
      full_name: 'Administrator',
      role: 'admin', // << Gán quyền admin
      status: 'approved',
      isVerified : true,
    });

    // 5. Lưu vào cơ sở dữ liệu
    await adminUser.save();
    console.log('✅ Admin account created successfully!');
    console.log(`   - Username: ${adminUser.username}`);
    console.log(`   - Email: ${adminUser.email}`);

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
  } finally {
    // 6. Ngắt kết nối khỏi cơ sở dữ liệu sau khi hoàn tất
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

// Chạy hàm
createAdminAccount()
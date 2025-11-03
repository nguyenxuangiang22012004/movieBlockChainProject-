// models/User.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Các thông tin này sẽ để người dùng cập nhật sau khi đăng nhập
    full_name: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    avatar_url: {
      type: String,
      default: "img/user.svg",
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      default: "", 
    },
    subscriptionCache: {
      isActive: { type: Boolean, default: false },
      planName: { type: String, enum: ["Basic", "Premium", "Cinematic", null], default: null },
      expiresAt: { type: Date, default: null },
    },
    favorites: [
      {
        item_id: { type: Schema.Types.ObjectId, required: true },
        item_type: { type: String, required: true, enum: ["Movie", "TVSeries"] },
      },
    ],
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["approved", "banned"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;

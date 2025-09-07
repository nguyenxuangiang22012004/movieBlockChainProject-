// models/User.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
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
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  full_name: String,
  avatar_url: {
    type: String,
    default: "img/user.svg",
  },
  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user",
  },
  subscriptionCache: {
    isActive: { type: Boolean, default: false },
    planName: { type: String, enum: ["Basic", "Premium", "Cinematic", null] },
    expiresAt: { type: Date },
  },
  favorites: [
    {
      item_id: { type: Schema.Types.ObjectId, required: true },
      item_type: { type: String, required: true, enum: ["Movie", "TVSeries"] },
    },
  ],
  status: {
    type: String,
    enum: ["approved", "banned"],
    default: "approved",
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;

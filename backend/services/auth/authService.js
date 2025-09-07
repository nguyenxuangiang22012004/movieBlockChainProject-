
import User from "../../models/user.model.js";
import bcrypt from "bcrypt"; 

export const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { success: false, message: "Invalid password" };
    }
    return { success: true, token: "fake-jwt-token", user }; 
  } catch (error) {
    return { success: false, message: error.message };
  }
};
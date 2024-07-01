import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    trim: true,
  },
  joinDate: {
    type: String,
    required: true,
    trim: true,
  }
})

const User = mongoose.model("Users", userSchema);
export default User;
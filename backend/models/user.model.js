import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],  // Added role field with predefined values
    default: "user",          // Default role is "user"
  },
});



const User = mongoose.model("User", userSchema);

export default User;

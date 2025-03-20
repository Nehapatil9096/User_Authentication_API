import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, mobileNumber, role } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash password before saving user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!hashedPassword) {
      throw new Error("Password hashing failed");
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobileNumber,
      role: role || "user", // Default to "user"
    });

    // Save the user
    await newUser.save();

    // Generate JWT token
    const token = generateTokenAndSetCookie(newUser._id, newUser.role, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token, // Send token in response
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const login = async (req, res) => {
	try {
	  const { identifier, password } = req.body; // Email or mobile number
	  const user = await User.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] });
  
	  if (!user) {
		return res.status(400).json({ error: "Invalid email/mobile number" });
	  }
  
	  const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
  
	  if (!isPasswordCorrect) {
		return res.status(400).json({ error: "Invalid password" });
	  }
  
	  // Generate JWT token with role
	  const token = generateTokenAndSetCookie(user._id, user.role, res);
  
	  res.status(200).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		role: user.role, 
		token, //  Include token in response
	  });
  
	} catch (error) {
	  console.log("Error in login controller", error.message);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };
  

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

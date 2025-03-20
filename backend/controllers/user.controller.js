import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //  Include role in response
    res.json({
      username: user.username,
      // email: user.email,
      role: user.role, // Role added
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Admin-only function
export const getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access Denied - Admins Only" });
    }

    const users = await User.find().select("-password"); // Fetch all users except passwords
    res.status(200).json({ message: "Admin Dashboard", users });
  } catch (error) {
    console.error("Error in getAdminDashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// controllers/user.controller.js

import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    // Fetch user data along with cards
    const user = await User.findById(req.user.id).populate('cards');

    // Your response logic here
    res.json({ user });
  } catch (error) {
    console.error("Error in getUserData: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add new controllers or update existing ones based on your application's needs
export const updateUser = async (req, res) => {
  try {
    // Extract updated user data from the request body
    const updatedUserData = req.body;
console.log("data fetched:", updatedUserData);
    // Find the user by email and update their information
    const updatedUser = await User.findOneAndUpdate({ email: updatedUserData.email }, updatedUserData, { new: true });

    // Your response logic here
    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error in updateUser: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Your other controllers

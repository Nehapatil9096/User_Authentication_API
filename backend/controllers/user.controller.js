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
  try { // Check if user exists in request object
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }
    
    // Fetch user data along with cards
    const user = await User.findById(req.user.id).populate('cards');
    // Fetch user data along with cards

    // Your response logic here
    res.json({ user });
  } catch (error) {
    console.error("Error in getUserData: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add new controllers or update existing ones based on your application's needs

// Your other controllers
export const updateUser = async (req, res) => {
	try {
	  const userId = req.user.email;
	  const updatedUserData = req.body; // Assuming the updated user data is sent in the request body
  
	  // Update the user data in the database
	  const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
  
	  res.status(200).json(updatedUser);
	} catch (error) {
	  console.error("Error in updateUser:", error.message);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };
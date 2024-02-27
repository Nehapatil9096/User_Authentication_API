import User from "../models/user.model.js";

export const moveCardToSection = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { section } = req.body;

    // Find the user by ID and update the card's section
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id, 'cards._id': cardId },
      { $set: { 'cards.$.state': section } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User or card not found" });
    }
      // Console logs for debugging
      console.log(`Card ${cardId} moved to ${section} by user ${req.user.id}`);


    // Respond with the updated user data
    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error in moveCardToSection: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

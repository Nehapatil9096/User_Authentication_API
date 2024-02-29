import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./SettingPage.module.css";
import lockIcon from "../../photo/lock.png";
import nameIcon from "../../photo/name.png";
import viewIcon from "../../photo/view.png";

const SettingsPage = () => {
  const { authUser, setAuthUserData } = useAuthContext();
  const [userSettings, setUserSettings] = useState({
    name: authUser.username || "", // Pre-filled name from authUser
    oldPassword: "",
    newPassword: "",
  });

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to handle updates to user settings
  const handleUpdateSettings = async () => {
    try {
      // Validate the form fields (add your validation logic here)
      if (!userSettings.name.trim()) {
        toast.error("Name cannot be empty");
        return;
      }

      // Validate old and new passwords
      if (userSettings.newPassword && userSettings.oldPassword === userSettings.newPassword) {
        toast.error("New password must be different from old password");
        return;
      }
  // Check if authUser is defined
  if (!authUser) {
    toast.error("User data not available");
    return;
  }

      // Prepare data to send for update
      const updateData = { username: userSettings.name };
      if (userSettings.oldPassword && userSettings.newPassword) {
        updateData.oldPassword = userSettings.oldPassword;
        updateData.newPassword = userSettings.newPassword;
      }

      // Example: Update user data on the server
      const response = await fetch("/api/users/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // Update local authUser data with the new username if it was changed successfully
        setAuthUserData({ ...authUser, username: userSettings.name });
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update user settings");
      }
    } catch (error) {
      console.error("Error updating user settings:", error.message);
      toast.error("Failed to update user settings");
    }
  };

// Main Settings Page code
return (
  <div className={styles.settingsContainer}>
    <h2 className={styles.settingsTitle}>Settings Page</h2>

    <label className={styles.settingsLabel}>
  
      <input
        className={styles.settingsInput}
        type="text"
        placeholder="           Name"
        value={userSettings.name}
        onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
      />  <span className={styles.icon}>
      <img src={nameIcon} alt="Name Icon" />
    </span>
    </label>

    <label className={styles.settingsLabel}>
       <input
        className={styles.settingsInputPassword}
        type={showPassword ? "text" : "password"}
        placeholder="            Enter Old Password"

        value={userSettings.oldPassword}
        onChange={(e) => setUserSettings({ ...userSettings, oldPassword: e.target.value })}
      />
            <span className={styles.icon}>

     <img
  src={viewIcon}
  alt="View Password"
  onClick={() => setShowPassword(!showPassword)}
  className={styles.showPasswordIcon}
/>
</span>

      <span className={styles.icon}>
          <img src={lockIcon} alt="Lock Icon" />
        </span>
    </label>

    <label className={styles.settingsLabel}>
    
      <input
        className={styles.settingsInputPassword}
        type={showPassword ? "text" : "password"}
        placeholder="             Enter New Password"

        value={userSettings.newPassword}
        onChange={(e) => setUserSettings({ ...userSettings, newPassword: e.target.value })}
      />
     
            <span className={styles.icon}>

     <img
  src={viewIcon}
  alt="View Password"
  onClick={() => setShowPassword(!showPassword)}
  className={styles.showPasswordIcon}
/>
</span>
      <span className={styles.icon}>
          <img src={lockIcon} alt="Lock Icon" />
        </span>
    </label>

    <button className={styles.settingsButton} onClick={handleUpdateSettings}>
      Update Settings
    </button>

    {/* Add more settings UI elements as needed */}
  </div>
);
}

export default SettingsPage;

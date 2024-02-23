import React, { useState } from "react";
import { NavLink, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import LogoutButton from "../../components/LogoutButton";
import BoardPage from "../board/BoardPage"; // Import the BoardPage component
import AnalyticsPage from "../analytics/AnalyticsPage"; // Import the AnalyticsPage component
import SettingsPage from "../settings/SettingsPage"; // Import the SettingsPage component

const Dashboard = () => {
  const navigate = useNavigate();

  // State to manage the visibility of the logout confirmation popup
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleNavClick = (to) => {
    navigate(to); // Manually navigate to the specified route
  };

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    // Perform logout action here
    // For now, let's just close the popup
    setShowLogoutConfirmation(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar Component */}
      <div className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img src="/src/photo/codesandbox.png" alt="logo Icon" className={styles.logo} />
          <div className={styles.brand}>Pro Manage</div>
        </div>
        <nav>
          <div className={styles.sidebarButton1} onClick={() => handleNavClick("/board")}>
            Board
          </div>
          <div className={styles.sidebarButton2} onClick={() => handleNavClick("/analytics")}>
            Analytics
          </div>
          <div className={styles.sidebarButton3} onClick={() => handleNavClick("/settings")}>
            Settings
          </div>
        </nav>
        <div className={styles.divider}></div>
        <LogoutButton onClick={handleLogout} >logout</LogoutButton>
      </div>
      {/* Content Section */}
      <div className={styles.content}>
        <Routes>
          {/* Default route to render BoardPage component */}
          <Route path="" element={<BoardPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Add other routes for analytics, settings, etc. */}
        </Routes>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirmation && (
        <div className={styles.logoutConfirmation}>
          <p>Are you sure you want to logout?</p>
          <button onClick={confirmLogout}>Yes</button>
          <button onClick={cancelLogout}>No</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

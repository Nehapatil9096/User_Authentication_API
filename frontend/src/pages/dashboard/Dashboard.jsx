import React, { useState } from "react";
import { Outlet, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import styles from "./Dashboard.module.css";
import LogoutButton from "../../components/LogoutButton";
import BoardPage from "../board/BoardPage"; // Import the BoardPage component
import AnalyticsPage from "../analytics/AnalyticsPage"; // Import the AnalyticsPage component
import SettingsPage from "../settings/SettingsPage"; // Import the SettingsPage component
const Dashboard = () => {
const navigate = useNavigate();
const location = useLocation();
// State to manage the visibility of the logout confirmation popup
const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
const handleNavClick = (to) => {
navigate(to); // Manually navigate to the specified route
};
// Check if the current route is the signup or login page
const isLoginPage = location.pathname === "/login";
const isSignupPage = location.pathname === "/signup";
// Determine whether to show the sidebar based on the current route
const showSidebar = !isLoginPage && !isSignupPage;
return (
<div className={styles.dashboard}>
{/* Sidebar Component */}
{showSidebar && (
<div className={styles.sidebar}>
<div className={styles.logoContainer}>
<img src="/src/photo/codesandbox.png" alt="logo Icon" className={styles.logo} />
<div className={styles.brand}>Pro Manage</div>
</div>
<nav>
<div className={styles.logoContainer}>
<img src="/src/photo/layout (1).png" alt="logo Icon" className={styles.logo} />
<div className={styles.sidebarButton1} onClick={() => handleNavClick("/board")}>
Board
</div>
</div>
<div className={styles.logoContainer}>
<img src="/src/photo/database.png" alt="logo Icon" className={styles.logo} />
<div className={styles.sidebarButton2} onClick={() => handleNavClick("/analytics")}>
Analytics
</div>
</div>
<div className={styles.logoContainer}>
<img src="/src/photo/settings.png" alt="logo Icon" className={styles.logo} />
<div className={styles.sidebarButton3} onClick={() => handleNavClick("/settings")}>
Settings
</div>
</div>
</nav>
<div className={styles.divider}></div>
<LogoutButton onClick={() => setShowLogoutConfirmation(true)}>logout</LogoutButton>
</div>
)}
{/* Content Section */}
<div className={styles.content}>
<Outlet />
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
<button onClick={() => setShowLogoutConfirmation(false)}>No</button>
<button onClick={() => {
// Perform logout action here
// For now, let's just close the popup
setShowLogoutConfirmation(false);
}}>Yes</button>
</div>
)}
</div>
);
};
export default Dashboard;
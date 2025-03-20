import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LogoutButton from "/src/components/LogoutButton";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./Home.module.css"; // Import the CSS module

const Home = () => {
  const { authUser, role } = useAuthContext();
  const [username, setUsername] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (authUser && !username) {  //  Only fetch if `username` is missing
      fetchUserData();
    }
  }, [authUser, username]);
  

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/users/profile", {
        withCredentials: true,
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>User Authentication API</div>
        {/* Show Login and Signup if the user is not logged in */}
        {!authUser && (
          <div className={styles.authLinks}>
            <Link to="/login">Login</Link>
            <span> &nbsp; | &nbsp;</span>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </header>

      {authUser && (
        <div className={styles.userProfile}>
          {/* User Circle */}
          <div className={styles.userCircle} onClick={togglePopup}>
            {username
              ? username
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("")
              : "U"}
          </div>
          {/* Popup content */}
          <div className={`${styles.userPopup} ${showPopup ? styles.userPopupActive : ''}`}>
            <div className={styles.username}>
              {username
                ? username
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : ""}
            </div>
            <hr className={styles.divider} />
            <div className={styles.logoutContainer}>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      <div className={styles.welcomeMessage}>
        <span className={`${styles.welcomeText} ${role === "admin" ? styles.adminText : ""}`}>
          {authUser
            ? role === "admin"
              ? "Welcome, Admin! You have full access."
              : "Welcome! User is logged in"
            : "Please log in to access more features."}
        </span>
      </div>
    </div>
  );
};

export default Home;
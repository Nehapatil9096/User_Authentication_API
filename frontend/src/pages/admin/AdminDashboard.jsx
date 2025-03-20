import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "/src/components/LogoutButton";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const { authUser, role } = useAuthContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Redirect non-admin users
  if (!authUser || role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchUsers();
    if (authUser) {
      setUsername(authUser.username);
    }
  }, [authUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users/admin", { withCredentials: true });
      setUsers(response.data?.users || []); // Prevents errors if `users` is undefined
      
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <span className={styles.crownIcon}></span> Admin Dashboard
          </h1>
          <p className={styles.welcomeMessage}>
            Welcome, {authUser?.username}! You have admin access.
          </p>
        </div>
        
        {authUser && (
          <div className={styles.userProfile}>
            {/* User Circle */}
            <div className={styles.userCircle} onClick={togglePopup}>
              {username
                ? username
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")
                : "A"}
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
      </div>

      <div className={styles.usersSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.clipboardIcon}></span> Registered Users
        </h2>
        
        {loading ? (
          <p className={styles.loading}>Loading users...</p>
        ) : (
          <ul className={styles.userList}>
            {users.length > 0 ? (
              users.map((user) => (
                <li key={user._id} className={styles.userItem}>
                  <div>
                    <span className={styles.userName}>{user.username}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                  </div>
                  <span className={`${styles.userRole} ${
                    user.role === "admin" ? styles.userRoleAdmin : styles.userRoleUser
                  }`}>
                    {user.role}
                  </span>
                </li>
              ))
            ) : (
              <p className={styles.noUsers}>No users found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
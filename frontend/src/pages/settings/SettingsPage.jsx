// pages/settings/SettingsPage.jsx
import React, { useState } from "react";
import styles from "./SettingsPage.module.css";


const SettingsPage = () => {
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };


return(
  <form className={styles.settingsForm} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="name">
        Name
      </label>
      <input
        className={styles.input}
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className={styles.label} htmlFor="oldPassword">
        Old Password
      </label>
      <input
        className={styles.input}
        type="password"
        id="oldPassword"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <label className={styles.label} htmlFor="newPassword">
        New Password
      </label>
      <input
        className={styles.input}
        type="password"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button className={styles.button} type="submit">
        Update
      </button>
    </form>
  );
};

export default SettingsPage;




  
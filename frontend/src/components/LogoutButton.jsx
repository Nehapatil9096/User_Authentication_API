import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import useLogout from "/src/hooks/useLogout";
import styles from "./Logout.module.css";

const LogoutButton = () => {
    const { loading, logout } = useLogout();
    const [showPopup, setShowPopup] = useState(false);

    const handleLogout = () => {
        // Display confirmation popup
        setShowPopup(true);
    };

    const handleConfirmLogout = () => {
        // Call logout function
        logout();
        // Close the popup
        setShowPopup(false);
    };

    const handleCancelLogout = () => {
        // Close the popup
        setShowPopup(false);
    };

    return (
        <div className={styles.container}>
            {!loading ? (
                <div className={`${styles.flex} ${styles.itemsCenter}`}>
                    <div className={styles.logoutButton} onClick={handleLogout}>
                        <BiLogOut
                            className={`${styles.icon} ${styles.flipHorizontal}`}
                            style={{ color: 'red' }}
                        />
                        <span className={styles.text}>Log out</span>
                    </div>
                </div>
            ) : (
                <span className={`${styles.loading} ${styles.loadingSpinner}`}></span>
            )}

            {showPopup && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <p>Are you sure you want to Logout?</p>
                        <div className={styles.popupButtons}>
                            <button onClick={handleConfirmLogout} className={styles.logoutPopupButton}>Yes,  Logout</button>
                            <button onClick={handleCancelLogout} className={styles.logoutPopupButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogoutButton;

import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import useLogout from "/src/hooks/useLogout";
import styles from "./Logout.module.css";

const LogoutButton = () => {
    const { loading, logout } = useLogout();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleLogout = () => {
        // Display confirmation directly below or beside the logout button
        setShowConfirmation(true);
    };

    const handleConfirmLogout = () => {
        // Call logout function
        logout();
        // Close the confirmation
        setShowConfirmation(false);
    };

    const handleCancelLogout = () => {
        // Close the confirmation
        setShowConfirmation(false);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.flex} ${styles.itemsCenter}`}>
                <div className={styles.logoutButton} onClick={handleLogout}>
                    <BiLogOut
                        className={`${styles.icon} ${styles.flipHorizontal}`}
                        style={{ color: 'red' }}
                    />
                    <span className={styles.text}>Log out</span>
                </div>
                {/* Display confirmation directly below or beside the logout button */}
                {showConfirmation && (
                    <div className={styles.confirmation}>
                        <p>Are you sure you want to logout?</p>
                        <div className={styles.confirmationButtons}>
                            <button onClick={handleConfirmLogout} className={styles.confirmationButton}>Yes, Logout</button>
                            <button onClick={handleCancelLogout} className={styles.confirmationButton}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            {/* Display loading spinner if loading */}
            {loading && <span className={`${styles.loading} ${styles.loadingSpinner}`}></span>}
        </div>
    );
};

export default LogoutButton;

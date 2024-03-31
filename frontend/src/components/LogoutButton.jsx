import useLogout from "/src/hooks/useLogout";
import styles from "./Logout.module.css";

const LogoutButton = () => {
    const { loading, logout } = useLogout();

    const handleLogout = () => {
        // Call logout function directly
        logout();
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.flex} ${styles.itemsCenter}`}>
                <div className={styles.logoutButton} onClick={handleLogout}>
                    <span className={styles.text}>Logout</span>
                </div>
            </div>
            {/* Display loading spinner if loading */}
            {loading && <span className={`${styles.loading} ${styles.loadingSpinner}`}></span>}
        </div>
    );
};

export default LogoutButton;

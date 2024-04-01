import React, { useState, useEffect,useRef } from "react";
import styles from './OrderConfirmationMobile.module.css'; // Import the CSS module
import { useParams, useNavigate } from 'react-router-dom';
import useLogout from "/src/hooks/useLogout";
import { Link } from "react-router-dom";
import projectLogo from "/Mlogo.png";



const OrderConfirmation = () => {

  const navigate = useNavigate();
  //logout------------------------------
  const logoutButtonRef = useRef(null);
  const [username, setUsername] = useState('');


  useEffect(() => {
    if (logoutButtonRef.current) {
      logoutButtonRef.current.addEventListener('click', handleLogout);
    }
  
    return () => {
      if (logoutButtonRef.current) {
        logoutButtonRef.current.removeEventListener('click', handleLogout);
      }
    };
  }, [username]); // Reconnect listener on username changes
  const { logout } = useLogout(); // Destructure logout from useLogout

  const handleLogout = () => {
    // Implement your logout logic here (potentially calling methods from LogoutButton)
    console.log('Logout initiated');
    logout();

  };

  const handleViewCart= () => {
    navigate('/mycart');
};

  //----------------------------------------

  return (
    <div className={styles.container}>
       <header className={styles.header}>
  <div className={styles.leftSection}>
  <img src={projectLogo} alt="Project Logo" />
  </div>
  
</header>
    <div className={styles.outerContainer}> {/* Apply the CSS class to the outer container */}
          

      <div className={styles.innerContainer}> {/* Apply the CSS class to the inner container */}
        <img className={styles.img}src="./order.png" alt="Order Placed" />
        <h2>Order is placed successfully!</h2>
        <p className={styles.innerEmail}>You will be receiving a confirmation email with order details.</p>
        <button className={styles.button} onClick={() => window.location.href = '/'}>Go back to Home page</button>
      </div>
 
    </div>
    {/* Bottom menu bar */}
<div className={styles.bottomMenu}>
        <Link to="/" className={styles.mbmenuItem}>
          <img src="/mbhome.png" alt="Home" className={styles.menuIcon} />
          <div className={styles.menuLine}></div>
        </Link>

        <div className={styles.mbmenuItem} onClick={handleViewCart}>
          <img src="/Mbcart.png" alt="View Cart" className={styles.menuIcon} />
          <div className={styles.menuLine}></div>
        </div>

        <Link to="/invoices" className={styles.mbmenuItem}>
          <img src="/mbinvoice.png" alt="Invoice" className={styles.menuIcon} />
          <div className={styles.menuLine}></div>
        </Link>

        <div className={styles.mbmenuItem}>
          {username ? (
        <button ref={logoutButtonRef} type="button" className={styles.mblogoutbutton}>
        <img src="/mblogout.png" alt="Logout" className={styles.menuIcon} />
        </button>          
        ) : (
            <Link to="/login" className={styles.mbmenuItem}>
              <img src="/mblogin.png" alt="Login" className={styles.menuIcon} />
              <div className={styles.menuLine}></div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

import React, { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./InvoicesMobile.module.css";
import invoiceImage from "/Invoice.png"; // Import the image
import invoiceImage1 from "/Minvoice.png"; // Import the image
import axios from 'axios';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/Mlogo.png";
import LogoutButton from "/src/components/LogoutButton";
import { useParams, useNavigate } from 'react-router-dom';
import useLogout from "/src/hooks/useLogout";


const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  //logout------------------------------
  const logoutButtonRef = useRef(null);

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

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/api/users/cart/count');
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };  
  //----------------------------------------
  useEffect(() => {
    fetchInvoices(); // Call fetchInvoices when the component mounts
  }, []); // Empty dependency array to ensure fetchInvoices is only called once

  const fetchInvoices = async () => {
    try {
      // Fetch invoices from backend API
      const response = await fetch("/api/users/invoices");
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse JSON data
      const data = await response.json();
      setInvoices(data.orders); // Assuming the response contains an array of orders within the "orders" property of the user object
      setUsername(data.username); // Set username received from backend

    } catch (error) {
      console.error("Error fetching invoices:", error);
      // You can set invoices to an empty array or display an error message
      setInvoices([]);
    }
  };

  const handleViewCart= () => {
    navigate('/mycart');
};


  return (
    <div className={styles.container}>
         <header className={styles.header}>
  <div className={styles.leftSection}>
  <img src={projectLogo} alt="Project Logo" />
  </div>
  
</header>
      <div className={styles.home}>

      <div className={styles.menubar}>
        <div className={styles.leftSection}>
          <div className={styles.menuItem}>
          </div>
          
        </div>
        <div className={styles.rightSection}>
          <div className={styles.menuItem}>
                {/* View Cart button */}
                
              </div>
         
        </div>
      </div>

      <Link to="/home" className={styles.homeButton}>
        <img src="/Mback.png" alt="Back to Home" className={styles.homeButtonImage} />
      </Link>      <div className={styles.heading}>
        <h1>                <img src={invoiceImage1} alt="Invoice Image1" className={styles.invoiceImage1} />
My Invoices</h1>
      </div>
      <div className={styles.invoiceList}>
        {invoices
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .map((order, index) => (
            <div key={index} className={styles.invoiceItem}>
              <div className={styles.left}>
                <img src={invoiceImage} alt="Invoice Image" className={styles.invoiceImage} />
              </div>
              <div className={styles.right}>
                <p className={styles.username}>{username}</p>
                <p className={styles.deliveryAddress}>{order.deliveryAddress}</p>
              </div>
              <Link to={`/invoices/${order._id}`}>
                <button className={styles.invoiceButton}>View Invoice</button>
              </Link>
            </div>
          ))}
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
          {cartCount >= 0 && <span className={styles.cartCount}>{cartCount}</span>}
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

export default Invoice;

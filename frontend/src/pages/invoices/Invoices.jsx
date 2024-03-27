import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "/src/pages/invoices/Invoice.module.css";
import invoiceImage from "/Invoice.png"; // Import the image
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/project_logo.png";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [username, setUsername] = useState('');

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <img src={phoneCallIcon} alt="Phone call" />
          <span>912121131313</span>
        </div>
        <div className={styles.headerContent}>
          <span>Get 50% off on selected items&nbsp; | &nbsp; Shop Now</span>
        </div>
      </header>
      <div className={styles.home}>

      <div className={styles.menubar}>
        <div className={styles.leftSection}>
          <div className={styles.menuItem}>
            <img src={projectLogo} alt="Project Logo" />
          </div>
          <div className={styles.menuItem}>
            <Link to="/home" className={styles.homeLink}>Home</Link>
          </div>
          <div className={styles.menuItem}>
            <Link to="/invoices" className={styles.invoiceLink}>Invoice</Link>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.menuItem}>
            <button className={styles.button}>
              <img src="/cart_menu.png" alt="Cart_Menu" />
              <span>View Cart</span>
            </button>
          </div>
         
        </div>
      </div>
      <Link to="/home" className={styles.homeButton}>Back to Home</Link> {/* Back to Home button */}
      <div className={styles.heading}>
        <h1>My Invoices</h1>
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
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Musicart | All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default Invoice;

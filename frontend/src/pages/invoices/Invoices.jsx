import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "/src/components/LogoutButton";
import styles from "/src/pages/invoices/Invoice.module.css";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);

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
    } catch (error) {
      console.error("Error fetching invoices:", error);
      // You can set invoices to an empty array or display an error message
      setInvoices([]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.leftSection}>
          <span>User Mob. Number</span>
        </div>
        <div className={styles.middleSection}>
          <span>Musicart</span>
        </div>
        <div className={styles.rightSection}>
          <LogoutButton />
        </div>
      </div>

      <div className={styles.title}>
        <span>Musicart</span>
        <Link to="/">
          <span className={styles.homeButton}>Home</span>
        </Link>
      </div>

      <div className={styles.heading}>
        <h1>My Invoices</h1>
      </div>

      <div className={styles.invoiceList}>
        {invoices.map((order, index) => (
          <div key={index} className={styles.invoiceItem}>
            <div className={styles.left}>
              <p>Order ID: {order._id}</p>
              <p>Delivery Address: {order.deliveryAddress}</p>
              {/* Display other order details as needed */}
            </div>
            <div className={styles.right}>
              <Link to={`/invoices/${order._id}`}>
                <button className={styles.invoiceButton}>View Invoice</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoice;

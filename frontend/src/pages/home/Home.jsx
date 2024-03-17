import React, { useState } from "react";
import styles from "./Home.module.css";

const Home = () => {
  // State to manage the visibility of the logout confirmation popup
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Sample products data (replace with actual data)
  const products = [
    { id: 1, name: 'Headphone 1', company: 'JBL', price: '$49.99', color: 'Black', type: 'On-ear headphone' },
    { id: 2, name: 'Headphone 2', company: 'Sony', price: '$99.99', color: 'White', type: 'In-ear headphone' },
    // Add more sample products here
  ];

  return (
    <div className={styles.home}>
      {/* Navigation Bar */}
      <div className={styles.navbar}>
        <div className={styles.leftSection}>
          <span>User Mob. Number</span>
        </div>
        <div className={styles.middleSection}>
          <span>Get 50% off on selected items | Shop Now</span>
        </div>
      </div>

      {/* Menu Bar */}
      <div className={styles.menubar}>
        <div className={styles.leftSection}>
          <span>Musicart</span>
          <span>Home</span>
          <span>Invoice</span>
        </div>
        <div className={styles.rightSection}>
          <span>Cart</span>
          <div className={styles.userCircle}>U</div> {/* Replace 'U' with user initials */}
        </div>
      </div>

      {/* Banner */}
      <div className={styles.banner}>
        <span>Grab upto 50% off on Selected headphones</span>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input type="text" placeholder="Search..." />
      </div>

      {/* Sorting Options Bar */}
      <div className={styles.sortingBar}>
        <div className={styles.leftSection}>
          <span>Grid</span>
          <span>List</span>
        </div>
        <div className={styles.dropdowns}>
          {/* Dropdowns for Headphone type, Company, Color, Price, and Sort by */}
          <select>
            <option value="headphoneType">Headphone type</option>
            <option value="featured">Featured</option>
            <option value="inEar">In-ear headphone</option>
            <option value="onEar">On-ear headphone</option>
            <option value="overEar">Over-ear headphone</option>
          </select>
          <select>
            <option value="company">Company</option>
            <option value="featured">Featured</option>
            <option value="JBL">JBL</option>
            <option value="Sony">Sony</option>
            {/* Add more options here */}
          </select>
          <select>
            <option value="color">Color</option>
            <option value="featured">Featured</option>
            <option value="blue">Blue</option>
            <option value="black">Black</option>
            {/* Add more options here */}
          </select>
          <select>
            <option value="price">Price</option>
            <option value="featured">Featured</option>
            <option value="0-1000">₹0 - ₹1,000</option>
            <option value="1000-10000">₹1,000 - ₹10,000</option>
            {/* Add more options here */}
          </select>
        </div>
        <select>
          <option value="sortBy">Sort by</option>
          <option value="featured">Featured</option>
          <option value="priceLowest">Price: Lowest</option>
          <option value="priceHighest">Price: Highest</option>
          <option value="nameAZ">Name: (A-Z)</option>
          <option value="nameZA">Name: (Z-A)</option>
        </select>
      </div>

      {/* Product Listing */}
      <div className={styles.productList}>
        {products.map(product => (
          <div key={product.id} className={styles.productCard}>
            <h3>{product.name}</h3>
            <p>Company: {product.company}</p>
            <p>Price: {product.price}</p>
            <p>Color: {product.color}</p>
            <p>Type: {product.type}</p>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <span>Logout</span> {/* Logout button */}
        <span>Musicart | All rights reserved</span>
      </div>
    </div>
  );
};

export default Home;

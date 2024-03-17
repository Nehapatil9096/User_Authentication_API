import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/users/products/search?q=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
 // Function to handle search input change
 const handleSearchInputChange = (event) => {
  setSearchQuery(event.target.value);
};
  // State to manage the visibility of the logout confirmation popup
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // State to store the selected option for each dropdown
  const [selectedOptions, setSelectedOptions] = useState({
    headphoneType: "",
    company: "",
    color: "",
    price: "",
    sortBy: ""
  });

  // Function to handle dropdown change
  function handleDropdownChange(event, dropdownName) {
    // Update selected option for the dropdown
    setSelectedOptions({
      ...selectedOptions,
      [dropdownName]: event.target.value
    });
  }


  
  return (
    <div className={styles.container}>
      <div className={styles.home}>
        {/* Logout Button */}
        <div className={styles.logoutButtonContainer}>
          <span>Logout</span>
        </div>

        {/* Logout Confirmation Popup */}
        {showLogoutConfirmation && (
          <div className={styles.logoutConfirmation}>
            <p>Are you sure you want to logout?</p>
            <button onClick={() => setShowLogoutConfirmation(false)}>No</button>
            <button
              onClick={() => {
                // Perform logout action here
                // For now, let's just close the popup
                setShowLogoutConfirmation(false);
              }}
            >
              Yes
            </button>
          </div>
        )}

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
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>

        {/* Sorting Options Bar */}
        <div className={styles.sortingBar}>
          <div className={styles.leftSection}>
            <span>Grid</span>
            <span>List</span>
          </div>
          <div className={styles.dropdowns}>
            <div className={styles.dropdown}>
              <select id="headphoneType" onChange={(e) => handleDropdownChange(e, "headphoneType")} value={selectedOptions.headphoneType}>
                <option value="" disabled hidden>Headphone type</option>
                <option value="featured">In-ear headphone</option>
                <option value="in-ear">On-ear headphone</option>
                <option value="on-ear">Over-ear headphone</option>
              </select>
            </div>
            <div className={styles.dropdown}>
              <select onChange={(e) => handleDropdownChange(e, "company")} value={selectedOptions.company}>
                <option value="" disabled hidden>Company</option>
                <option value="featured">Featured</option>
                <option value="JBL">JBL</option>
                <option value="Sony">Sony</option>
                <option value="Boat">Boat</option>
                <option value="Zebronics">Zebronics</option>
                <option value="Marshall">Marshall</option>
                <option value="Ptron">Ptron</option>
              </select>
            </div>
            <div className={styles.dropdown}>
              <select onChange={(e) => handleDropdownChange(e, "color")} value={selectedOptions.color}>
                <option value="" disabled hidden>Color</option>
                <option value="featured">Featured</option>
                <option value="blue">Blue</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="brown">Brown</option>
              </select>
            </div>
            <div className={styles.dropdown}>
              <select onChange={(e) => handleDropdownChange(e, "price")} value={selectedOptions.price}>
                <option value="" disabled hidden>Price</option>
                <option value="featured">Featured</option>
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-10000">₹1,000 - ₹10,000</option>
                <option value="10000-20000">₹10,000 - ₹20,000</option>
              </select>
            </div>
          </div>
          <div className={styles.rightSection}>
            <span>Sort by</span> {/* Heading name */}
            <select>
              <option value="featured">Featured</option>
              <option value="priceLowest">Price: Lowest</option>
              <option value="priceHighest">Price: Highest</option>
              <option value="nameAZ">Name: (A-Z)</option>
              <option value="nameZA">Name: (Z-A)</option>
            </select>
          </div>
        </div>

 {/* Product Listing */}
 <div className={styles.productList}>
          {products.map((product, index) => (
            <div key={index} className={styles.productCard}>
              <div className={styles.productImage}>
                <img src={product.images[0]} alt={product.name} />
              </div>
              <h3>{product.name}</h3>
              <p>Company: {product.brand}</p>
              <p>Price: {product.price}</p>
              <p>Color: {product.color}</p>
              <p>Type: {product.type}</p>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          Musicart | All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Home;

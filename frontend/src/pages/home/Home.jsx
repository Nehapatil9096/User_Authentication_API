import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import LogoutButton from "/src/components/LogoutButton"; // Import LogoutButton component

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listView, setListView] = useState(false); // State to track list view

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

// Function to toggle between grid and list view
const toggleListView = () => {
  setListView(!listView);
};
  
  return (
    <div className={styles.container}>
      <div className={styles.home}>
        {/* Logout Button */}
        <div className={styles.logoutButtonContainer}>
        <LogoutButton /> {/* Include LogoutButton component */}
        </div>    

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
        <div className={styles.listViewToggle}>
          <button onClick={toggleListView}>
            {listView ? "Grid View" : "List View"}
          </button>
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
        <div className={`${styles.productList} ${listView ? styles.listView : styles.gridView}`}>
          {products.map((product, index) => (
            <Link key={index} to={`/product/ProductDetails/${product._id}`}>
              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.images[0]} alt={product.name} />

                </div>
                <img src="cart.png" className={styles.cartIcon} alt="Add to Cart" />

                <div className={styles.productDetails}>
                  <h3>{product.name}</h3>
                  <p>Company: {product.brand}</p>
                  <p>Price: {product.price}</p>
                  <p>Color: {product.color}</p>
                  <p>Type: {product.type}</p>
                </div>
              </div>
            </Link>
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
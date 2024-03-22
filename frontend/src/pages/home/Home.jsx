import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import LogoutButton from "/src/components/LogoutButton";
import offerImage from "/Rectangle 3.png";
import feedbackIcon from "/feedback.png";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listView, setListView] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    headphoneType: "",
    company: "",
    color: "",
    price: "",
    sortBy: "featured" // Default sorting option
  });
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedOptions]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/users/products/search?q=${searchQuery}&sortBy=${selectedOptions.sortBy}&headphoneType=${selectedOptions.headphoneType}&company=${selectedOptions.company}&color=${selectedOptions.color}&price=${selectedOptions.price}`);
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

  function handleDropdownChange(event, dropdownName) {
    setSelectedOptions({
      ...selectedOptions,
      [dropdownName]: event.target.value
    });
  }

  // Function to switch to grid view
  const switchToGridView = () => {
    setListView(true);
  };

  // Function to switch to list view
  const switchToListView = () => {
    setListView(false);
  };
  const handleFeedbackSubmit = async () => {
    try {
      const response = await fetch("/api/users/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: feedbackType,
          text: feedbackText
        }),
      });
  
      if (response.ok) {
        console.log("Feedback submitted successfully");
        // Reset feedback fields or close the feedback popup
        setShowFeedbackPopup(false);
        setFeedbackType("");
        setFeedbackText("");
      } else {
        console.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };
  


  return (
    <div className={styles.container}>
      <div className={styles.home}>
        {/* Logout Button */}
        <div className={styles.logoutButtonContainer}>
          <LogoutButton />
        </div>

        {/* Navigation Bar */}
        <div className={styles.navbar}>
          <div className={styles.leftSection}>
            <span>User Mob. Number</span>
          </div>
          <div className={styles.middleSection}>
          <img src={offerImage} alt="Offer" style={{   flex: 1
,width: "100vh", height: "100px" ,marginRight:"100px"}} />

            <span>Get 50% off on selected items | Shop Now</span>
          </div>
        </div>

        {/* Menu Bar */}
        <div className={styles.menubar}>
          <div className={styles.leftSection}>
            <span>Musicart</span>
            <span>Home</span>
            <Link to="/invoices" className={styles.invoiceLink}>Invoice</Link>
          </div>
          <div className={styles.rightSection}>
            <span>Cart</span>
            <div className={styles.userCircle}>U</div>
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
            <button onClick={switchToGridView}>Grid View</button>
            <button onClick={switchToListView}>List View</button>
          </div>
          <div className={styles.dropdowns}>
            <div className={styles.dropdown}>
              <select id="headphoneType" onChange={(e) => handleDropdownChange(e, "headphoneType")} value={selectedOptions.headphoneType}>
                <option value="" disabled hidden>Headphone type</option>
                <option value="In-ear headphone">In-ear headphone</option>
                <option value="On-ear headphone">On-ear headphone</option>
                <option value="Over-ear headphone">Over-ear headphone</option>
              </select>
            </div>
            <div className={styles.dropdown}>
              <select onChange={(e) => handleDropdownChange(e, "company")} value={selectedOptions.company}>
                <option value="" disabled hidden>Company</option>
                <option value="JBL">JBL</option>
                <option value="Sony">Sony</option>
                <option value="boAt">Boat</option>
                <option value="ZEBRONICS">Zebronics</option>
                <option value="Marshall">Marshall</option>
                <option value="PTron">Ptron</option>
              </select>
            </div>
            <div className={styles.dropdown}>
              <select onChange={(e) => handleDropdownChange(e, "color")} value={selectedOptions.color}>
                <option value="" disabled hidden>Color</option>
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Brown">Brown</option>
              </select>
            </div>
            <div className={styles.dropdown}>
              <select onChange={(e) => handleDropdownChange(e, "price")} value={selectedOptions.price}>
                <option value="" disabled hidden>Price</option>
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-10000">₹1,000 - ₹10,000</option>
                <option value="10000-20000">₹10,000 - ₹20,000</option>
              </select>
            </div>
          </div>
          <div className={styles.rightSection}>
            <span>Sort by</span>
            <select onChange={(e) => handleDropdownChange(e, "sortBy")} value={selectedOptions.sortBy}>
              <option value="featured">Featured</option>
              <option value="priceLowest">Price: Lowest</option>
              <option value="priceHighest">Price: Highest</option>
              <option value="nameAZ">Name: (A-Z)</option>
              <option value="nameZA">Name: (Z-A)</option>
            </select>
          </div>
        </div>

        <div className={styles.feedbackButton} onClick={() => setShowFeedbackPopup(true)}>
        <img src={feedbackIcon} alt="Feedback" />
      </div>

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <div className={styles.feedbackPopup}>
          <div className={styles.popupContent}>
            <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)} required>
              <option value="" disabled>Select type of feedback</option>
              <option value="Bugs">Bugs</option>
              <option value="Feedback">Feedback</option>
              <option value="Query">Query</option>
            </select>
            <textarea
              placeholder="Enter your feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
            <button onClick={handleFeedbackSubmit}>Submit</button>
            {feedbackSubmitted && <p>Feedback submitted successfully!</p>}
          </div>
        </div>
      )}
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
        <div className={styles.bottomBar}>
          Musicart | All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Home;

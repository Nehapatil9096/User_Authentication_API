import React, { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from 'axios'; // Import axios
import LogoutButton from "/src/components/LogoutButton";
import offerImage from "/Rectangle 3.png";
import feedbackIcon from "/feedback.png";
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/project_logo.png";
import image from "/image.png"; // Update the path accordingly


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
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0); // State for cart count

  useEffect(() => {
    fetchUserData();
    fetchCartCount(); // Fetch initial cart count
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedOptions]);

  const fetchProducts = async () => {
    try {
      // Prepare filter parameters
      const filters = {
        q: searchQuery,
        sortBy: selectedOptions.sortBy,
        headphoneType: selectedOptions.headphoneType === "Featured" ? "" : selectedOptions.headphoneType,
        company: selectedOptions.company === "Featured" ? "" : selectedOptions.company,
        color: selectedOptions.color === "Featured" ? "" : selectedOptions.color,
        price: selectedOptions.price === "Featured" ? "" : selectedOptions.price
      };
  
      // Remove empty filter parameters
      const queryParams = Object.entries(filters)
        .filter(([key, value]) => value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
  
      const response = await fetch(`/api/users/products/search?${queryParams}`);
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
    const selectedValue = event.target.value;
    // Check if the selected option is "Featured"
    const newValue = selectedValue === "Featured" ? "" : selectedValue;
  
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
  const handleViewCart= () => {
      navigate('/mycart');
  };
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const feedbackPopupRef = useRef(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
    // Function to handle click outside the popup
    const handleClickOutsidePopup = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
      if (feedbackPopupRef.current && !feedbackPopupRef.current.contains(event.target)) {
        setShowFeedbackPopup(false);
      }
    };
  
    // Add event listener when the component mounts
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutsidePopup);
      return () => {
        document.removeEventListener("mousedown", handleClickOutsidePopup);
      };
    }, []);

     // Function to fetch cart count from the server
const fetchCartCount = async () => {
    try {
      const response = await axios.get('/api/users/cart/count');
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };
const handleAddToCart = (event, product) => {
      event.stopPropagation(); // Stop event propagation

      if (product) {
        fetch('/api/users/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product._id, quantity: 1 }), // Adding 1 quantity by default
        })
        .then(response => {
          if (response.ok) {
            console.log('Product added to cart:', product);
            setCartCount(prevCount => prevCount + 1); // Increment cart count
            setAddedToCart(true); // Update addedToCart state to true
          } else {
            console.error('Failed to add product to cart');
          }
        })
        .catch(error => console.error('Error adding product to cart:', error));
      }
    };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
      <div className={styles.leftSection}>
          <img src={phoneCallIcon} alt="Phone call" />
          <span>912121131313</span>
        </div>
        <div className={styles.headerContent}>
        <span>Get 50% off on selected items&nbsp; | &nbsp; Shop Now</span>
        </div>
      </header>

      {/* HOME content */}
      <div className={styles.home}>
       
   {/* Menu Bar */}
      <div className={styles.menubar}>
      <div className={styles.leftSection}>

          <div className={styles.menuItem}>
            <img src={projectLogo} alt="Project Logo" />
          </div>
          <div className={styles.menuItem}>
            <Link to="/home"className={styles.homeLink}>Home</Link>
          </div>
          <div className={styles.menuItem}>
          <Link to="/invoices" className={styles.invoiceLink}>Invoice</Link>
          </div>
        </div>
      <div className={styles.rightSection}>

      <div className={styles.menuItem}>
  <button className={styles.button}onClick={handleViewCart}>
    <img src="/cart_menu.png" alt="Cart_Menu" />
    <span>View Cart &nbsp;  {cartCount}</span>
  </button>
</div>
          <div className={styles.menuItem}>
          <div className={styles.userCircle} onClick={togglePopup}>
  {username ? username.split(' ').map(word => word.charAt(0).toUpperCase()).join('') : 'U'}
</div>
            {showPopup && (
        <div ref={popupRef}  className={styles.popup}>
    <div>{username ? username.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : ''}</div>
    <div className={styles.separator}></div> {/* Gray line separator */}
          <div>
          <LogoutButton />
          </div>
        </div>
      )}
    
            <span>Profile</span>
          </div>
        </div>
        </div>

{/* Offer Container */}
   
        <div className={`${styles.offerContainer} ${styles.fixed}`}>
  <img src={offerImage} alt="Offer" className={styles.offerImage} />
  <div className={styles.offerImageContainer}>
    <img src={image} alt="Image1" className={styles.image} />
  </div>
  <span className={styles.offerText}>
  <img src="Grab.png" alt="Grab Offer" />

  </span>
</div>



        {/* Search Bar */}
        <div className={styles.searchBar}>
  <img src="/search.png" alt="Search Icon" className={styles.searchIcon} />
  <input
    type="text"
    placeholder="Search by Product Name"
    value={searchQuery}
    onChange={handleSearchInputChange}
  />
</div>

{/*Sorting bar */}
<div className={styles.sortingBar}>
<div className={styles.leftSection}>

  <div className={styles.listViewToggle}>
  <button onClick={switchToGridView}>
      <img src={listView ? "/grid.png" : "/grid_view_not.png"} alt="Grid View" className={styles.gridIcon} />
    </button>
    <button onClick={switchToListView}>
    {listView ? (
      <img src="/list_not.png" alt="List View" className={styles.listIcon} />
    ) : (
      <img src="/list_view.png" alt="List View" className={styles.listIcon} />
    )}
  </button>
  </div>
          <div className={styles.dropdowns}>
            <div className={styles.dropdown}>
              <select id="headphoneType" onChange={(e) => handleDropdownChange(e, "headphoneType")} value={selectedOptions.headphoneType}>
                <option value="" disabled hidden>Headphone type</option>
                <option value="Featured">Featured</option> {/* Default option */}
                <option value="In-ear headphone">In-ear headphone</option>
                <option value="On-ear headphone">On-ear headphone</option>
                <option value="Over-ear headphone">Over-ear headphone</option>
              </select>
            </div>
            <div className={styles.dropdown}>
              <select onChange={(e) => handleDropdownChange(e, "company")} value={selectedOptions.company}>
                <option value="" disabled hidden>Company</option>
                <option value="Featured">Featured</option> {/* Default option */}
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
                <option value="Featured">Featured</option> {/* Default option */}
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Brown">Brown</option>
              </select>
            </div>
            <div className={styles.dropdown}>
              <select onChange={(e) => handleDropdownChange(e, "price")} value={selectedOptions.price}>
                <option value="" disabled hidden>Price</option>
                <option value="Featured">Featured</option> {/* Default option */}
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-10000">₹1,000 - ₹10,000</option>
                <option value="10000-20000">₹10,000 - ₹20,000</option>
              </select>
            </div>
          </div>
          </div>
          <div className={styles.rightSection}>
            <span></span>
            <select onChange={(e) => handleDropdownChange(e, "sortBy")} value={selectedOptions.sortBy}className={styles.featuredSection}>
              <option value="featured">Sort by : Featured</option>
              <option value="priceLowest">Price: Lowest</option>
              <option value="priceHighest">Price: Highest</option>
              <option value="nameAZ">Name: (A-Z)</option>
              <option value="nameZA">Name: (Z-A)</option>
            </select>
          </div>
        </div>

       

        {/* Feedback Popup */}
        <div className={styles.feedbackButton} onClick={() => setShowFeedbackPopup(true)}>
          <img src={feedbackIcon} alt="Feedback" />
        </div>
        {showFeedbackPopup && (
          <div  className={styles.feedbackPopup}>
            <div ref={feedbackPopupRef} className={styles.popupContent}>
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
        {/* PRODUCT view*/}
        <div className={`${styles.productList} ${listView ? styles.listView : styles.gridView}`}>
      {products.map((product, index) => (
        <Link key={index}className={styles.productRow} to={`/product/ProductDetails/${product._id}`}>
          <div className={styles.productCard}>
            <div className={styles.productImageContainer}>
             
              <img src={product.images[0]} alt={product.name} className={styles.productImage} />
              <button onClick={(e) => { e.preventDefault(); handleAddToCart(e, product); }} className={styles.cartButton}>
    <img src="cartp.png" className={styles.cartIcon} alt="Add to Cart" />
</button>


            </div>
            <div className={styles.productDetails}>
              <h3>{product.name}</h3>
              <p>Price: {product.price}</p>
              <p>{product.color} | {product.type}</p>
            </div>
          </div>
        </Link>
      ))}
        </div>
        <div className={styles.logoutButtonContainer}>
          <LogoutButton />
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Musicart | All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;

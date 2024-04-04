import React, { useState, useEffect, useRef } from "react";
import styles from "./HomeMobile.module.css";
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from 'axios';
import LogoutButton from "/src/components/LogoutButton";
import offerImage from "/Rectangle 3.png";
import feedbackIcon from "/feedback.png";
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/project_logo.png";
import image from "/image.png";
import { toast } from 'react-toastify';
import useLogout from "/src/hooks/useLogout";

const HomeMobile = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listView, setListView] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({
    headphoneType: "",
    company: "",
    color: "",
    price: "",
    sortBy: "featured"
  });
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [feedbackTypeEmpty, setFeedbackTypeEmpty] = useState(false);
  const [feedbackTextEmpty, setFeedbackTextEmpty] = useState(false);
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
    fetchUserData();
    fetchCartCount();
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
      const filters = {
        q: searchQuery,
        sortBy: selectedOptions.sortBy,
        headphoneType: selectedOptions.headphoneType === "Featured" ? "" : selectedOptions.headphoneType,
        company: selectedOptions.company === "Featured" ? "" : selectedOptions.company,
        color: selectedOptions.color === "Featured" ? "" : selectedOptions.color,
        price: selectedOptions.price === "Featured" ? "" : selectedOptions.price
      };
  
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

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  function handleDropdownChange(event, dropdownName) {
    const selectedValue = event.target.value;
    const newValue = selectedValue === "Featured" ? "" : selectedValue;
  
    setSelectedOptions({
      ...selectedOptions,
      [dropdownName]: event.target.value
    });
  }

  const switchToGridView = () => {
    setListView(true);
  };

  const switchToListView = () => {
    setListView(false);
  };

  const handleFeedbackSubmit = async () => {
     if (!feedbackType || !feedbackText) {
      if (!feedbackType) setFeedbackTypeEmpty(true);
      if (!feedbackText) setFeedbackTextEmpty(true);
      return;
    }
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
        setShowFeedbackPopup(false);
        setFeedbackType("");
        setFeedbackText("");
      } else {
        console.error("Failed to submit feedback");
      }

      setShowFeedbackPopup(false);
      setFeedbackType("");
      setFeedbackText("");
      setFeedbackTypeEmpty(false);
      setFeedbackTextEmpty(false);

      toast.success("Feedback submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const openFeedbackPopup = () => {
    setShowFeedbackPopup(true);
    setFeedbackTypeEmpty(false);
    setFeedbackTextEmpty(false);
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

  const handleClickOutsidePopup = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
    if (feedbackPopupRef.current && !feedbackPopupRef.current.contains(event.target)) {
      setShowFeedbackPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsidePopup);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePopup);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/api/users/cart/count');
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();

    if (product) {
      fetch('/api/users/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      })
      .then(response => {
        if (response.ok) {
          console.log('Product added to cart:', product);
          setCartCount(prevCount => prevCount + 1);
        } else {
          console.error('Failed to add product to cart');
        }
      })
      .catch(error => console.error('Error adding product to cart:', error));
    }
  };

  const isMobileDevice = () => {
    return window.innerWidth <= 768;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
      <div className={styles.searchBar}>
  <img src="/search.png" alt="Search Icon" className={styles.searchIcon} />
  <input
    type="text"
    placeholder="Search Musicart"
    value={searchQuery}
    onChange={handleSearchInputChange}
  />
</div>
      </header>

      {/* HOME content */}
      <div className={styles.home}>
        {/* Offer Container */}
        <div className={`${styles.offerContainer} ${styles.fixed}`}>
          <img src={offerImage} alt="Offer" className={styles.offerImage1} />
          <div className={styles.offerImageContainer}>
            <img src={image} alt="Image1" className={styles.image} />
          </div>
          <span className={styles.offerText}>
            <img src="Grab.png" alt="Grab Offer" />
            <button className={styles.button} onClick={handleViewCart}>
                  <span>Buy Now
</span>
                </button>
          </span>
        </div>

        {/* Sorting bar */}
        <div className={styles.sortingBar}>
          <div className={styles.leftSection}>
            

            <div className={styles.dropdowns}>
            <div className={styles.dropdown}>

            <span></span>
            <select onChange={(e) => handleDropdownChange(e, "sortBy")} value={selectedOptions.sortBy}className={styles.featuredSection}>
              <option value="featured">Sort by : Featured</option>
              <option value="priceLowest">Price: Lowest</option>
              <option value="priceHighest">Price: Highest</option>
              <option value="nameAZ">Name: (A-Z)</option>
              <option value="nameZA">Name: (Z-A)</option>
            </select>
          </div>
            
              <div className={styles.dropdown}>
                <select id="headphoneType" onChange={(e) => handleDropdownChange(e, "headphoneType")} value={selectedOptions.headphoneType}>
                  <option value="" disabled hidden>Headphone type</option>
                  <option value="Featured">Featured</option>
                  <option value="In-ear headphone">In-ear headphone</option>
                  <option value="On-ear headphone">On-ear headphone</option>
                  <option value="Over-ear headphone">Over-ear headphone</option>
                </select>
              </div>
              <div className={styles.dropdown}>
                <select onChange={(e) => handleDropdownChange(e, "company")} value={selectedOptions.company}>
                  <option value="" disabled hidden>Company</option>
                  <option value="Featured">Featured</option>
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
                  <option value="Featured">Featured</option>
                  <option value="Blue">Blue</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Brown">Brown</option>
                </select>
              </div>
              <div className={styles.dropdown}>
                <select onChange={(e) => handleDropdownChange(e, "price")} value={selectedOptions.price}>
                  <option value="" disabled hidden>Price</option>
                  <option value="Featured">Featured</option>
                  <option value="0-1000">₹0 - ₹1,000</option>
                  <option value="1000-10000">₹1,000 - ₹10,000</option>
                  <option value="10000-20000">₹10,000 - ₹20,000</option>
                </select>
              </div>
             
            </div>
          </div>
          
        </div>

        

        {/* Product view */}
        <div className={`${styles.productList} ${listView ? styles.gridView : styles.listView}`}>
          {products.map((product, index) => (
            <Link key={index} className={styles.productRow}>
              <div className={styles.productContainer}>
                <div className={styles.productImageContainer}>
                  {!listView ? (
                    <img src={product.images[0]} alt={product.name} className={styles.productImage} />
                  ) : (
                    <Link to={`/product/ProductDetails/${product._id}`}>
                      <img src={product.images[0]} alt={product.name} className={styles.productImage} />
                    </Link>
                  )}
                  </div>
                  <div>
                  {username && (
                    <button onClick={(e) => { e.preventDefault(); handleAddToCart(e, product); }} className={styles.cartButton}>
                      <img src="cartp.png" className={styles.cartIcon} alt="Add to Cart" />
                    </button>
                  )}
                </div>
                <div className={styles.productDetails}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>Price: {product.price}</p>
                  <p className={styles.productInfo}>{product.color} | {product.type}</p>
                  {!listView && (
                    <div>
                      <p className={styles.shortinfo}>{product.shortinfo}</p>
                      <Link to={`/product/ProductDetails/${product._id}`}>
                        <button className={styles.detailsButton}>Details</button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {username && (
        <div ref={popupRef}>
          <LogoutButton />
        </div>
      )}



      {/* Bottom menu bar */}
      <div className={styles.bottomMenu}>
        <Link to="/" className={styles.mbmenuItem}>
          <img src="./mbhome.png" alt="Home" className={styles.menuIcon} />
          <div className={styles.menuLine}></div>
        </Link>

        {username ? (
    <div className={styles.mbmenuItem} onClick={handleViewCart}>
      <img src="./Mbcart.png" alt="View Cart" className={styles.menuIcon} />
      <div className={styles.menuLine}></div>
      {cartCount >= 0 && <span className={styles.cartCount}>{cartCount}</span>}
    </div>
  ) : (
    <Link to="/login" className={styles.mbmenuItem}>
      <img src="./Mbcart.png" alt="View Cart" className={styles.menuIcon} />
      <div className={styles.menuLine}></div>
    </Link>
  )}

{username ? (
    <Link to="/invoices" className={styles.mbmenuItem}>
      <img src="/mbinvoice.png" alt="Invoice" className={styles.menuIcon} />
      <div className={styles.menuLine}></div>
    </Link>
  ) : (
    <Link to="/login" className={styles.mbmenuItem}>
      <img src="/mbinvoice.png" alt="Invoice" className={styles.menuIcon} />
      <div className={styles.menuLine}></div>
    </Link>
  )}

        <div className={styles.mbmenuItem}>
          {username ? (
        <button ref={logoutButtonRef} type="button" className={styles.mblogoutbutton}>
        <img src="./mblogout.png" alt="Logout" className={styles.menuIcon} />
        </button>          
        ) : (
            <Link to="/login" className={styles.mbmenuItem}>
              <img src="./mblogin.png" alt="Login" className={styles.menuIcon} />
              <div className={styles.menuLine}></div>
            </Link>
          )}
        </div>
      </div>

      
 
    </div>
  );
};

export default HomeMobile;

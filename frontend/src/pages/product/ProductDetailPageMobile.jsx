import React, { useEffect, useState, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { FaStar, FaRegStar } from 'react-icons/fa';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/Mlogo.png";
import { Link } from "react-router-dom";
import axios from 'axios';
import styles from './ProductDetailPageMobile.module.css';
import LogoutButton from "/src/components/LogoutButton";
import useLogout from "/src/hooks/useLogout";


const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0); // State for cart count
  const [username, setUsername] = useState('');

  //logout------------------------------
  const logoutButtonRef = useRef(null);
 
  
  
    const toggleImageSize = (index) => {
      setSelectedImage(index);
    };

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



  //----------------------------------------
  useEffect(() => {
    fetchUserData(); // Fetch user data when component mounts
  }, []);

  // Function to fetch user data including username
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setUsername(response.data.username); // Set fetched username to state
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`/api/users/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [productId]);

   
     // Function to fetch cart count from the server
     const fetchCartCount = async () => {
      try {
        const response = await axios.get('/api/users/cart/count');
        setCartCount(response.data.count);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

  useEffect(() => {
    fetchCartCount(); // Fetch initial cart count
  }, []);

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} color="#ffc107" />);
      } else {
        stars.push(<FaRegStar key={i} color="#e4e5e9" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    if (!username) {
      navigate('/login');
      return;
    }
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
            setAddedToCart(true);
            setCartCount(prevCount => prevCount + 1); // Increment cart count
          } else {
            console.error('Failed to add product to cart');
          }
        })
        .catch(error => console.error('Error adding product to cart:', error));
    }
  };


  const handleBuyNow = () => {
    if (!username) {
      navigate('/login');
      return;
    }
    if (addedToCart) {
      navigate('/mycart');
    } else {
      handleAddToCart();
      navigate('/mycart');
    }
  };

  

  if (!product) {
    return <div>Loading...</div>;
  }
  const handleViewCart = () => {
    if (!username) {
      navigate('/login');
      return;
    }
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
      <Link to="/productdetails" >
        <img src="/Mback.png" alt="Back to Home" className={styles.homeButtonImage} />
</Link>
 
        <button onClick={handleBuyNow} className={styles.buyNowButton1}>Buy Now</button>

        <div className={styles.menuItem}>
        </div>
      

        <div className={styles.contentWrapper}>
 
 

        <div className={styles.carouselContainer}>
        <Carousel
        showArrows={true}
        showIndicators={true}
        showThumbs={false} // Set this to false to hide the thumbnails
        selectedItem={selectedImage}
        onChange={(index) => setSelectedImage(index)}
      >
        {product.images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Product ${index + 1}`} onClick={() => toggleImageSize(index)} 
                    className="carouselImage" 
                    />
          </div>
        ))}
      </Carousel>
    </div>


          <div className={styles.productDetailsContainer}>
            <div className={styles.productDetails}>
              <h2 className={styles.name}>{product.name}</h2>
              <p>{renderStarRating(product.rating)} (50 Customer reviews)</p>
              <p className={styles.price}>Price: {product.price}</p>
              <p className={styles.color}> {product.color} <span>|</span> {product.type}</p>
              <p>About this item</p>
              <ul className={styles.aboutList}>
                {product.about.split('.').filter(Boolean).map((phrase, index) => (
                  <li key={index}>{phrase.trim()}</li>
                ))}
              </ul>
              <p className={styles.available}><strong>Available</strong> - In stock</p>
              <p className={styles.company}><strong>Brand</strong>- {product.brand}</p>
              <div className={styles.buttons}>
                <div className={styles.buttonsContainer}>
                  <button onClick={handleAddToCart} className={styles.cartButton}>Add to Cart</button>
                  <button onClick={handleBuyNow} className={styles.buyNowButton}>Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom menu bar */}
      <div className={styles.bottomMenu}>
        <Link to="/" className={styles.mbmenuItem}>
          <img src="/mbhome.png" alt="Home" className={styles.menuIcon} />
          <div className={styles.menuLine}></div>
        </Link>

        {username ? (
    <div className={styles.mbmenuItem} onClick={handleViewCart}>
      <img src="/Mbcart.png" alt="View Cart" className={styles.menuIcon} />
      <div className={styles.menuLine}></div>
      {cartCount >= 0 && <span className={styles.cartCount}>{cartCount}</span>}
    </div>
  ) : (
    <Link to="/login" className={styles.mbmenuItem}>
      <img src="/Mbcart.png" alt="View Cart" className={styles.menuIcon} />
      <div className={styles.menuLine}></div>
    </Link>
  )}
      

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

export default ProductDetailPage;

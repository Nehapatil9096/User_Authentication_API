import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './MycartMobile.module.css';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/Mlogo.png";
import LogoutButton from "/src/components/LogoutButton";
import useLogout from "/src/hooks/useLogout";
import { useParams, useNavigate } from 'react-router-dom';

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  //logout------------------------------
  const logoutButtonRef = useRef(null);
 
  const handleViewCart= () => {
    navigate('/mycart');
};
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  useEffect(() => {
    fetchUserData();
    fetchCartCount();

  }, []);

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

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/api/users/cart/count');
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  //----------------------------------------

  const parsePrice = (priceString) => {
    const numericValue = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericValue);
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get('/api/users/cart');
      setCart(response.data.cart);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setLoading(false);
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


  const fetchProductDetails = async (productId) => {
    try {
      if (!productId) {
        console.error('Product ID is undefined');
        return null;
      }
      const response = await axios.get(`/api/users/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  const calculateTotalAmount = async (cart) => {
    const promises = cart.map(item => fetchProductDetails(item.product._id));
    const products = await Promise.all(promises);
    return products.reduce((total, product, index) => {
      if (product) {
        const productPrice = parsePrice(product.price);
        return total + (productPrice * cart[index].quantity);
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    if (!loading) {
      calculateTotalAmount(cart).then(total => {
        setTotalAmount(total);
      }).catch(error => {
        console.error("Error calculating total amount:", error);
      });
    }
  }, [cart, loading]);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const response = await axios.post('/api/users/cart/qty', {
        productId: productId,
        quantity: newQuantity
      });
      if (response.status === 200) {
        fetchCartData(); // Refresh cart data after update
      } else {
        console.error('Failed to update cart quantity');
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      // Show toast message if cart is empty
      alert('Please add at least one product to the cart before proceeding to place an order.');
      return;
    }
    // Proceed with placing the order
    // Implement your logic for placing the order here
  };

  return (
    <div className={styles.mycartContainer}>
      {/* Header */}
      <header className={styles.header}>
  <div className={styles.leftSection}>
  <img src={projectLogo} alt="Project Logo" />
  </div>
  
</header>

      {/* Navigation */}
      <div className={styles.home}>

      <Link to="/productdetails" >
        <img src="/Mback.png" alt="Back to Home" className={styles.homeButtonImage} />
</Link>


        {/* Cart Header */}
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}></h2>
        </div>

        {/* Cart Content */}
        <div className={styles.cartContent}>
          {/* Item details */}
          <div className={styles.itemDetails}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {cart.length === 0 ? (
                  <div className={styles.emptyCartMessage}>
                    <p className={styles.emptyCartText}>Your cart is empty.</p>
                  </div>
                ) : (
                  <div className={styles.cartItemsContainer}>
                    {cart.map((item, index) => (
                      <CartItem key={index} item={item} fetchProductDetails={fetchProductDetails} onQuantityChange={handleQuantityChange} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Product price details */}
          <div className={styles.priceDetails}>
            <h3>PRICE DETAILS</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {cart.length > 0 ? (
                  <>
                  
                  <div className={styles.priceRow}>
            <p className={styles.priceLabel}>Total MRP</p>
            <p className={styles.priceValue}>₹{totalAmount.toFixed(2)}</p>
          </div>               
          <div className={styles.priceRow}>
            <p className={styles.priceLabel}>Discount on MRP</p>
            <p className={styles.priceValue}>₹0</p>
          </div>                  
          <div className={styles.priceRow}>
            <p className={styles.priceLabel}>Convenience Fee</p>
            <p className={styles.priceValue}>₹45</p>
          </div>            
                  <div className={styles.priceAmount}>
                  <div className={styles.priceRow1}>
            <p className={styles.priceLabel1}><b>Total Amount</b></p>
            <p className={styles.priceValue1}>₹{(totalAmount + 45).toFixed(2)}</p>
          </div>
                      <Link to="/checkout">
                        <button className={styles.placeOrderButton}>Place Order</button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                   <div className={styles.priceRow}>
            <p className={styles.priceLabel}>Total MRP:</p>
            <p className={styles.priceValue}>₹0</p>
          </div>
          <div className={styles.priceRow}>
            <p className={styles.priceLabel}>Discount on MRP:</p>
            <p className={styles.priceValue}>₹0</p>
          </div>
          <div className={styles.priceRow}>
            <p className={styles.priceLabel}>Convenience Fee:</p>
            <p className={styles.priceValue}>₹0</p>
          </div>
          <div className={styles.priceRow1}>
            <p className={styles.priceLabel1}>Total Amount:</p>
            <p className={styles.priceValue1}>₹{(totalAmount ).toFixed(2)}</p>
          </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Total product items and total MRP */}
        <div className={styles.totalItemsMRP}>
          <p>
           <span className={styles.items}> {cart.length} Items </span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </p>
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

const CartItem = ({ item, fetchProductDetails, onQuantityChange }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(item.quantity);
  const parsePrice = (priceString) => {
    const numericValue = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericValue);
  };

  useEffect(() => {
    const getProductDetails = async () => {
      if (!item.product) {
        console.error('Product ID is undefined');
        return;
      }
      const productDetails = await fetchProductDetails(item.product._id);
      setProduct(productDetails);
      setLoading(false);
    };

    getProductDetails();
  }, [fetchProductDetails, item.product]);

  const handleQuantitySelect = (event) => {
    const newQuantity = parseInt(event.target.value);
    setSelectedQuantity(newQuantity);
    onQuantityChange(item.product._id, newQuantity);
  };

  return (
    <div className={styles.cartItem}>
      {loading ? (
        <p>Loading product details...</p>
      ) : (
        <>
          <div className={styles.cartItemColumn}>
            <img src={product.images[0]} alt={product.name} className={styles.productImage} />
          </div>
          <div className={styles.cartItemColumn}>
            <p>{product.name}</p>
            <p>Color {product.color}</p>
            <p>In Stock</p>
            <p>{product.price}</p>
          </div>
            
         
            
        </>
      )}

    </div>
  );
};

export default MyCart;

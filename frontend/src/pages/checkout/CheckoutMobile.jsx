import React, { useState, useEffect,useRef } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '/src/components/LogoutButton';
import styles from './CheckoutMobile.module.css';
import axios from 'axios'; // Import axios
import { useParams, useNavigate } from 'react-router-dom';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/Mlogo.png";
import image from "/image.png"; // Update the path accordingly
import useLogout from "/src/hooks/useLogout";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0); 
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [username, setUsername] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track selected product
  const navigate = useNavigate();

  //logout------------------------------
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

  const handleViewCart= () => {
    navigate('/mycart');
};

  //----------------------------------------
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const placeOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert("Please enter your delivery address.");
      return;
    }
  
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
  
    try {
      const response = await axios.post('/api/users/order', {
        userId: 'userId', // pass actual user ID here
        deliveryAddress,
        paymentMethod,
        cart,
        totalAmount,
        deliveryAmount: 45, // assuming delivery amount is fixed
      });
      console.log(response.data.message); // handle success message
      navigate('/OrderConfirmation');
    } catch (error) {
      console.error('Error placing order:', error.response.data.error); // handle error
    }
  };

  const handleDeliveryAddressChange = (event) => {
    setDeliveryAddress(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
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

  const parsePrice = (priceString) => {
    const numericValue = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericValue);
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
    fetchUserData();
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

  const handleProductClick = async (productId) => {
    const productDetails = await fetchProductDetails(productId);
    setSelectedProduct(productDetails);
  };

  useEffect(() => {
    if (cart.length > 0) {
      const firstProductId = cart[0].product._id;
      handleProductClick(firstProductId);
    }
  }, [cart]);
  
  return (
    <div className={styles.checkoutContainer}>
      {/* Header */}
      <header className={styles.header}>
  <div className={styles.leftSection}>
  <img src={projectLogo} alt="Project Logo" />
  </div>
  
</header>

      <div className={styles.home}>

      <Link to="/mycart" className={styles.homeButton}>
        <img src="/Mback.png" alt="Back to Home" className={styles.homeButtonImage} />
</Link>
     


      <h1 className={styles.checkoutHeader}>Checkout</h1>

      <div className={styles.checkoutSections}>
      <div className={styles.leftColumn}>
  {/* Row 1 */}
  <div className={styles.row}>
    <div className={`${styles.column} ${styles.col1}`}>

      <span>1. Delivery Address</span>
    </div>
    <div className={styles.column}>
    <span className={styles.username}>{username}</span>
      <div className={styles.deliveryInputContainer}>
      <textarea 
          type="text" 
          placeholder="Add delivery address" 
          value={deliveryAddress} 
          onChange={handleDeliveryAddressChange} 
          className={styles.deliveryInput} 
        />
      </div>
    </div>
  </div>
  <div className={styles.line}></div> {/* Line between rows */}

  {/* Row 2 */}
<div className={styles.row}>
  <div className={`${styles.column} ${styles.col1}`}>
    <span>2. Payment Method</span>
  </div>
  <div className={styles.column}>
    <select value={paymentMethod} onChange={handlePaymentMethodChange}>
      <option value="" disabled hidden>Mode of payment</option>
      <option value="payOnDelivery">Pay on Delivery</option>
      <option value="upi">UPI</option>
      <option value="card">Card</option>
    </select>
  </div>
</div>




  <div className={styles.line}></div> {/* Line between rows */}

  {/* Row 3 */}
  <div className={styles.row}>
  <div className={`${styles.column} ${styles.col1}`}>
      <span>3. Review Items and Delivery</span>
    </div>
    <div className={styles.column}>
      <div className={styles.productImages}>
        
        {cart.map((item, index) => (
          <img
            key={index}
            src={item.product.images[0]}
            alt={item.product.name}
            className={styles.productImage}
            onClick={() => handleProductClick(item.product._id)}
          />
        ))}
      </div>
      {selectedProduct && (
        <div className={styles.selectedProductDetails}>
          <h4>{selectedProduct.name}</h4>
          <p className={styles.deliveryColor}>Color: {selectedProduct.color}</p>
          <p className={styles.deliveryText}>
  Estimated delivery:
  <br /> {/* Add a line break */}
  <span>Monday - FREE Standard Delivery</span>
</p>
        </div>     
      )}
    </div>   
  </div>

</div>


    
      </div>


<div className={styles.orderSummaryHorizontal}>
  <div className={styles.rightSection}>
    <button className={styles.placeOrderButton1} onClick={placeOrder}>
      Place Your Order
    </button>
    
  </div>
  <div className={styles.leftSection}>
  <div className={styles.flexContainer}>
  <p className={styles.greyText}>Items Total: ₹{totalAmount.toFixed(2)}</p>

  <p className={styles.greyText}>Delivery Amount: ₹45</p>
  <p className={styles.orderTotal}>
      Order Total: ₹{(totalAmount + 45).toFixed(2)}
    </p>
    <p className={styles.agreeText}>
      By placing your order, you agree to musicart's privacy notice and conditions of use.
    </p>
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

        <div className={styles.mbmenuItem} onClick={handleViewCart}>
          <img src="/Mbcart.png" alt="View Cart" className={styles.menuIcon} />
          <div className={styles.menuLine}></div>
        </div>

      

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

export default Checkout;

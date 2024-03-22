import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '/src/components/LogoutButton';
import styles from './Checkout.module.css';
import axios from 'axios'; // Import axios
import { useParams, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0); 
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('payOnDelivery');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      console.log('User profile data:', response.data); // Log the user profile data

      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const placeOrder = async () => {
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

  // Function to handle change in delivery address input
  const handleDeliveryAddressChange = (event) => {
    setDeliveryAddress(event.target.value);
  };

  // Function to handle change in payment method select
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // Function to fetch cart data from the backend
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

  // Function to fetch product details based on product ID
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

  // Function to parse the price string and extract the numerical value
  const parsePrice = (priceString) => {
    const numericValue = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericValue);
  };

  // Function to calculate total amount
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
    fetchUserData(); // Fetch user data when component mounts

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

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.navbar}>
        <div className={styles.leftSection}>
          <span>User Mob. Number</span>
        </div>
        <div className={styles.rightSection}>
          <Link to="/"><button>Home</button></Link>
          <LogoutButton />
        </div>
      </div>

      <h2 className={styles.pageTitle}>Musicart</h2>
      
      <Link to="/mycart"><button className={styles.backToCartButton}>Back to Cart</button></Link>

      <h3 className={styles.checkoutHeader}>Checkout</h3>

      <div className={styles.checkoutSections}>
        <div className={styles.leftColumn}>
          <h4>Delivery Address</h4>
          <span>{username}</span> {/* Display username here */}
          <input type="text" placeholder="Add delivery address" value={deliveryAddress} onChange={handleDeliveryAddressChange} />

          <h4>Payment Method</h4>
          <select value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="payOnDelivery">Pay on Delivery</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <h4>Review Items and Delivery</h4>
          {cart.map((item, index) => (
            <div key={index}>
<img
      src={item.product.images[0]}
      alt={item.product.name}
      style={{ width: '90px', height: '90px' }} // Adjust the width and height as needed
      onClick={() => fetchProductDetails(item.product._id)}
    />              <p>{item.product.name} - {item.product.color}</p>
            </div>
          ))}
          <p>Estimated delivery: Monday - Free Standard Delivery</p>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.orderSummaryBox}>
          <button className={styles.placeOrderButton} onClick={placeOrder}>Place Your Order</button>
            <p>By placing your order you agree to musicart privacy notice and conditions of use</p>

            <hr />
            
            <p>Order Summary</p>
            <p>Items Total: ₹{totalAmount.toFixed(2)}</p>
            <p>Delivery Amount: ₹45</p>
            <hr />
            <p className={styles.orderTotal}>Order Total: ₹{(totalAmount + 45).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className={styles.orderSummaryHorizontal}>
      <button className={styles.placeOrderButton} onClick={placeOrder}>Place Your Order</button>
        <p className={styles.orderTotal}>Order Total: ₹{(totalAmount + 45).toFixed(2)}</p>
        <p className={styles.agreeText}>By placing your order you agree to musicart privacy notice and conditions of use</p>
      </div>
    </div>
  );
};

export default Checkout;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '/src/components/LogoutButton';
import styles from './Checkout.module.css';
import axios from 'axios'; // Import axios
import { useParams, useNavigate } from 'react-router-dom';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/project_logo.png";
import image from "/image.png"; // Update the path accordingly

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0); 
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [username, setUsername] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track selected product
  const navigate = useNavigate();

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
          <img src={phoneCallIcon} alt="Phone call" />
          <span>912121131313</span>
        </div>
        <div className={styles.headerContent}>
        <span>Get 50% off on selected items&nbsp; | &nbsp; Shop Now</span>
        
        </div>
      </header>
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

   
        
          
        </div>
        </div>
     

        <div className={styles.menuItem}>
          <Link to="/mycart"><button className={styles.backToCartButton}>Back to Cart</button></Link>
    </div>

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
  <div className={styles.line}></div> {/* Line between rows */}

</div>











        <div className={styles.rightColumn}>

          <div className={styles.orderSummaryBox}>
            <button className={styles.placeOrderButton} onClick={placeOrder}>Place Your Order</button>
            <p className={styles.placeOrderText}>By placing your order you agree to musicart privacy</p>
             <p className={styles.placeOrderText}>notice and conditions of use</p>

            <hr />

            <h3>Order Summary</h3>
            <p>Items Total: ₹{totalAmount.toFixed(2)}</p>
            <p>Delivery Amount: ₹45</p>
            <hr />
            <h3 className={styles.orderTotal}>Order Total: ₹{(totalAmount + 45).toFixed(2)}</h3>
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
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Musicart | All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;

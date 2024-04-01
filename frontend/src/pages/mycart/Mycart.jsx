import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './MyCart.module.css';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/project_logo.png";
import LogoutButton from "/src/components/LogoutButton";

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

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
          <img src={phoneCallIcon} alt="Phone call" />
          <span>912121131313</span>
        </div>
        <div className={styles.headerContent}>
          <span>Get 50% off on selected items&nbsp; | &nbsp; Shop Now</span>
        </div>
        <div className={styles.logoutButton}>
      <LogoutButton /> 
    </div>
      </header>

      {/* Navigation */}
      <div className={styles.home}>
        <div className={styles.menubar}>
          <div className={styles.leftSection}>
            <div className={styles.menuItem}>
              <img src={projectLogo} alt="Project Logo" />
            </div>
            <div className={styles.menuItem}>
              <Link to="/home" className={styles.homeLink}>Home/   View Cart</Link>
            </div>
            <div className={styles.menuItem}>
              <Link to="/invoices" className={styles.invoiceLink}></Link>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.menuItem}>
              <button className={styles.button}>
                <img src="/cart_menu.png" alt="Cart_Menu" />
                <span>View Cart</span>
              </button>
            </div>
          </div>
        </div>
        <Link to="/productdetails" className={styles.homeButton}>Back to Products</Link>
        {/* Back to Home button */}

        {/* Cart Header */}
        <div className={styles.cartHeader}>
          <img src="/mycart.png" alt="mycart" className={styles.cartImage} />
          <h2 className={styles.cartTitle}>My Cart</h2>
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
            <p className={styles.priceValue1}>₹{(totalAmount + 45).toFixed(2)}</p>
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
          </div>
          <div className={styles.cartItemColumn}>
            <p>Price </p>
            <p>{product.price}</p>
          </div>
          <div className={styles.cartItemColumn}>
            <p>Quantity </p>
            <p>
              <select value={selectedQuantity} onChange={handleQuantitySelect} style={{ width: '60%',height: '30px',fontSize: '12px' }}>
                {[...Array(8)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
              </select>
            </p>
          </div>
          <div className={styles.cartItemColumn}>
            <p>Total</p>
            <div className={styles.cartItemColumn}>
              <p className={styles.priceParagraph}>₹{(parsePrice(product.price) * selectedQuantity).toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Musicart | All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default MyCart;

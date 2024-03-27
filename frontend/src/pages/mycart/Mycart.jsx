import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './MyCart.module.css';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/project_logo.png";
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
      </header>
      <div className={styles.home}>

      <div className={styles.menubar}>
        <div className={styles.leftSection}>
          <div className={styles.menuItem}>
            <img src={projectLogo} alt="Project Logo" />
          </div>
          <div className={styles.menuItem}>
            <Link to="/home" className={styles.homeLink}>Home</Link>
          </div>
          <div className={styles.menuItem}>
            <Link to="/invoices" className={styles.invoiceLink}>Invoice</Link>
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
      <Link to="/productdetails" className={styles.homeButton}>Back to Products</Link> {/* Back to Home button */}
      <div className={styles.cartHeader}>
  <img src="/mycart.png" alt="mycart" className={styles.cartImage} />
  <h2 className={styles.cartTitle}>My Cart</h2>
</div>
      <div className={styles.cartContent}>
        {/* Item details */}
        <div className={styles.itemDetails}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
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

          <p>Total MRP: ₹{totalAmount.toFixed(2)}</p>
          <p>Discount on MRP: ₹0</p>
          <p>Convenience Fee: ₹45</p>
          <div className={styles.priceAmount}>
          <h3>Total Amount: ₹{(totalAmount + 45).toFixed(2)}</h3>
          <Link to="/checkout">
            <button className={styles.placeOrderButton}>Place Order</button>
          </Link>
          </div>
        </div>
      </div>

      {/* Total product items and total MRP */}
    <div className={styles.totalItemsMRP}>
      <p>{cart.length} Items {' '}
      {totalAmount.toFixed(2)}</p>
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
            <p>Color: {product.color}</p>
            <p>In Stock</p>
            </div>
            <div className={styles.cartItemColumn}>

            <p>Price: </p>
            <p>{product.price}</p>
            </div>
            <div className={styles.cartItemColumn}>

            <p>Quantity: </p>
             <p> <select value={selectedQuantity} onChange={handleQuantitySelect} style={{ width: '40%' }}>
                {[...Array(8)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
              </select>
            </p>
            </div>         
            <div className={styles.cartItemColumn}>
            <p>Total:</p>
            <div className={styles.cartItemColumn}>
  <p>Price:</p>
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


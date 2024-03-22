import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import styles from './MyCart.module.css'; // Import CSS module

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0); // State to store the total amount

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
        const productPrice = parsePrice(product.price); // Parse the price here
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
        setTotalAmount(total); // Update the total amount state
      }).catch(error => {
        console.error("Error calculating total amount:", error);
      });
    }
  }, [cart, loading]);

  return (
    <div className={styles.mycartContainer}> {/* Use the CSS module class */}
      <h2>My Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className={styles.cartItemsContainer}> {/* Use CSS Module class */}
              {cart.map((item, index) => (
                <CartItem key={index} item={item} fetchProductDetails={fetchProductDetails} />
              ))}
              <div className={styles.totalSection}> {/* Use CSS Module class */}
                <h3>Total Amount</h3>
                <p>Total: ₹{totalAmount.toFixed(2)}</p> {/* Render the total amount */}
              </div>
              {/* Use Link to navigate to the checkout page */}
              <Link to="/checkout">
                <button>Place Order</button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CartItem = ({ item, fetchProductDetails }) => {
  const parsePrice = (priceString) => {
    const numericValue = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericValue);
  };
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductDetails = async () => {
      if (!item.product) {
        console.error('Product ID is undefined');
        return;
      }
      const productDetails = await fetchProductDetails(item.product._id); // Assuming product field is populated
      setProduct(productDetails);
      setLoading(false);
    };

    getProductDetails();
  }, [fetchProductDetails, item.product]);

  // Parse the price outside of the JSX
  const price = product ? parsePrice(product.price) : '';

  return (
    <div className={styles.cartItem}> {/* Use CSS Module class */}
      <p>Product ID: {item.product && item.product._id}</p>
      <p>Quantity: {item.quantity}</p>
      {loading ? (
        <p>Loading product details...</p>
      ) : (
        <>
          <p>Name: {product.name}</p>
          <p>Price: ₹{price}</p> {/* Use the parsed price here */}
          <img src={product.images[0]} alt={product.name} />

          {/* Add more product details as needed */}
        </>
      )}
    </div>
  );
};

export default MyCart;

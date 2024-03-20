import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Function to calculate total amount
  const calculateTotalAmount = (cart) => {
    return cart.reduce((total, item) => total + (item.product && item.product.price) * item.quantity, 0);
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  return (
    <div className="mycart-container" style={{ overflowY: 'auto', maxHeight: '400px' }}>
      <h2>My Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item, index) => (
                <CartItem key={index} item={item} fetchProductDetails={fetchProductDetails} />
              ))}
              <div className="total-section">
                <h3>Total Amount</h3>
                <p>Total: ₹{calculateTotalAmount(cart)}</p>
              </div>
              <button onClick={() => console.log('Placing order...')}>Place Order</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CartItem = ({ item, fetchProductDetails }) => {
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

  return (
    <div className="cart-item">
      <p>Product ID: {item.product && item.product._id}</p>
      <p>Quantity: {item.quantity}</p>
      {loading ? (
        <p>Loading product details...</p>
      ) : (
        <>
          <p>Name: {product.name}</p>
          <p>Price: ₹{product.price}</p>
          {/* Add more product details as needed */}
        </>
      )}
    </div>
  );
};

export default MyCart;

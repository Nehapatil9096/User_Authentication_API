import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './InvoiceDetailsPage.module.css'; // Import CSS styles
import LogoutButton from '/src/components/LogoutButton'; // Import LogoutButton component
import { Link } from 'react-router-dom';

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchInvoiceDetails();
    fetchUserData();
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(`/api/users/invoices/${invoiceId}`);
      setInvoice(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/users/profile`);
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }
  
  const { deliveryAddress, paymentMethod, items, totalAmount } = invoice;
  
  return (
    <div className={styles.checkoutContainer}> {/* Use the same container class from Checkout module */}
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

      <h3 className={styles.checkoutHeader}>Invoice Details</h3>

      <div className={styles.checkoutSections}>
        <div className={styles.leftColumn}>
          <h4>Delivery Address</h4>
          <span>{username}</span>
          <input type="text" placeholder="Add delivery address" value={deliveryAddress} readOnly />

          <h4>Payment Method</h4>
          <select value={paymentMethod} disabled>
            <option value="payOnDelivery">Pay on Delivery</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <h4>Review Items and Delivery</h4>
{invoice.items && invoice.items.map((item, index) => (
  <div key={index}>
    <ItemDetails item={item} fetchProductDetails={fetchProductDetails} />
  </div>
))}

          <p>Estimated delivery: Monday - Free Standard Delivery</p>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.orderSummaryBox}>
            <hr className={styles.hr} />
            <p>Order Summary</p>
            <p>Items Total: ₹{totalAmount.toFixed(2)}</p>
            <p>Delivery Amount: ₹45</p>
            <hr className={styles.hr} />
            <p className={styles.orderTotal}>Order Total: ₹{(totalAmount + 45).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className={styles.orderSummaryHorizontal}>
        <button className={styles.placeOrderButton}>Place Your Order</button>
        <p className={styles.orderTotal}>Order Total: ₹{(totalAmount + 45).toFixed(2)}</p>
        <p className={styles.agreeText}>By placing your order you agree to musicart privacy notice and conditions of use</p>
      </div>
    </div>
  );
};


const ItemDetails = ({ item, fetchProductDetails }) => {
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchProductDetails(item.product);
        setProductDetails(response);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchDetails();
  }, [item, fetchProductDetails]);

  return (
    <div>
      {productDetails && (
        <>
          <img src={productDetails.images[0]} alt={productDetails.name}className="productImage" />
          <p>{productDetails.name} - {productDetails.color}</p>
        </>
      )}
    </div>
  );
};

export default InvoiceDetails;

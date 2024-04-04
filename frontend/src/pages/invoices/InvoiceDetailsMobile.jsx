import React, { useState, useEffect,useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './InvoiceDetailsMobile.module.css'; // Import CSS styles
import { Link } from 'react-router-dom';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/Mlogo.png";
import LogoutButton from "/src/components/LogoutButton";
import {  useNavigate } from 'react-router-dom';
import useLogout from "/src/hooks/useLogout";

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  //logout------------------------------
  const logoutButtonRef = useRef(null);
  const navigate = useNavigate();

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
useEffect(() => {
  fetchCartCount();
}, []);
const fetchCartCount = async () => {
  try {
    const response = await axios.get('/api/users/cart/count');
    setCartCount(response.data.count);
  } catch (error) {
    console.error('Error fetching cart count:', error);
  }
};
  //----------------------------------------
  const handleProductClick = async (productId) => {
    const productDetails = await fetchProductDetails(productId);
    setSelectedProduct(productDetails);
  };

  useEffect(() => {
    fetchInvoiceDetails();
    fetchUserData();
  }, [invoiceId]);

  useEffect(() => {
    // Set default product details when the component mounts
    if (invoice && invoice.items && invoice.items.length > 0) {
      const firstItem = invoice.items[0];
      handleProductClick(firstItem.product);
    }
  }, [invoice]);

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
    <div className={styles.checkoutContainer}>
      {/* Header */}
      <header className={styles.header}>
  <div className={styles.leftSection}>
  <img src={projectLogo} alt="Project Logo" />
  </div>
  
</header>
      <div className={styles.home}>

   

      <Link to="/invoices" className={styles.homeButton}>
        <img src="/Mback.png" alt="Back to Home" className={styles.homeButtonImage} />
</Link>
      <h1 className={styles.checkoutHeader}>Invoice</h1>

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
              
              <div className={styles.deliveryInput}>
               {deliveryAddress}
              </div>

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
            <select className={styles.paymentMethodSelect} value={paymentMethod} disabled>
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
                {items && items.map((item, index) => (
                  <div key={index} onClick={() => handleProductClick(item.product)}>
                    <ItemDetails item={item} fetchProductDetails={fetchProductDetails} />
                  </div>
                ))}
              </div>

              {selectedProduct && (
                <div className={styles.selectedProductDetails}>
                  <p>{selectedProduct.name} </p>
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

        <div className={styles.rightColumn}>
         
          <div className={styles.orderSummaryBox}>
            
            <h3>Order Summary</h3>
            <p>Items Total: ₹{totalAmount.toFixed(2)}</p>
            <p>Delivery Amount: ₹45</p>
            <div className={styles.line}></div> {/* Line between rows */}
            <h3 className={styles.orderTotal}>Order Total: ₹{(totalAmount + 45).toFixed(2)}</h3>
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
          {cartCount >= 0 && <span className={styles.cartCount}>{cartCount}</span>}
        </div>

        <Link to="/invoices" className={styles.mbmenuItem}>
          <img src="/mbinvoice.png" alt="Invoice" className={styles.menuIcon} />
          <div className={styles.menuLine}></div>
        </Link>

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
      {productDetails && productDetails.images && productDetails.images.length > 0 ? (
        <img src={productDetails.images[0]} alt={productDetails.name} className={styles.productImage} />
      ) : (
        <div>No image available</div>
      )}
    </div>
  );
};

export default InvoiceDetails;

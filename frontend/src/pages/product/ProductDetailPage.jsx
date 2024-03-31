import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/project_logo.png";
import { Link } from "react-router-dom";
import axios from 'axios';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`/api/users/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [productId]);

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} color="#ffc107" />);
      } else {
        stars.push(<FaRegStar key={i} color="#e4e5e9" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    if (product) {
      fetch('/api/users/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }), // Adding 1 quantity by default
      })
        .then(response => {
          if (response.ok) {
            console.log('Product added to cart:', product);
            setAddedToCart(true);
          } else {
            console.error('Failed to add product to cart');
          }
        })
        .catch(error => console.error('Error adding product to cart:', error));
    }
  };

  const handleBuyNow = () => {
    if (addedToCart) {
      navigate('/mycart');
    } else {
      handleAddToCart();
      navigate('/mycart');
    }
  };

  const toggleImageSize = (index) => {
    if (index !== 0) {
      const tempImages = [...product.images];
      const tempImage = tempImages[0];
      tempImages[0] = tempImages[index];
      tempImages[index] = tempImage;
      setProduct({ ...product, images: tempImages });
      setSelectedImage(0);
    }
  };
  

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
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
              <Link to="/home"className={styles.homeLink}>Home</Link>
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
        <div className={styles.menuItem}>
          <Link to="/home" className={styles.backToProducts}>Back to Products</Link>
        </div>
        <div className={styles.productShortInfo}>
          <p>{product.shortinfo}</p>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.imagesContainer}>
            <div className={styles.mainImage}>
              <img
                src={product.images[selectedImage]}
                alt={`Product ${selectedImage + 1}`}
                style={{ width: '100%', height: '100%' }}
                onClick={() => toggleImageSize(selectedImage)}
              />
            </div>
            <div className={styles.smallImages}>
              {product.images.slice(1, 4).map((image, index) => (
                <img
                  key={index + 1}
                  src={image}
                  alt={`Product ${index + 2}`}
                  className={`${styles.smallImage} ${selectedImage === index + 1 ? styles.active : ''}`}
                  onClick={() => toggleImageSize(index + 1)}
                />
              ))}
            </div>
          </div>
          <div className={styles.productDetailsContainer}>
            <div className={styles.productDetails}>
              <h2 className={styles.name}>{product.name}</h2>
              <p>{renderStarRating(product.rating)} (50 Customer reviews)</p>
              <p className={styles.price}>Price: {product.price}</p>
              <p className={styles.color}> {product.color} <span>|</span> {product.type}</p>
              <p>About this item</p>
              <ul className={styles.aboutList}>
                {product.about.split('.').filter(Boolean).map((phrase, index) => (
                  <li key={index}>{phrase.trim()}</li>
                ))}
              </ul>
              <p className={styles.available}><strong>Available</strong> - In stock</p>
              <p className={styles.company}><strong>Brand</strong>- {product.brand}</p>
              <div className={styles.buttons}>
                <div className={styles.buttonsContainer}>
                  <button onClick={handleAddToCart} className={styles.cartButton}>Add to Cart</button>
                  <button onClick={handleBuyNow} className={styles.buyNowButton}>Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Musicart | All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;

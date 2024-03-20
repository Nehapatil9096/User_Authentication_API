import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';

import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
          } else {
            console.error('Failed to add product to cart');
          }
        })
        .catch(error => console.error('Error adding product to cart:', error));
    }
  };
  const handleBuyNow = () => {
    if (product) {
      // Navigate to the cart page
      navigate('/mycart');
    }
  };
  
  

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Carousel showArrows={true} selectedItem={selectedImage}>
        {product.images.map((image, index) => (
          <div key={index} onClick={() => setSelectedImage(index)}>
            <img src={image} alt={`Product ${index + 1}`} className={index === selectedImage ? styles.mainImage : styles.smallImage} />
          </div>
        ))}
      </Carousel>
      <div className={styles.productDetails}>
        <h2>{product.name}</h2>
        <p>Company: {product.brand}</p>
        <p>Price: {product.price}</p>
        <p>Color: {product.color}</p>
        <p>Type: {product.type}</p>
        <p>About: {product.about}</p>
        <p>Rating: {renderStarRating(product.rating)}</p>
        <div className={styles.quantity}>
          <label>Quantity:</label>
          <input type="number" value={1} readOnly />
        </div>
        <div className={styles.buttons}>
          <button onClick={handleAddToCart}>Add to Cart</button>
          <button onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

// ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

import styles from './ProductDetailPage.module.css';


const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch product details based on productId
    // Example fetch code
    console.log("product id is:", productId);
        fetch(`/api/users/products/${productId}`)
        .then(response => response.json())
        .then(data => {
          setProduct(data);
          setSelectedImage(data.images[0]); // Set the default image initially
        })
        .catch(error => console.error('Error fetching product:', error));
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
    // Implement logic for adding product to cart
    console.log('Product added to cart:', product);
  };

  const handleBuyNow = () => {
    // Implement logic for buying product
    console.log('Buying product:', product);
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
    {/* Carousel component for product images */}
    <Carousel showArrows={true} selectedItem={selectedImage}>
        {product.images.map((image, index) => (
          <div key={index} onClick={() => handleImageClick(index)}>
            <img src={image} alt={`Product ${index + 1}`} className={index === selectedImage ? styles.mainImage : styles.smallImage} />
          </div>
        ))}
      </Carousel>
    {/* Product details */}
    <div className={styles.productDetails}>
      <h2>{product.name}</h2>
      <p>Company: {product.brand}</p>
      <p>Price: {product.price}</p>
      <p>Color: {product.color}</p>
      <p>Type: {product.type}</p>
      <p>About: {product.about}</p> {/* Display about */}
      <p>Rating: {renderStarRating(product.rating)}</p> {/* Display star rating */}
      {/* Buttons for Add to Cart and Buy Now */}
      <div className={styles.buttons}>
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handleBuyNow}>Buy Now</button>
      </div>
    </div>
  </div>
);
};

export default ProductDetailPage;
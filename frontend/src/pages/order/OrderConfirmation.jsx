import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <div>
      <h2>Order is placed successfully!</h2>
      <p>You will be receiving a confirmation email with order details.</p>
      <Link to="/">Go back to Home page</Link>
    </div>
  );
};

export default OrderConfirmation;

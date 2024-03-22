// models/user.model.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
  },
  
  cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1, // Default quantity is 1
      },
    },
  ],
  orders: [
    {
      items: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
          },
          quantity: {
            type: Number,
            default: 1, // Default quantity is 1
          },
        },
      ],
      deliveryAddress: {
        type: String, // Assuming the address is stored as a string for simplicity
      },
      paymentMethod: {
        type: String,
        enum: ['payOnDelivery', 'upi', 'card'], // Assuming limited payment methods for now
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      deliveryAmount: {
        type: Number,
        required: true,
      },
      orderDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  feedbacks: [
    {
      type: { type: String, required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model('User', userSchema);

export default User;

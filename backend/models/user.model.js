// models/user.model.js

import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['High', 'Moderate', 'Low'],
    required: true,
  },
  checklist: [
    {
      text: {
        type: String,
        required: true,
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
  ],
  dueDate: {
    type: Date,
  },
  state: {
    type: String,
    enum: ['Backlog', 'ToDo', 'InProgress', 'Done'],
    default: 'Backlog',
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  checklistTotalTasks: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema({
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
  cards: [cardSchema],
});

const User = mongoose.model('User', userSchema);

export default User;

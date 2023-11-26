const mongoose = require('mongoose');

const Review_Schema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Products',
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    refPath: 'user_type',
  },
  user_type: {
    type: String,
    enum: ['B2BUsers', 'B2CUsers', 'Users'],
    required: true,
  },
  message: {
    type: String,
    maxLength: [100, 'Review message can have maximum of 100 characters!'],
    minLength: [10, 'Message must have at least 10 characters!'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
});

module.exports = mongoose.model('Reviews', Review_Schema);

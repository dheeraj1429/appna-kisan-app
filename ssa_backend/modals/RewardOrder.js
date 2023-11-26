const mongoose = require('mongoose');
const { getOrderId } = require('order-id')('key');

const Reward_Order_Schema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    // default: getOrderId,
  },
  buyer: {
    type: mongoose.Types.ObjectId,
    refPath: 'buyer_type',
    required: true,
  },
  buyer_type: {
    type: String,
    enum: ['B2BUsers', 'B2CUsers', 'Users'],
    required: true,
  },
  reward_point_price: {
    type: Number,
    required: true,
  },
  product: {
    product_id: {
      type: String,
      required: true,
    },
    product_code: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_sub_category: {
      type: String,
      required: true,
    },
    product_category: {
      type: String,
      required: true,
    },
    product_main_category: {
      type: String,
      required: true,
    },
    quantityBought: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    b2b_user_product_price: {
      type: mongoose.Types.Decimal128,
      default: null,
    },
    b2c_user_product_price: {
      type: mongoose.Types.Decimal128,
      default: null,
    },
    product_images: [
      {
        image_name: { type: String },
        image_url: { type: String },
        path: { type: String },
      },
    ],
  },
});

module.exports = mongoose.model('RewardOrder', Reward_Order_Schema);

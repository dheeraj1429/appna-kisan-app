const express = require('express');
const router = express.Router();
const Reward_Order_Controllers = require('../controllers/Reward_Order_Controller.js');
const auth = require('../middlewares/auth');

router.get(
  '/all/reward/products',
  Reward_Order_Controllers.getRewardPointsRedeemableProducts
);

router.post(
  '/app/cart/checkout/for/rewards/products',
  auth(),
  Reward_Order_Controllers.cartCheckout
);

module.exports = router;

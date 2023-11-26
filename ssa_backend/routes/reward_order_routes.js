const express = require('express');
const router = express.Router();
const Reward_Order_Controllers = require('../controllers/Reward_Order_Controller.js');

router.get(
  '/all/reward/products',
  Reward_Order_Controllers.getRewardPointsRedeemableProducts
);

module.exports = router;

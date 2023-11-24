const express = require('express');
const router = express.Router();
const B2BUser_Controllers = require('../controllers/B2BUser_Controller');

router.patch('/b2b/user/:userId/approval', B2BUser_Controllers.approveB2bUser);

module.exports = router;

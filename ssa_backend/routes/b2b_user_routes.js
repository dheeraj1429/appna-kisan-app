const express = require('express');
const router = express.Router();
const B2BUser_Controllers = require('../controllers/B2BUser_Controller');

router.get('/get-all-b2b-users', B2BUser_Controllers.getAllB2bUsers)
router.get('/get-single-b2b-user/:userId', B2BUser_Controllers.getSingleB2bUser)

router.patch('/b2b/user/:userId/approval', B2BUser_Controllers.approveB2bUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const User_Controllers = require('../controllers/User_Controller');
const auth = require('../middlewares/auth');

// users all routes
router.get('/user/get/alluser', User_Controllers.getAllUser);
router.get('/user/get/user', User_Controllers.getUserById);
router.get('/user/get/user/info', auth(), User_Controllers.getUserInfo);
router.get('/user/get/:user_id', User_Controllers.getUser);
router.post('/user/create/newuser', User_Controllers.createUser);
router.post('/user/login', User_Controllers.loginUser);
router.post('/user/logout', User_Controllers.logoutUser);
router.patch('/user/edit/:user_id', User_Controllers.editUserByID);
router.patch('/user/update/info', auth(), User_Controllers.updateUserInfo);
router.delete('/delete/users', User_Controllers.deleteUsers);
router.get('/search/in/user', User_Controllers.searchInUsers);
router.get('/filter/users', User_Controllers.filterForUsers);

module.exports = router;

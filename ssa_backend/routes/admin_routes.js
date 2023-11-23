const express = require("express")
const router = express.Router()
const Admin_Controllers = require("../controllers/Admin_Controller")

// admin user routes
router.get("/admin/get/alluser",Admin_Controllers.getAllUser);
router.get("/admin/get/user",Admin_Controllers.getUserById);
router.post("/admin/create/newuser",Admin_Controllers.createUser);
router.post("/admin/login",Admin_Controllers.loginUser);
router.delete("/admin/logout",Admin_Controllers.logoutUser);
router.patch("/admin/edit/:admin_id",Admin_Controllers.editAdminByID);

module.exports = router
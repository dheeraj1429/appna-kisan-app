const express = require("express")
const router = express.Router()
const Vendors_Controllers = require("../controllers/Vendors_Controller")


// vendors  routes
router.get("/vendors/get/allvendor",Vendors_Controllers.getAllVendors);
router.get("/vendors/get/vendor",Vendors_Controllers.getVendorById);
router.post("/vendors/create/vendor",Vendors_Controllers.createVendor);
router.post("/vendors/login",Vendors_Controllers.loginVendor);
router.post("/vendors/logout",Vendors_Controllers.logoutVendor);
router.patch("/vendors/edit/:vendor_id",Vendors_Controllers.editVendorByID);
router.get("/search/in/vendors",Vendors_Controllers.searchInVendors);
router.get("/filter/for/vendors",Vendors_Controllers.filterVendors);


module.exports = router
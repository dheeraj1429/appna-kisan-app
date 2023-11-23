const express = require("express")
const router = express.Router();
const Enquiry_Controllers = require("../controllers/Enquiry_Cotroller")


router.get("/get/all/order/enquiries",Enquiry_Controllers.getAllEnquires);

module.exports = router
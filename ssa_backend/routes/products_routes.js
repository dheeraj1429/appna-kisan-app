const express = require("express")
const router = express.Router()
const Product_Controllers = require("../controllers/Products_Controller")

// all products routes 
router.get("/all/products",Product_Controllers.getAllProducts);
router.post("/add/new/product",Product_Controllers.createProducts);
router.get("/get/single/product/:product_id",Product_Controllers.getproductById);
router.patch("/edit/product/:product_id",Product_Controllers.editProduct);
router.patch("/remove/product/image/:product_id/:product_image",Product_Controllers.deleteProductImage);
router.delete("/delete/product",Product_Controllers.deleteProducts);
router.get("/search/in/products",Product_Controllers.searchProducts);
router.get("/filter/products",Product_Controllers.filterProducts);
router.patch("/set/products/as/new/arrivals",Product_Controllers.setNewArrivalProducts);
router.patch("/remove/products/as/new/arrivals",Product_Controllers.removeNewArrivalProducts);


module.exports = router
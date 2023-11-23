const express = require("express")
const router = express.Router()
const Brands_Controller = require("../controllers/Brands_Controller");
const Brands = require("../modals/Brands");
const Products = require("../modals/Products");
const Users = require("../modals/Users");

router.post("/create/category",Brands_Controller.createCategory);
router.post("/create/maincategory",Brands_Controller.createMainCategory);
router.get("/get/all/category",Brands_Controller.getAllCategory);
router.get("/get/category/for/addproduct",Brands_Controller.getCategoryByMainCategory);
router.patch("/update/all/main/category",Brands_Controller.updateMainCategory);
router.patch("/edit/category/:category_id",Brands_Controller.editCategory);
router.get("/get/category/:category_id",Brands_Controller.getCategorysById);
router.get("/search/in/category",Brands_Controller.searchInCategory);
router.get("/filter/category",Brands_Controller.filterForCategory);
router.get("/get/addproduct/maincategory",Brands_Controller.mainCategoryForProduct);
router.patch("/delete/main/category/image",Brands_Controller.deleteImage);
router.delete("/delete/category/",Brands_Controller.deleteCategory);


// sanjeev get category
// router.get("/get/all/categories",async(req,res)=>{
//     try {
//         console.log("enter")
//         const allcategorycount = await Brands.find({main_category_name: "mens fashion"}).countDocuments()
//         const allcategory = await Brands.find({main_category_name: "mens fashion"}).select("category_name")
//         console.log(allcategory)
//         res.status(200).send({category:allcategorycount,allcategory:allcategory})
        
//     } catch (error) {
//         res.status(500).send("error aa rha h")
//     }
// });

// // get products
// router.get("/get/all/products",async(req,res)=>{
//     try {
//         const allproducts = await Products.find({},'-product_sku')
//         res.status(200).send(allproducts) 
//     } catch (error) {
//         res.status(500).send("getting products failed!!")
//     }
// })

// //get users
// router.get("/get/all/alltheusers",async(req,res)=>{
//     try {
//         console.log("user are come")
//         const allusers = await Users.find({})
//         res.status(200).send(allusers)
//     } catch (error) {
//         res.status(500).send("failed!!")
//     }
// })

// // get products
// router.get("/get/product/productdata",async(req,res)=>{
//     try {
//         console.log("products are come")
//         const allproduct = await Products.find({})
//         res.status(200).send(allproduct)
        
//     } catch (error) {
//         res.status(500).send("failed!!")
//     }
// })

// router.get("/get/users/allusersdata",async(req,res)=>{
//     // const searchValue = req.query.search
//     // const searchData = req.query.any
//     const {search,any}=req.query
//     console.log(search,any)
//     // console.log(searchData)
//     try {
//         if(search){
//             const usersearch = await Users.find({firstname:search})
//             if(!usersearch.length>0){
                
//                 return res.status(404).send("not found!!")

//             }
//             return res.status(200).send(usersearch)   
//         }
//         console.log("user data are come")
//         const allusersdata = await Users.find({})
//         res.status(200).send(allusersdata)
//     } catch (error) {
//         res.status(500).send("failed to find users!!")
//     }
// })


module.exports = router;
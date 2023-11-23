const Vendors_Schema = require("../modals/Vendors");
const Utils = require("../utils/Utils");
const { v4: uuidv4 } = require('uuid');



// creating new Vendor 
const createVendor = async(req,res)=>{
    
    try{
        const findVendorPhone = await Vendors_Schema.findOne({shop_contact:req.body.shop_contact})
        if(findVendorPhone){
            return res.send("User Already Exists !!")
        }
        const findVendor = await Vendors_Schema.findOne({shop_email:req.body.shop_email})
        if(findVendor){
            return res.send("User Already Exists !!")
        }
        // create shop unique id
        // const getShopCount = await Vendors_Schema.find({}).count();
        // const shopCustomId = "shop00"+(getShopCount+1);
        const shopCustomId = uuidv4();
        console.log(shopCustomId);
        const hashedPassword = await Utils.Hashing_Password(req.body.password)
        const create = new Vendors_Schema({
            shop_id:shopCustomId,
            firstname:req.body.firstname?.toLowerCase(),
            lastname:req.body.lastname?.toLowerCase(),
            profile:req.body.profile,
            shop_contact:req.body.shop_contact,
            shop_email:req.body.shop_email,
            password:hashedPassword,
            shop_name:req.body.shop_name?.toLowerCase(),
            user_type:req.body.user_type?.toLowerCase(),
            shop_address:req.body.shop_address,
            shop_type:req.body.shop_type?.toLowerCase(),
            shop_location:req.body.shop_location,
            account_details:req.body.account_details,
            delivery_method:req.body.delivery_method,
            gst_number:req.body.gst_number,
            shop_image:req.body.shop_image,
            aadhar_card_no:req.body.aadhar_card_no,
            shop_status:"pending", //req.body.shop_status?.toLowerCase(),
            shop_plan:req.body.shop_plan?.toLowerCase(),
            products_limit:req.body.products_limit

        }) 
        const result = await create.save();
        res.status(200).send({result:result,message:"created Vendors successfully !!"})

    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}


// Login vendor with email or phone number
const loginVendor = async(req,res)=>{
    const {shop_email,shop_contact,password} = req.body;
    try{
        let findVendorPhone;
       const findVendorEmail = await Vendors_Schema.findOne({shop_email:shop_email})
       if(!findVendorEmail){
         findVendorPhone = await Vendors_Schema.findOne({shop_contact:shop_contact})
        if(!findVendorPhone){
            return res.send("Invalid Username or password !!")
           }
       }
      
       let isValidPassword=false;
       if(findVendorEmail){
        try{
            isValidPassword = await Utils.compare_Password(password,findVendorEmail.password)
        }catch(err){
            console.log(err)
            res.send("Something went wrong !!")
        }
        if(!isValidPassword){
            return res.send("Invalid Username or password !!")
        }
        if(isValidPassword){
            const token = await Utils.create_Jwt(
                {id:findVendorEmail._id,user_type:findVendorEmail.user_type},
                process.env.JWT_TOKEN_SECRET
                )
            res.cookie("jwt",token,
            {
                httpOnly:true,
                maxAge: 24 * 60 * 60 * 1000, //5 hrs
            }
            )
            return res.status(200).send("Logged in Success !!")
        }
       }
       if(findVendorPhone){
        try{
            isValidPassword = await Utils.compare_Password(password,findVendorPhone.password)
        }catch(err){
            console.log(err)
            res.send("Something went wrong !!")
        }
        if(!isValidPassword){
            return res.send("Invalid Username or password !!")
        }
        if(isValidPassword){
            const token = await Utils.create_Jwt(
                {id:findVendorPhone._id,user_type:findVendorPhone.user_type},
                process.env.JWT_TOKEN_SECRET
                )
            res.cookie("jwt",token,
            {
                httpOnly:true,
                maxAge: 24 * 60 * 60 * 1000, //5 hrs
            }
            )
            return res.status(200).send("Logged in Success !!")
        }
       }
    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")

    }
}

// logout vendor
const logoutVendor = async(req,res)=>{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).send("Logout Success !!")
}


//getting all vendor
const getAllVendors = async(req,res)=>{
    try{
        const getCountallvendors = await Vendors_Schema.find({}).count();
        const getAllShopTypes = await Vendors_Schema.aggregate([
            {$group:{_id:"$shop_type"}},
        ]).sort({_id:1}).collation({locale:'en',caseLevel:true})

        const getAllShopPlan = await Vendors_Schema.aggregate([
            {$group:{_id:"$shop_plan"}}
        ]).sort({_id:1}).collation({locale:'en',caseLevel:true})

        const getAlldeliveryMethod = await Vendors_Schema.aggregate([
            {$group:{_id:'$delivery_method.name'}}
        ]).sort({_id:1}).collation({locale:'en',caseLevel:true});

        const alluser = await Vendors_Schema.find({},"-password").sort({createdAt:-1})
        res.status(200).json({alluser:alluser,countVendor:getCountallvendors,getAllShopTypes:getAllShopTypes,getAllShopPlan:getAllShopPlan,getAlldeliveryMethod:getAlldeliveryMethod})

    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}


// get vendor by id (who's logged in)
const getVendorById = async (req,res)=>{
    const cookie = req.cookies['jwt']
    try{
        if(!cookie){
            return res.send("Unauthenticated !!")
        }
        const verifyJwt = await Utils.verifying_Jwt(cookie,process.env.JWT_TOKEN_SECRET)
        if(!verifyJwt){
            return res.send("Unauthenticated !!")
        }
        const findVendor = await Vendors_Schema.findById(verifyJwt.id ,"-password")
        if(!findVendor){
            return res.send("Unauthenticated !!")
        }
        res.status(200).send(findVendor);
    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}

// edit vendors by id
const editVendorByID = async(req,res)=>{
    const vendorId=req.params.vendor_id;
    try{
        if(!vendorId){
            return res.send("please provide a vendor id")
        }
        if(req.body.password){
            const hashedNewPassword = await Utils.Hashing_Password(req.body.password)
            const find = await Vendors_Schema.findByIdAndUpdate(vendors,{password:hashedNewPassword})
            if(!find){
                return res.send("User not found")
            }
            return res.status(200).send("Password Updated success")
        }
        const findVendor = await Vendors_Schema.findByIdAndUpdate(vendorId,{$set:req.body})
        if(!findVendor){
            return res.send("Vendor not found")
        }
        res.status(200).send("vendor updated successfully !!")


    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}

// SEARCH IN VENDORS 
const searchInVendors=async(req,res)=>{
    const searchValue = req.query.search;
    const searchRegex = Utils.createRegex(searchValue);
    let result; 
    try{
        // for string fields
        result = await Vendors_Schema.find({shop_id:{$regex:searchRegex}}).sort({createdAt:-1})
        console.log("RESULT",result)
        if(!result.length > 0 ){
            console.log("if. ............")
            result = await Vendors_Schema.find({shop_name:{$regex:searchRegex}})
            if(!result.length > 0){
                result = await Vendors_Schema.find({firstname:searchRegex})
            }
        }
        // for number fields
        if(searchValue?.length > 0){
        let searchForNumber = searchValue.match(/[a-zA-Z]/g);
        console.log("searchForNumber",searchForNumber)
        if(!searchForNumber?.length ){
            result = await Vendors_Schema.find({shop_contact:JSON.parse(searchValue)}).sort({createdAt:-1})

        } 
    }
        res.status(200).send(result)
    }catch(err){
        console.log(err)
        res.status(500).send("Somthing went wrong !!")
    }
}


// FILTER FOR VENDORS
const filterVendors = async(req,res)=>{
    const {by_status,date_from,date_to,by_shoptype,by_shopplan,by_delivery_method} = req.query
    let result;
    console.log("by_status,date_from,date_to",by_status,date_from,date_to)

    try{
         // console.log("date====",Utils.convertDate(date_from),"-----",Utils.convertDate(date_to))
         const endDate = new Date(`${date_to}`);
         // seconds * minutes * hours * milliseconds = 1 day 
         const dayTime = 60 * 60 * 24 * 1000;
         let increaseEndDateByOne = new Date(endDate.getTime() + dayTime);
         // console.log("INCREASED DATE",increaseEndDateByOne)
 
 
                 // filter users by todays date and by their status 
                 let vendor_status;
         if(date_from && date_to && by_status ){ 
             if(by_status!= 'all'){
                //   vendor_status = by_status == 'verified' ? "verified" : by_status == 'notverified' ? "notverified":"pending"
                 result = await Vendors_Schema.aggregate([{
                     $match:{
                        shop_status:by_status,
                     createdAt:{
                         $lte:Utils.convertDate(increaseEndDateByOne),
                         $gte:Utils.convertDate(date_from)
                     }
                 },
             },
             {$project:{
                password:0,
                account_details:0,
                aadhar_card_no:0,
                delivery_method:0,
                gst_number:0,
                profile:0,
                shop_address:0,
                shop_contact:0,
                shop_email:0,
                updatedAt:0,
                user_type:0,
                shop_image:0,
               
            }}
            ],).sort({createdAt:-1})
             return res.status(200).send(result)
             }
         }
             else{
                // vendor_status = by_status == 'verified' ? "verified" : by_status == 'notverified' ? "notverified":"pending"
                 result = await Vendors_Schema.find({shop_status:by_status},'-password -account_details -aadhar_card_no -delivery_method -gst_number -profile -shop_address -shop_contact -shop_email -updatedAt -user_type -shop_image').sort({createdAt:-1})
                 // return res.status(200).send(result)
 
             }
 
 
         if(date_from && date_to){
             result = await Vendors_Schema.aggregate([{
                                 $match:{
                                 createdAt:{
                                     $lte:Utils.convertDate(increaseEndDateByOne),
                                     $gte:Utils.convertDate(date_from)
                                 }
                             },
                         },{$project:{
                            password:0,
                            account_details:0,
                            aadhar_card_no:0,
                            delivery_method:0,
                            gst_number:0,
                            profile:0,
                            shop_address:0,
                            shop_contact:0,
                            shop_email:0,
                            updatedAt:0,
                            user_type:0,
                            shop_image:0,
                           
                        }}
                        ],).sort({createdAt:-1})
                     console.log("RESULT NEW----",result)
                     return res.status(200).send(result)
              }
    if(by_status != 'all' ){
        // vendor_status = by_status == 'verified' ? "verified" : by_status == 'notverified' ? "notverified":"pending"
        result = await Vendors_Schema.find({shop_status:by_status},'-password -account_details -aadhar_card_no -delivery_method -gst_number -profile -shop_address -shop_contact -shop_email -updatedAt -user_type -shop_image').sort({createdAt:-1})
        return res.status(200).send(result)
    }
    if(by_shoptype != "all" ){
        result = await Vendors_Schema.find({shop_type:by_shoptype},'-password -account_details -aadhar_card_no -delivery_method -gst_number -profile -shop_address -shop_contact -shop_email -updatedAt -user_type -shop_image').sort({createdAt:-1});
        return res.status(200).send(result)
    }
    if(by_shopplan != 'all'){
        result = await Vendors_Schema.find({shop_plan:by_shopplan},'-password -account_details -aadhar_card_no -delivery_method -gst_number -profile -shop_address -shop_contact -shop_email -updatedAt -user_type -shop_image').sort({createdAt:-1})
        return res.status(200).send(result)
    }
    if(by_delivery_method != 'all'){
        result = await Vendors_Schema.find({"delivery_method.name":by_delivery_method},'-password -account_details -aadhar_card_no -delivery_method -gst_number -profile -shop_address -shop_contact -shop_email -updatedAt -user_type -shop_image').sort({createdAt:-1})
        return res.status(200).send(result)
    }

    }
    catch(err){
        console.log(err)
        res.status(500).send("Somthing went wrong !!")
    }
}

// search in vendors 
// const searchInVendors = async(req,res)=>{
//     const { shop_id,shop_name,shop_type,gst_number,shop_email,shop_plan,delivery_method,products_limit,shop_status } = req.query;
//     let searchResults;
//     try{
//         if(shop_id){
//             searchResults = await Vendors_Schema.find({shop_id:{$regex:Utils.createRegex(shop_id)}})
//         }
//         if(shop_name){
//             searchResults = await Vendors_Schema.find({shop_name:{$regex:Utils.createRegex(shop_name)}})
//         }
//         if(shop_type){
//             searchResults = await Vendors_Schema.find({shop_type:{$regex:Utils.createRegex(shop_type)}})
//         }
//         if(gst_number){
//             searchResults = await Vendors_Schema.find({gst_number:{$regex:Utils.createRegex(gst_number)}})
//         }
//         if(shop_email){
//             searchResults = await Vendors_Schema.find({shop_email:{$regex:Utils.createRegex(shop_email)}})
//         }
//         if(delivery_method){
//             searchResults = await Vendors_Schema.find({delivery_method:{$regex:Utils.createRegex(delivery_method)}})
//         }
//         if(shop_status){
//             searchResults = await Vendors_Schema.find({shop_status:{$regex:Utils.createRegex(shop_status)}})
//         }
//         if(products_limit){
//             searchResults = await Vendors_Schema.find({products_limit:products_limit})
//         }
//         if(shop_plan){
//             searchResults = await Vendors_Schema.find({shop_plan:{$regex:Utils.createRegex(shop_plan)}})
//         }
//         res.status(200).send(searchResults)

//     }catch(err){
//         console.log(err)
//         res.status(500).send("Something went wrong !!")
//     }
// }

exports.getAllVendors=getAllVendors;
exports.getVendorById=getVendorById;
exports.createVendor=createVendor;
exports.loginVendor=loginVendor;
exports.logoutVendor=logoutVendor;
exports.editVendorByID=editVendorByID;
exports.searchInVendors = searchInVendors;
exports.filterVendors = filterVendors;
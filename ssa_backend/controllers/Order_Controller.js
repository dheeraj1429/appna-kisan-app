const Orders_Schema = require("../modals/Orders");
const Utils = require("../utils/Utils");
const order_status = require("../utils/configs/order_status")
const { v4: uuidv4 } = require('uuid');
const generateOrderId = require('order-id')('key');
// create new order
const createNewOrder = async(req,res)=>{
    console.log(req.body);
    try{
        // const getOrdersCount = await Orders_Schema.find().count()
        // console.log("order_00"+(getOrdersCount+1))
        // const ordersCustomId = "order_00"+(getOrdersCount+1)
        // const getOrderId = uuidv4();
        const getOrderId = generateOrderId.generate();
        console.log(getOrderId);
        const create = new Orders_Schema({
            order_id:getOrderId,
            customer_phone_number:req.body.customer_phone_number,
            customer_id:req.body.customer_id,
            customer_name:req.body.customer_name?.toLowerCase(),
            customer_email:req.body.customer_email?.toLowerCase(),
            order_status:"pending",
            products:req.body.products,
            shipping_address:req.body.shipping_address,
            state:req.body?.state,
            pincode:req.body?.pincode,
            customer_gst:req.body?.customer_gst,
            customer_business:req.body?.customer_business
        });
        const result = await create.save();
        res.status(200).send({status:true,message:'order created successfully !!',result:result})
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong !!");
    }
}

// get all orders 
const getAllOrders = async(req,res)=>{
        try{
            const ordersCount = await Orders_Schema.find({}).count();
            const allOrders = await Orders_Schema.find({}).sort({createdAt:-1});
            res.status(200).send({allOrders:allOrders,ordersCount:ordersCount,order_status:order_status});

        }
        catch(err){
            console.log(err)
            res.status(500).send("something went wrong !!")
        }
}

// GET ORDER BY ID 
const getOrderById = async(req,res)=>{
    const orderId = req.params.order_id;
    try{
        if(!orderId){
            return res.status(404).send({status:404,message:'order not found !!'});
        }
        const findOrder = await Orders_Schema.findById(orderId);
        if(!findOrder){
            return res.status(404).send({status:404,message:'order not found !!'})
        }
        res.status(200).send({status:true,result:findOrder,order_status:order_status})

    }
    catch(err){
        console.log(err)
        res.status(500).send("something went wrong !!")
    }
}

// CHNAGE ORDER STATUS
const updateOrders=async(req,res)=>{
    const orderId = req.params.order_id;
    try{
        if(!orderId){
            return res.status(404).send({status:false,message:'order updation failed !!'})
        }
        const updateOrder = await Orders_Schema.findByIdAndUpdate(orderId,{$set:req.body});
        res.status(200).send({status:true,message:'order updated success !!'})

    }
    catch(err){
        console.log(err);
        res.status(500).send("something went wrong !!")
    }
}

// DELETE ORDER's
const deleteOrders=async(req,res)=>{
    try {
        if(req.body?.length){
            const deleteSelected= await Orders_Schema.deleteMany({
                _id:{
                    $in:req.body
                }
            })
            if(!deleteSelected){
                return res.status(200).send({message:"order delete failed",status:false})
            }
        return res.status(200).send({message:"order delete success",status:true})
 
        }
        
       
        
        res.status(200).send({message:"order delete failed",status:false})

    
  
    } catch (err) {
        console.log(err)
        res.status(200).send({message:"order delete failed",status:false})
    }
}

// search in orders table
const searchInOrders = async(req,res)=>{
    const searchValue = req.query.search
    const searchRegex = Utils.createRegex(searchValue);
    let result;
    // console.log("SEARCH===",searchValue)
    try{
        result = await Orders_Schema.find({order_id:{$regex:searchRegex}}).sort({createdAt:-1})
        if(!result.length > 0){
            result = await Orders_Schema.find({customer_name:{$regex:searchRegex}}).sort({createdAt:-1});
        }
        const numberField = parseInt(searchValue)
        // console.log(numberField)
        if (numberField) {
            // console.log(numberField)
            result =  await Orders_Schema.find({ 
                customer_phone_number:numberField
             }).sort({createdAt:-1})
             return res.status(200).send(result);
        }
        res.status(200).send(result)
    }
    catch(err){
        console.log(err);
        res.status(500).send("something went wrong !!")
    }
}

// FILTERS FOR ORDERS
const filterForOrders=async(req,res)=>{
    const {by_status,date_from,date_to,recentDays} = req.query
    let result;
    console.log("by_status,date_from,date_to,recentDays",by_status,date_from,date_to,recentDays)
    try{
        // console.log("date====",Utils.convertDate(date_from),"-----",Utils.convertDate(date_to))
        const endDate = new Date(`${date_to}`);
        // seconds * minutes * hours * milliseconds = 1 day 
        const dayTime = 60 * 60 * 24 * 1000;
        let increaseEndDateByOne = new Date(endDate.getTime() + dayTime);
        // console.log("INCREASED DATE",increaseEndDateByOne)


                // filter orders by todays date and by their status 
                let user_status;
        if(date_from && date_to && by_status ){ 
            if(by_status!= 'all'){
                //  user_status = by_status == 'verified' ? true : false
                result = await Orders_Schema.aggregate([{
                    $match:{
                    order_status:by_status,
                    createdAt:{
                        $lte:Utils.convertDate(increaseEndDateByOne),
                        $gte:Utils.convertDate(date_from)
                    }
                },
            }],).sort({createdAt:-1})
            console.log("RESULT NEW----",result)

            return res.status(200).send(result)
            }
        }
            else{
                result = await Orders_Schema.find({order_status:by_status}).sort({createdAt:-1})
                // return res.status(200).send(result)

            }


        if(date_from && date_to){
            result = await Orders_Schema.aggregate([{
                                $match:{
                                createdAt:{
                                    $lte:Utils.convertDate(increaseEndDateByOne),
                                    $gte:Utils.convertDate(date_from)
                                }
                            },
                        }],).sort({createdAt:-1})
                    console.log("RESULT NEW----",result)
                    return res.status(200).send(result)
             }
        if(by_status !="all" ){
                // let user_status = by_status === 'verified' ? true : false
                result = await Orders_Schema.find({order_status:by_status}).sort({createdAt:-1})
                console.log("RESULT NEW----",result)

                return res.status(200).send(result)
        }
    

    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}


exports.createNewOrder = createNewOrder;
exports.getAllOrders = getAllOrders;
exports.searchInOrders = searchInOrders;
exports.filterForOrders = filterForOrders;
exports.getOrderById = getOrderById;
exports.updateOrders = updateOrders;
exports.deleteOrders = deleteOrders;
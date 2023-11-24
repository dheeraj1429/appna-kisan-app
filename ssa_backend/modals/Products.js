const mongoose = require("mongoose")
const Products_Schema = new mongoose.Schema(
    {
        product_id:{
            type:String,
        },
        product_code:{
            type:String,
            
        },
        product_name:{
            type:String,
            required:true
        },
        product_slug:{
            type:String,
            required:true
        },
        product_variant:{
            type:String
        },
        product_price: {
            type: mongoose.Types.Decimal128,
            required: true
        },
        b2b_user_product_price: {
            type: mongoose.Types.Decimal128,
            required: true
        },
        b2c_user_product_price: {
            type: mongoose.Types.Decimal128,
            required: true
        },
        // product_gst:{
        //     type:Number
        // },
        // product_regular_price:{ 
        //     type:Number,
        //     required:true
        // },
        // product_sale_price:{
        //     type:Number,
        //     required:true
        // },
        new_arrival:{
            type:Boolean,
            default:false
        },
        product_price:{
            type:Number,
            
        },
        color:{
            type:String,
            default:'N/A'
        },
        size:{
            type:String,
            default:'N/A'
        },
        cartoon_total_products:{
            type:Number,

        },
        quantity:{
            type:Number,
            required:true
        },
        original_quantity:{
            type:Number,
            required:true
        },
        product_tag:{
            type:String,
        },
        
        // shop_name:{
        //     type:String,
        //     required:true
        // },
        // shop_id:{
        //     type:String,
        //     required:true
        // },
        product_images:[
            {
                image_name:{type:String},
                image_url:{type:String},
                path:{type:String}
            }
        ],
        product_main_category:{
            type:String,
            required:true
        },
        product_main_category_slug:{
            type:String,
            required:true
        },
        product_category:{
            type:String,
            required:true
        },
        product_category_slug:{
            type:String,
            required:true
        },
        product_subcategory:{
            type:String,
            required:true
        },
        product_subcategory_slug:{
            type:String,
            required:true
        },
        product_description:{
            type:String,
        },
        product_reward_points: {type: Number}
        // product_status:{
        //     type:String,
        //     required:true,
        //     default:"pending"
        // },
        // product_active:{
        //     type:Boolean,
        //     required:true,
        //     default:false
        // },
    },{timestamps:true}
)

module.exports = mongoose.model("Products",Products_Schema)
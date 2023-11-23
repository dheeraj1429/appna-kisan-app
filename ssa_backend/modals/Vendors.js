const mongoose = require("mongoose")
const Vendors_Schema = new mongoose.Schema(
    {
        firstname:{
            type:String,
            required:true,
        },
        lastname:{
            type:String,
        },
        profile:{
            image_name:{type:String},
            image_url:{type:String},
            path:{type:String}
        },
        password:{
            type:String,
            required:true
        },
        user_type:{
            type:String,
            required:true
        },
        verified:{
            type:Boolean,
            default:false
        },
        shop_id:{
            type:String,
            required:true
        },
        shop_name:{
            type:String,
            required:true
        },
        shop_location:{
            type:String,required:true
        },
        shop_address:[
            {
                pincode: { type: Number },
                state: { type: String },
                city: { type: String },
                street: { type: String },
                landmark: { type: String },
                houseNo: { type: String },
                mobileNo: { type: Number },
              },
        ],
        shop_type:{
            type:String,
            required:true
        },
        account_details:
            {
                account_no:{type:String,required:true},
                account_holder_name:{type:String,required:true},
                ifsc_code:{type:String,required:true},
                branch_name:{type:String,required:true}, 
            },
        delivery_method:[
            {
                name:{type:String}
            }
        ],
        gst_number:{
            type:String,
        },
        shop_email:{
            type:String,
            required:true
        },
        shop_contact:{
            type:Number,
            required:true
        },
        shop_image:[{
            image_name:{type:String},
            image_url:{type:String}
        }],
        aadhar_card_no:{
            type:Number,
            required:true
        },
        shop_status:{
            type:String,
            required:true
        },
        total_products:{
            type:Number,
            default:0
        },
        products_limit:{
            type:Number,
            required:true,
            default:25
        },
        shop_plan:{
            type:String,
            required:true,
            default:"free"
        }
    },{timestamps:true}
)

module.exports = mongoose.model("Vendors",Vendors_Schema)

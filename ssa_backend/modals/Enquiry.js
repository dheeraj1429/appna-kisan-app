const mongoose = require("mongoose")
const Enquiry_Schema = new mongoose.Schema(
    {
        order_id:{
            type:String,
            required:true
        },
        user_id:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        phone_number:{
            type:Number,
            required:true
        },
        message:{
            type:String,
            required:true
        }
       

    },{timestamps:true}
)

module.exports = mongoose.model("Enquiry",Enquiry_Schema)
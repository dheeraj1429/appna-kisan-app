const mongoose = require("mongoose")
const Admins_Schema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        user_type:{
            type:String,
            required:true
        }

    },{timestamps:true}
)

module.exports = mongoose.model("Admins",Admins_Schema)
const mongoose = require("mongoose")
const Banners_Schema = new mongoose.Schema(
    {
        image_name:{type:String},
        image_url:{type:String},
        path:{type:String},
        selected_category:{type:String},
        category_chain:{main_category:{type:String},
            category:{type:String},
            sub_category:{type:String}
        },
        bannerType: { type: String }
    },{timestamps:true}
)

module.exports = mongoose.model("Banners",Banners_Schema)
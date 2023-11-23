const mongoose = require("mongoose")
const Brands_Schema = new mongoose.Schema(
    {
        main_category_name:{
            type:String,
           
        },
        main_category_slug:{
            type:String,
        },
        main_category_image:{
            image_name:{type:String},
            image_url:{type:String},
            path:{type:String}
        },
        category_name:{
            type:String
        },
        category_image:{
            image_name:{type:String},
            image_url:{type:String},
            path:{type:String}
        },
        category_slug:{
            type:String
        },
        subcategory:[
            {
                name:{type:String},
                image:{ 
                    image_name:{type:String},
                    image_url:{type:String},
                    path:{type:String}
                },
                slug:{type:String},
                parent_main_category:{type:String},
                parent_category:{type:String}
            }
        ]
        

    },{timestamps:true}
)

module.exports = mongoose.model("Brands",Brands_Schema)
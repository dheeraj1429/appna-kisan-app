const { count } = require("../modals/Brands")
const Brands_Schema = require("../modals/Brands")
const {createRegex} = require("../utils/Utils")


// create category 
const createCategory = async(req,res)=>{
    // console.log(req.body)
    try{

        const findExistingCategory = await Brands_Schema.find({main_category_slug:req.body.main_category_slug?.toLowerCase(),category_slug:req.body.category_slug?.toLowerCase()})
        if(findExistingCategory.length > 0){
            return res.status(200).send({status:false,message:"category already exists in main category !!"})
        }
        // update category if main category does not have any category or sub category otherwise create a new one
        const findMainCategory = await Brands_Schema.find({main_category_name:req.body.mainCategory})
        console.log(findMainCategory)
        if(findMainCategory[0]?.category_name ){
            console.log("FIND SUCCESS=>",findMainCategory[0]?.category_name)

            const create = new Brands_Schema({
                main_category_name:req.body.mainCategory?.toLowerCase(),
                main_category_slug:req.body.main_category_slug?.toLowerCase(),
                main_category_image:req.body.mainCategoryImage,
                category_name:req.body.category?.toLowerCase(),
                category_slug:req.body.category_slug?.toLowerCase(),
                category_image:req.body.categoryImage,
                subcategory:req.body.subcategory
            })
            const result =  await create.save();
           return res.status(200).send({status:true,message:"success"})
            
        }else{
            console.log("------NOT FOUND-----")
            // console.log("NOT FOUND CATEGORY ",findMainCategory[0]?._id)
            const updateCategory = await Brands_Schema.findByIdAndUpdate(findMainCategory[0]?._id,
                {
                    $set:{
                            main_category_name:req.body.mainCategory?.toLowerCase(),
                            main_category_slug:req.body.main_category_slug?.toLowerCase(),
                            main_category_image:req.body.mainCategoryImage,
                            category_name:req.body.category?.toLowerCase(),
                            category_slug:req.body.category_slug?.toLowerCase(),
                            category_image:req.body.categoryImage,
                            subcategory:req.body.subcategory
                    }
                }
                
                )
                console.log("else block")
       return res.status(200).send({status:true,message:"success"})

        }
        res.status(200).send({status:true,message:"success"})

    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wroog !!")
    }

}

// create main category
const createMainCategory = async(req,res)=>{
    try{
        const findExistingCategory = await Brands_Schema.find({main_category_name:req.body.mainCategory?.toLowerCase()})
        if(findExistingCategory.length > 0){
            return res.status(200).send({status:false,message:"main category already exists !!"})
        }
        const create = new Brands_Schema({
            main_category_name:req.body.mainCategory?.toLowerCase(),
            main_category_slug:req.body.main_category_slug?.toLowerCase(),
            main_category_image:req.body.mainCategoryImage,
          
        })
        const result =  await create.save();
       return res.status(200).send({status:true,message:"success"})
    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}

// edit category by id
const editCategory = async(req,res)=>{
    const categoryId=req.params.category_id;
    console.log(req.body)
    try{
        if(!categoryId){
            return res.send("please provide a category id")
        }
        const findCategory = await Brands_Schema.findByIdAndUpdate(categoryId,{$set:req.body})
        if(!findCategory){
            return res.send("category not found")
        }
        res.status(200).send("category updated successfully !!")


    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}
// update main category
const updateMainCategory=async(req,res)=>{
    const oldMainCategory = req.query.old_main_category_name;

    const {main_category_name,main_category_slug,main_category_image} = req.body;
    console.log(oldMainCategory)
    console.log(req.body);
    try{
        if(oldMainCategory){
            const find = await Brands_Schema.find({main_category_name:oldMainCategory})
            console.log("FIND___",find)
            if(find?.length > 0){
                const updateAll = await Brands_Schema.updateMany({main_category_name:oldMainCategory},
                    {
                        $set:{
                            main_category_name:main_category_name?.toLowerCase(),
                            main_category_slug:main_category_slug?.toLowerCase(),
                            main_category_image
                        }
                    }
                ) 
                return res.status(200).send({messgae:"updated success !!",update:updateAll})
            }
        }
        res.status(404).send("not found !!")

    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}

// DELETE IMAGE 
const deleteImage = async(req,res)=>{
    const oldMainCategory = req.query.old_main_category_name;
    const oldCategory = req.query.old_category_name;
    const oldSubCategory = req.query.old_sub_category_name;
    const oldSubId = req.query.sub_category_id;
    try{
        if(oldMainCategory){
            const find = await Brands_Schema.find({main_category_name:oldMainCategory});
            if(find?.length > 0){
                const removeImage = await Brands_Schema.updateMany({main_category_name:oldMainCategory},
                        {$set:{
                            main_category_image:{}
                        }}
                    )
                    return res.status(200).send({status:true, message:"image deleted success !!"})
            }
        }
        if(oldCategory){
            const findCategory = await Brands_Schema.find({category_name:oldCategory});
            console.log(findCategory);
            if(findCategory?.length > 0 ){
                const removeImage = await Brands_Schema.updateMany({category_name:oldCategory},
                    {
                        $set:{
                            category_image:{}
                        }
                    }
                )
                return res.status(200).send({status:true, message:"image delete success !!"})
            }
        }
        if(oldSubId && oldSubCategory){
            console.log("old sub category=>",oldSubId,"--",oldSubCategory);
            const findSubCategroy = await Brands_Schema.find({_id:oldSubId,"subcategory.name":oldSubCategory});
            console.log("findSubCategroy",findSubCategroy);
            if(findSubCategroy?.length > 0 ){
              
                let result = findSubCategroy[0]?.subcategory;
                // console.log("RESULT BEFORE=>",result)
               await result?.map((value,index)=>{
                // console.log("oldSubCategory",oldSubCategory)
                    if(value.name === oldSubCategory){
                        // console.log("ENTERED")
                        result[index].image = {image_name:'',
                        image_url:'',
                        path:''}
                    }
                    // console.log("EXIT")

                })
                // console.log("resutl=>",result)

                const updateSubCategory = await Brands_Schema.findByIdAndUpdate({_id:oldSubId},{$set:{subcategory:result}})
                // console.log("updateSubCategory=>",updateSubCategory)
                return res.status(200).send({status:true,message:"image delete success !!"})

            }
        }
        res.status(200).send({status:false, message:"image delete failed !!"})

    }
    catch(err){
        console.log(err)
        res.status(200).send({messgae:"Something went wrong !!"})
    }
}


// get all category 
const getAllCategory = async(req,res)=>{
    try{
        const countCategory = await Brands_Schema.find({}).count()
        const categoryForFilter = await Brands_Schema.aggregate([
            {$group:{_id:"$main_category_name"}}
        ]).sort({_id:1})
        //  console.log(categoryForFilter)
        const allCategory = await Brands_Schema.find({})
        res.status(200).send({all_categories:allCategory,countCategory:countCategory,categoryForFilter:categoryForFilter})

    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wroog !!")
    }

}

// get category by id
const getCategoryById=async(req,res)=>{
    const cat_id = req.params.category_id;
    try{
        if(!cat_id){
            return res.status(200).send("please provide a category id")
        }
        const getCategoires = await Brands_Schema.findById(cat_id)
        if(!getCategoires){
            return res.status(404).send("not found !!")
        }
        res.status(200).send(getCategoires);
    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}



// category Filter 
const filterForCategory = async(req,res)=>{
    const {main_category} = req.query;
    let result;
    try{
        if(main_category){
            result = await Brands_Schema.find({main_category_name:main_category})
            console.log(result)
            return res.status(200).send(result); 
        }

        res.status(200).send(result)
    }
    catch(err){
        console.log(err)
        res.status(500).send("Somthing went wrong !!")
    }
}

// search in category 
const searchInCategory=async(req,res)=>{
    const searchValue = req.query.search;
    const searchRegex= createRegex(searchValue);
    let result;
    try{
        const countCategory = await Brands_Schema.find({}).count()
         result = await Brands_Schema.find({main_category_name:{$regex:searchRegex}})
        if(!result.length ){
            result = await Brands_Schema.find({category_name:{$regex:searchRegex}});
            if(!result.length){
                result = await Brands_Schema.find({"subcategory.name":{$regex:searchRegex}})
            }
        }

        res.status(200).send({result:result,countCategory:countCategory})

    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}

// add product category 
const mainCategoryForProduct=async(req,res)=>{
    try{
        // const countCategory = await Brands_Schema.find({}).count()
        const categoryForFilter = await Brands_Schema.aggregate([
            {$group:{_id:"$main_category_name",main_category_image:{$first:'$main_category_image'}} },
            {
                $project:{
                     main_category_image:1,
                     _id:1
                }
            }
    
        ]).sort({_id:1})
        //  console.log(categoryForFilter)
        // const allCategory = await Brands_Schema.find({})
        res.status(200).send(categoryForFilter)

    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}

// get  category by main category for add product
const getCategoryByMainCategory = async(req,res)=>{
    const main_category = req.query.main_category?.toLowerCase();
    const categoryID = req.query.category_id?.toLowerCase();
    const category = req.query.category?.toLowerCase();
    console.log("BRANDS--",main_category , category)
    try{
        if(main_category){
            const findCategory = await Brands_Schema.aggregate([
                {$match:{main_category_name:main_category}},
                {$project:{category_name:1}}
            ]).sort({_id:1})

            // console.log("FIND CATEGORY==>",findCategory)
            return res.status(200).send(findCategory)
        }   
        // if(categoryID){
        //     const findSubCategroy= await Brands_Schema.findById(categoryID)
        //     .select("subcategory").sort({"subcategory.name":1})
       
        //     return res.status(200).send(findSubCategroy)

        // }
        if(category){
        
            const findCategory = await Brands_Schema.aggregate([
                {$match:{category_name:category}},
                {$project:{subcategory:1}}
            ]).sort({_id:1})

            console.log("FIND CATEGORY==>",findCategory)
            return res.status(200).send(findCategory)
        } 
        res.status(200).send("Not found !!") 
    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wroog !!")
    }

}


// delete category
const deleteCategory=async(req,res)=>{
    // const categoryId= req.params.category_id
    // console.log(categoryId)
    console.log("body=>",req.body)
    console.log("body=>",req.body?.length)
    try {
        if(req.body?.length){
            const deleteSelected= await Brands_Schema.deleteMany({
                _id:{
                    $in:req.body
                }
            })
            if(!deleteSelected){
                return res.status(200).send({message:"image not deleted",status:false})
            }
        return res.status(200).send({message:"image delete success",status:true})
 
        }
        
       
        
        res.status(200).send({message:"image not deleted",status:false})

    
  
    } catch (err) {
        console.log(err)
        res.status(200).send({message:"image not deleted",status:false})
    }
}



exports.getAllCategory=getAllCategory;
exports.getCategoryByMainCategory=getCategoryByMainCategory;
exports.createCategory=createCategory;
exports.updateMainCategory=updateMainCategory;
exports.editCategory = editCategory;
exports.getCategorysById = getCategoryById;
exports.searchInCategory = searchInCategory;
exports.filterForCategory = filterForCategory;
exports.mainCategoryForProduct = mainCategoryForProduct;
exports.deleteImage = deleteImage;
exports.deleteCategory = deleteCategory;
exports.createMainCategory = createMainCategory;
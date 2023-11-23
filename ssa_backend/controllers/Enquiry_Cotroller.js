const Enquiry_Schema = require("../modals/Enquiry");


// get all enquiries 
const getAllEnquires = async(req,res)=>{
    try{
        const findAll = await Enquiry_Schema.find({});
        res.status(200).send(findAll);

    }
    catch(err){
        console.log(err);
        res.status(500).send("something went wrong !!")
    }
}

// 

exports.getAllEnquires = getAllEnquires;
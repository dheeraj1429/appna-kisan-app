const Admin_User_Schema = require("../modals/Admins")
const Utils = require("../utils/Utils")


// creating new user 
const createUser = async(req,res)=>{
    const {name,email,password,user_type} = req.body;
    try{
        const findUser = await Admin_User_Schema.findOne({email:email})
        if(findUser){
            return res.send("User Already Exists !!")
        }
        const hashedPassword = await Utils.Hashing_Password(password)
        const create = new Admin_User_Schema({
            name:name?.toLowerCase(),
            email:email,
            password:hashedPassword,
            user_type:user_type?.toLowerCase()
        }) 
        const result = await create.save();
        res.status(200).send({result:result,message:"created user successfully !!"})

    }
    catch(err){
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}


// Login user 
const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try{
       const findUser = await Admin_User_Schema.findOne({email:email})
       if(!findUser){
        return res.send({status:"fail",message:"Invalid email or password !!"})
       }
       let isValidPassword=false;
       if(findUser){
        try{
            isValidPassword = await Utils.compare_Password(password,findUser.password)
        }catch(err){
            console.log(err)
            res.send("Something went wrong !!")
        }
        if(!isValidPassword){
            return res.send({status:false,message:"Invalid email or password !!"})
        }
        if(isValidPassword){
            const token = await Utils.create_Jwt(
                {id:findUser._id,user_type:findUser.user_type},
                process.env.JWT_TOKEN_SECRET
                )
            res.cookie("jwt",token,
            {
                httpOnly:true,
                maxAge: 24 * 60 * 60 * 1000, //1 hrs
                sameSite: 'none', secure: true
            }
            )
            return res.status(200).send({status:true,message:"Logged in Success !!"})
        }
       }
    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")

    }
}

// logout user
const logoutUser = async(req,res)=>{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).send("Logout Success !!")
}


//getting all users
const getAllUser = async(req,res)=>{
    try{
        const alluser = await Admin_User_Schema.find({},"-password")
        res.status(200).json(alluser)

    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}


// get user by id (who's logged in)
const getUserById = async (req,res)=>{
    try{
        const cookie = req.cookies["jwt"]
        if(!cookie){
            return res.send({status:false,message:"Unauthenticated !!"})
        }
        const verifyJwt = await Utils.verifying_Jwt(cookie,process.env.JWT_TOKEN_SECRET)
        if(!verifyJwt){
            return res.send({status:false,message:"Unauthenticated !!"})
        }
        const findUser = await Admin_User_Schema.findById(verifyJwt.id ,"-password")
        if(!findUser){
            return res.send({status:false,message:"Unauthenticated !!"})
        }
        res.status(200).send({status:true,result:findUser});
    }
    catch(err){
        console.log(err)
        res.status(500).send({status:false,message:"Unauthenticated !!"})
    }
}

// edit admin by id
const editAdminByID = async(req,res)=>{
    const adminId=req.params.admin_id;
    try{
        if(!adminId){
            return res.send("please provide a admin id")
        }
        if(req.body.password){
            const hashedNewPassword = await Utils.Hashing_Password(req.body.password)
            const find = await Admin_User_Schema.findByIdAndUpdate(adminId,{password:hashedNewPassword})
            if(!find){
                return res.send("admin not found")
            }
            return res.status(200).send("Password Updated success")
        }
        const findUser = await Admin_User_Schema.findByIdAndUpdate(adminId,{$set:req.body})
        if(!findUser){
            return res.send("admin not found")
        }
        res.status(200).send("admin updated successfully !!")


    }catch(err){
        console.log(err)
        res.status(500).send("Something went wrong !!")
    }
}

exports.getAllUser = getAllUser;
exports.getUserById = getUserById;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.createUser = createUser;
exports.editAdminByID = editAdminByID;

const Utils = require("../utils/Utils")

// vendor check auth
const userCheckAuth = async(req,res,next)=>{
    const token = req.cookies["jwt"]
    try{
        if(!token){
            return res.status(401).send("Unauthenticated")
        }
        const verifyToken = await Utils.verifying_Jwt(token,process.env.JWT_TOKEN_SECRET);
        if(!verifyToken){
            return res.status(401).send("Unauthenticated")
        }
        next();
    }
    catch(err){
        console.log(err)
        res.status(401).send("Unauthenticated")
    }
}

exports.userCheckAuth = userCheckAuth;
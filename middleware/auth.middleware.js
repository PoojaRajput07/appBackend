import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js";
export async function verifyUser(req,res,next){
    try{
        
        const token= req.cookies?.AccessToken||req.header("authorization")?.replace("Bearer ","");
        console.log(req.cookies);
        console.log("nkj" ,req.cookies.AccessToken);
        console.log(token);
        if(!token){
            console.log("logout user not found")
            return res.status(400).json({
                message:"no user found",
            })
            
        }
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken)
        if(!decodedToken){
            console.log("token not matched in middleware");
            return res.status(400).json({
                message:"user not found"
            })
            
        }
        const user=await User.findById(decodedToken?._id).select("-password");
        if(!user){
             return res.status(400).json({
                message:"user not found"
            })
        }
        req.user=user;
        next();
    }catch(error){
        console.log("user is not logged in so cant be logged out",error.message)
        return res.status(400).json({message:"user not verify"});

    }

}
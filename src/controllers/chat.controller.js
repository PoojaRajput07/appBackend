import { generateStreamToken } from "../../lib/stream.js";

export async function getStreamToken(req,res){
    try{
        console.log("token user",req.user);
        const token=await generateStreamToken(req.user._id);
        console.log("generated token",token);
        res.status(200).json({token:token})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"internal server errror"})
        
    }


}
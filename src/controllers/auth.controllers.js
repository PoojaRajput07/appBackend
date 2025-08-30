import { upsertStreamUser } from "../../lib/stream.js";
import { User } from "../../models/User.model.js";
import jwt from "jsonwebtoken";
const generateAccessTokennAndRefreshToken=async(userID)=>{
   try {
     const user=await User.findById(userID);
     console.log("user mil gya");
    const AccessToken=await user.generateAccessToken();
    console.log("access token dedeya")
    const RefreshAccessToken=await user.generateRefreshToken();
    console.log("refrsh token bhi bn gya hai ")
    user.RefreshToken=RefreshAccessToken;
    console.log("rt db mai save kr deya")
   
    await user.save({validateBeforeSave:false});
    console.log(AccessToken,RefreshAccessToken);
     return{AccessToken,RefreshAccessToken};
   } catch (error) {
    console.log("refreash and access token cant created");
    return null;
    
   }

}
export async function Signup(req,res) {
    const{fullname,email,password}=req.body;
    try {
        if(!fullname||!email||!password){
            return res.status(404).json({message:"all fields are required"});
        }
        if(password.length<=6){
            return res.status(400).json({message:"password must be of length more than 6"});
        }
        const exitUser=await User.findOne({
            $or:[{fullname},{email}],
        });
        if(exitUser){
            return res.status(409).json({message:"email already exist"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"invalid email"})
        }
        const idx=Math.floor(Math.random()*100)+1;
        const randomavatar= `https://avatar.iran.liara.run/public/${idx}.png`;
    const newuser=await User.create({
        fullname,
        email,
        password,
        avatar:randomavatar,

    })
    //todo:create the user in the stream as well 
   try {
     await upsertStreamUser({
         id:newuser._id,
         name:fullname,
         image:newuser.avatar||"",
        
     })
      console.log("stream user created ");
   } catch (error) {
    console.log("stream user created error ")
    ,error.message
   }
     const { AccessToken, RefreshAccessToken } = await generateAccessTokennAndRefreshToken(newuser._id);
    const createduser= await User.findById(newuser?._id).select("-password");
   

res.status(200)
  .cookie("AccessToken", AccessToken)
  .cookie("RefreshToken", RefreshAccessToken)
  .json({
    message: "signup successfully",
    user: createduser
  });

  
   
}catch(error){
    res.status(404).json({message:"signup failed",error:error});

}
}

export async function login(req,res){
    
   try {
    const{email,password}=req.body;
    console.log("destructing is done");
    if(!email||!password){
        return res.status(400).json({
            message:"all field are required "
        })
    }
    const user= await User.findOne({email});
    if(!user){
     return res.status(401).json({message:"no email found"})
    }
    const validPassword=await user.isPasswordCorrect(password);
    if(!validPassword){
        toast.error("incorrect password ")
     return res.status(404).json({message:"password is not correct"});

    }
     const{AccessToken,RefreshAccessToken}=await generateAccessTokennAndRefreshToken(user._id);
     const loggeduser=await User.findById(user._id).select("-password -RefreshAccessToken");
   
    return res.status(200)
    .cookie("AccessToken",AccessToken)
    .cookie("RefreshToken",RefreshAccessToken)
    .json(
        {
            message:"logged in successfully",
            user:loggeduser,
            refreshtoken:RefreshAccessToken,
            AccessToken:AccessToken
        }
    )
   } catch (error) {
    res.status(400).json({
        message:"cant login in",
        error:error.message
    })
    console.log(error)
    
   }
}


export async function logout(req,res){
   await User.findByIdAndUpdate(req.user._id,{
    $set:{
        RefreshToken:null
    }
   },{new:true})

   const options={
    httpOnly:true,
    secure:true

   }
    return res.status(200).clearCookie("RefreshToken",options)
   .clearCookie("AccessToken",options)
   .json({
    message:"logout successfully",
   })
   
}


export async function onboard(req,res){
    try {
        const{fullname,bio,location,nativelanguage,learninglanguage,avatar}=req.body;
        if(!fullname||!bio||!location||!nativelanguage||!learninglanguage){
            return res.status(400).json({
                message:"all fields are required"
            })
        }
        const user=await User.findByIdAndUpdate(req.user?._id,{
            $set:{
                fullname,
                bio,
                location,
                nativelanguage,
                learninglanguage,
                isonboarded:true,
                avatar
    
            }
        },{
            new:true
        })
        return res.status(200).json({
            message:"onboarded successfully",
            user:{user},
        })
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({message:"no user found"});
        
    }

}
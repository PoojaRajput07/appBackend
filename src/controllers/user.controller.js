import mongoose from "mongoose";
import { User } from "../../models/User.model.js";
import { friendRequest} from "../../models/friendRequest.model.js";

export  async function recommendedFriends(req,res){
    try {
        const user=await User.findById(req.user?._id);
        const recommendedUser= await User.find({
            $and:[
                
                    {_id:{$ne:user._id}},//ne means not equal to user id 
                    {_id:{$nin:user.friends}},//not include friends to be in recommended friends list 
                    {isonboarded:true}
    
                
            ]
            
        })
        return res.status(200).
        json({
            message:"recommended user",
            recommendations:recommendedUser
        })
    } catch (error) {
        console.log(error.message)
       return  res.status(400).json({
            message:"failed to get recommended user"
        })
        
    }


}

export async function myFriends(req,res){
    const user=await User.findById(req.user?._id);
    const userId=req.user?._id;
    if(!user){
        console.log("user hi nhi hai jiske friends dekhna chate ho ")
        return res.status(400).json({
            message:"no user found"
        })
    }
    // const friends=await User.aggregate([
    //     {
    //         $match:{
    //             _id:new mongoose.Types.ObjectId(userId)
    //         },

    //     },
    //     {
    //         $lookup:{
    //             from:"users",
    //             localField:"friends",
    //             foreignField:"_id",
    //             as:"friendslist"
    //         }
    //     }
    // ])
    const friends=await user.populate("friends","avatar fullname location bio nativelanguage learninglanguage");
    // console.log(friends);
    return res.status(200)
    .json(
        {
            message:"here is your friendsList",
            friends:friends.friends
        }
    )

    }

export async function sendfriendRequest(req,res){
    try {
        const user=await User.findById(req.user._id);
        const{id:requestId}=req.params;
        const requestedUser=await User.findById(requestId);
        if(requestId.toString()===req.user._id.toString()){
            return res.status(400).json({
                meassage:"you cant sent request to yourself"
            })
        }
        if(!requestedUser){
            return res.status(400).json({
                message:"no such user exist",
            })
        }
        if(requestedUser.isonboarded===false){
            return res.status(400).json({
                message:"the user is not onboarded"
            })
        }
        //if already sent friendrequest
        const existingRequest=await friendRequest.findOne({
            $or:[
               {receiver:user._id,sender:requestId},
               {sender:requestId,receiver:user._id}
        ]
        })
        if(existingRequest){
           return  res.status(400).json({
                message:"already sent request"
            })
        }
       
       //if already  friend
       if(requestedUser.friends.includes(user._id)){
        return res.status(401).json({message:"already friends"})
       }
       const FriendRequest=await friendRequest.create({
        sender:user._id,
        receiver:requestedUser._id,
        
       })
       return res.status(200).json({
        message:"friend request sent!!",
        friendRequest:FriendRequest
       })
    } catch (error) {
        console.log(error.message),
        res.status(500).json({
            message:"cant sent request"
        })
        
    }

 
}

export async function accceptRequest(req,res){
    try {
        const user=await User.findById(req.user._id);
        const{id:requestedId}=req.params;
        console.log("url id ",requestedId);
        const FriendRequest=await friendRequest.findById(requestedId);
        if(!FriendRequest){
            console.log(FriendRequest);
            return res.status(400).json({
                message:"friendrequest document not found"
            })
        }
        console.log("friendrequest ke receiver ki id ",FriendRequest.receiver.toString()),
        console.log("user ki id",user._id.toString())
        if(FriendRequest.receiver.toString()!=user._id.toString()){
            return res.status(400).json({
                message:"you are not user so you ant accept the request"
            })
        }
        FriendRequest.status="accepted"
        await FriendRequest.save();
        await User.findByIdAndUpdate(FriendRequest.sender,{
            $addToSet:{friends:FriendRequest.receiver}
        })
         await User.findByIdAndUpdate(FriendRequest.receiver,{
            $addToSet:{friends:FriendRequest.sender}
        })
       return res.status(200).json({
        message:"accepted successfully"
       })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message:"server error"
        })
        
    }
}

export async function friendList(req,res){
   try {
    const user=await User.findById(req.user._id);
    const pendingRequest=await friendRequest.find({
        $and:[//jinhone muje request bheji hai 
            {receiver:user._id},
            {status:"pending"}
        ]
    }).populate("sender","avatar fullname nativelanguage learninglanguage")
    const acceptedRequest=await friendRequest.find({
        $and:[//jinki request mene accept krli
            {receiver:user._id},
            {status:"accepted"}
    ]
   }).populate("sender","fullname avatar nativelanguage learninglanguage bio")
   res.status(200).json({
    message:"incomingRequest and acceptedRequest find",
    pendingRequest:pendingRequest,
    acceptedRequest:acceptedRequest
   })
} catch (error) {
    console.log(error.message);
    return res.status(500).json({
        message:"server error"
    })
    
   }
}

export async function outgoingFriendRequest(req,res){//tune jinhe friend request bheji
    try {
        const user=req.user._id;//hue hai pr abhi accept nhi huee
        const requestSentTo=await friendRequest.find({
            $and:[
                {
                    sender:user._id,
                    status:"pending"
                }
            ]
        }).populate("receiver","avatar fullname nativelanguage learninglanguage");
        return res.status(200).json({
            message:"you have sent request to ",
            requestSentToPeople:requestSentTo
        })
    
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message:"server error "
        })
        
    }
}
import mongoose from "mongoose";
const friendRequestSchema=new mongoose.Schema(
    {
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        receiver:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        status:{
            type:"string",
            enum:["accepted" ,"pending"],
            default:"pending"
        }

},{timestamps:true})
export const friendRequest=mongoose.model("friendRequest",friendRequestSchema);
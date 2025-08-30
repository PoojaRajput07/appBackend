import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema(
    {
        fullname:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:"true",
            unique:"true",
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        avatar:{
            type:String
        },
        bio:{
            type:String,
            default:""

        },
        location:{
            type:String,

        },
        nativelanguage:{
            type:String
        },
        learninglanguage:{
            type:String
        },
        isonboarded:{
            type:Boolean,
            default:false
        },
        friends:[ //this is a array containing friend(user) id's
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"

            }
        ],
        RefreshToken:{
            type:String
        }


}
,{
    timestamps:true
}
)
//pre hook
userSchema.pre("save",async function(next){
 if(!this.isModified("password"))return(next);
 this.password=await bcrypt.hash(this.password,10);
 next();
})

 userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
 }
 userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
       _id:this._id,
       email:this.email,
       fullname:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })

    

 }
 userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
 }
export const User= mongoose.model("User",userSchema);




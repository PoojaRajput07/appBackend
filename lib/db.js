import mongoose from "mongoose"
export const connectDB=async()=>{
    try{
       const conn= await mongoose.connect(process.env.MONGO_URI);
       console.log(`mongodb conect successfully ,${conn.connection.host}`)
    }catch(error){
        console.log("mongoDB connection failed")
        process.exit(1)  //failed process
    }

}
import pkg from 'stream-chat';
const { StreamChat } = pkg;
import "dotenv/config"
const apikey=process.env.STREAM_API_KEY
const apiSecretKey=process.env.STREAM_API_SECRET_KEY
if(!apikey||!apiSecretKey){
    console.error("stream api key or secreat key is not valid")
}
    const streamClient=StreamChat.getInstance(apikey,apiSecretKey);
    export const upsertStreamUser=async(userData)=>{
        try {
            await streamClient.upsertUser(userData)//create or update
            return userData; 

            
        } catch (error) {
            console.log(error.message);
            
        }


    }
    export const generateStreamToken=async(userId)=>{
        try {
           const userStringID= await userId.toString();
           return streamClient.createToken(userStringID)
            
        } catch (error) {
            console.log(error.message);
            
        }

    }

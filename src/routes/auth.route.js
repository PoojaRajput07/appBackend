import express from "express";
import {login, logout, onboard, Signup} from "../controllers/auth.controllers.js";
import { verifyUser } from "../../middleware/auth.middleware.js";
export const router=express.Router();
router.route("/signup").post(Signup);

router.route("/login").post(login);
router.route("/logout").post(verifyUser,logout);
router.route("/onboard").post(verifyUser,onboard);
//TO GET LOGGED IN USER DETAILS 
router.route("/me").get(verifyUser,(req,res)=>{
    return res.status(200).json({
        message:"logged in user info",
        user:req.user
    })

})
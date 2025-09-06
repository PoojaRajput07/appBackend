import express from "express"
import { verifyUser } from "../../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";
export const chatRouter=express.Router();
chatRouter.route("/token").get(verifyUser,getStreamToken);

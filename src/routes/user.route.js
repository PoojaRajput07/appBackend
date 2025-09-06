import express from "express"
import { verifyUser } from "../../middleware/auth.middleware.js";
import { accceptRequest, friendList, myFriends, outgoingFriendRequest, recommendedFriends, sendfriendRequest } from "../controllers/user.controller.js";

export const userRouter=express.Router();
userRouter.route("/").get(verifyUser,recommendedFriends),
userRouter.route("/friends").get(verifyUser,myFriends)
userRouter.route("/sentfriendRequest/:id").post(verifyUser,sendfriendRequest);
userRouter.route("/acceptfriendRequest/:id").put(verifyUser,accceptRequest);
userRouter.route("/friendsList").get(verifyUser,friendList);
userRouter.route("/outgoingfriendrequest").get(verifyUser,outgoingFriendRequest);
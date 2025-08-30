import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/auth.route.js";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route.js";
import { chatRouter } from "./routes/chat.route.js";
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
   

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", router);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// Serve frontend in production

app.listen(port, () => {
    console.log(`app is live on port ${port}`);
    connectDB();
});

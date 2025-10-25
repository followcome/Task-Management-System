import express from "express";
import { getUserProfile } from "../controllers/user.js";
import {verifyToken} from "../utils/verifyToken.js";

const router = express.Router();

router.get("/profile", verifyToken,getUserProfile);

export default router;
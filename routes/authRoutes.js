import express from "express"
import { login, logOut, register } from "../controllers/auth.js";
import {verifyToken} from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",verifyToken,logOut);


export default router;
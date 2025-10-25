import express from "express";
import { createTask, deleteTask, getAllTasks, getUserTask, updateTask } from "../controllers/task.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/create_task",verifyToken,createTask);
router.get("/admin",verifyToken,verifyAdmin ,getAllTasks);
router.get("/",verifyToken,getUserTask);
router.put("/update_task/:id",verifyToken,updateTask);
router.delete("/delete_task/:id",verifyToken,deleteTask);



export default router;
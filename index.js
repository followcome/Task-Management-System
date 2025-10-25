import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import pool from "./db.js"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";



dotenv.config();

const app = express()

const PORT =process.env.PORT || 4210;
//middleware
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/task",taskRouter);




app.get("/",(req,res)=>{
    res.send("Task manager is running!")
});
///test db
app.get("/testdb",async(req,res)=>{
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        res.json(err)
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running...${PORT}`)
})
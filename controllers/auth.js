 import pool from "../db.js";
 import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";
 export const register=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        ///check if email already exist
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1",
            [email]
            
        );
        if (existingUser.rows.length > 0) return res.status(200).json({
            message:"Email is already registered"
        });
        ///hash password
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password,salt);
        ///insert into database
        const result = await pool.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
            [name,email,hashpassword]
        );
        const newUser = result.rows[0];
        res.status(201).json({
            message:"User registered successfully",
            user:{
                id:newUser.id,
                name:newUser.name,
                email:newUser.email,
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}
export const login =async(req,res)=>{
    try {
        
        const {email,password} = req.body;
        console.log("Email:", email);
console.log("Password:", password);

        ///check if user exist
        const user = await pool.query("SELECT * FROM users WHERE email =$1",[email])
        if(user.rows.length ===0) return res.status(400).json("Invalid email or password");
        console.log("User found in DB:", user.rows[0]);

            const userResult = user.rows[0];
        //compare password
        const isMatch = await bcrypt.compare(password,userResult.password);
        if(!isMatch) return res.status(400).json("invalid password or email")
            ///create jwt token
        const token = jwt.sign({
            id:userResult.id,email:userResult.email,is_admin:userResult.is_admin
        },process.env.JWT,
    {expiresIn:"1d"});
    res.cookie("access_token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite :"strict",
        maxAge:24 * 60 *60*1000,
    }) ;
    res.status(200).json({
        message:"Login successful",
        user:{
            id:userResult.id,
            name:userResult.name,
            email:userResult.email,
        }
    });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
        
    }
};
 export const logOut = (req,res)=>{
    console.log("user at logout",req.user);
        const user = req.user;
        res.clearCookie("token");
        res.status(200).json({
            message:"Logout successfully",
            user:user ?{
                id:user.id,email:user.email
            }:null 
        });
 };
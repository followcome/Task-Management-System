import pool from "../db.js";

export const getUserProfile = async(req,res)=>{
    //getting user from req.user
    try {
        const userId = req.user.id;
        const result = await pool.query("SELECT id,name,email FROM users WHERE id = $1",
            [userId]
        );
        res.status(200).json({
            message:"User profile fetched successfully",
            user:result.rows[0],
        });
        
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
        
    }
}
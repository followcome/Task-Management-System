import pool from "../db.js";
export const createTask=async(req,res)=>{
    try {
        const {title,description,completed} = req.body;
        const userId = req.user.id;
        const result =await pool.query("INSERT INTO tasks(user_id,title,description) VALUES ($1,$2,$3) RETURNING *",
            [userId,title,description]
        );
        res.status(200).json({
            message:"Task created successfully",
            task:result.rows[0],
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
        
    }
};

export const getAllTasks = async (req,res)=>{
    try {
        const result =await pool.query("SELECT * FROM tasks ORDER created_at DESC",
            
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
     res.status(500).json(err);   
    }
};
export const getUserTask = async(req,res)=>{
    try {
       const userId = req.user.id;
       const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
       )
       res.status(200).json(result.rows[0]);
    } catch (err) {
        
        res.status(500).json(err);
        
    }
};

export const updateTask = async(req,res)=>{
    try {
        const {id} = req.params;
        const {completed,title,description} = req.body;
        const userId = req.user.id;
        const result = await pool.query(`UPDATE tasks SET title = COALESCE($1,title),
            description = COALESCE($2 ,description),completed = COALESCE($3,completed)
            WHERE id = $4 AND user_id = $5 RETURNING *`,[title,completed,description,id,userId]
            );
            if(result.rows.length === 0){
                return res.status(404).json("Task not found or not yours");
            }
            res.status(200).json({
                message:"Task updated successfully",
                task:result.rows[0]
            });
    } catch (err) {
        
        res.status(500).json(err)
    }
}
export const deleteTask = async(req,res)=>{
    try {
        const {id} = req.params;
        const userId = req.user.id;
        const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
            [id,userId]
        )
        if(result.rows.length === 0) return res.status(404).json("Task not found or not yours");
        res.status(200).json("Task deleted successfully")
    } catch (err) {
        res.status(500).json(err);
    }
};
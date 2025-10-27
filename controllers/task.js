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
        const result =await pool.query("SELECT * FROM tasks ORDER BY created_at DESC",
            
        );
        res.status(200).json({
            message:"All tasks fetched successfully",
            total:result.rowCount,
            tasks:result.rows
        });
    } catch (err) {
     res.status(500).json(err);   
    }
};
export const getUserTask = async(req,res)=>{
    try {
        const userId = req.user.id;
        const {completed,search} = req.query;
        let completedBool;
        if(completed !== undefined){
            completedBool= completed.toLowerCase() ==="true"
        }

        let query = "SELECT * FROM tasks WHERE user_id = $1";
        let countQuery = "SELECT COUNT(*) FROM tasks WHERE user_id = $1";
        let values = [userId];
        let countValues = [userId]; 
        console.log(query)
        console.log(values)
        console.log(countQuery);
        console.log(countValues);
        ///ADD FILTERING
        if(completed){
            query+= " AND completed = $"+(values.length+1);
            countQuery+= " AND completed = $" +(values.length+1);
            values.push(completed ==="true");
            countValues.push(completed==="true");
        }
            console.log(query);
            console.log(values);
         ///ADD SEARCH BY TITLE
         if(search){
            query+= " AND title = ILIKE $"+(values.length+1);
            countQuery+=" AND title = ILIKE $" +(values.length+1);
            values.push(`%${search}%`);
            countValues.push(`%${search}%`);
        }
           console.log(query);
            console.log(values);
            console.log("After Search Count Query:", countQuery);
            console.log("After Search Count Values:", countValues);
            //ADD SORTING
            const {sortBy="created_at",order="desc"}=req.query
            //To avoid SQL injection,whitelist allowed colums
            const validColums = ["title","created_at","updated_at","completed"];
            const sortColumn = validColums.includes(sortBy)?sortBy:"created_at";

            ///Normalize order (asc or desc)
            const sortOrder=order.toLowerCase()==="asc"?"ASC":"DESC";
            
            query+=` ORDER BY ${sortColumn} ${sortOrder}`;
            console.log(query);
            ///ADD PAGINATION
            const {limit = 5 ,page=1}= req.query;
            const limitNumber =parseInt(limit);
            const offSet = (page-1) * limitNumber;
            query+=` LIMIT $${values.length +1} OFFSET $${values.length +2}`;
            values.push(limitNumber,offSet);
            console.log(query);
            console.log(values);

            // Count of total matching tasks (no limit/offset)
            const totalResult = await pool.query(countQuery, countValues);
            const totalRows = parseInt(totalResult.rows[0].count);
            
            //  Actual paginated tasks
            const dataResult = await pool.query(query, values);
            const tasks = dataResult.rows;
            
            console.log("Total Tasks:", totalRows);
            console.log("Paginated Tasks:", tasks);
            res.status(200).json({ total: totalRows, tasks });
    //    const userId = req.user.id;
    //    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
    //     [userId]
    //    )
    //    res.status(200).json(result.rows[0]);
    } catch (err) {
        console.log(err)
        
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
            WHERE id = $4 AND user_id = $5 RETURNING *`,[title,description,completed,id,userId]
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
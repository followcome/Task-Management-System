import pkg, { Pool } from "pg"
import dotenv from "dotenv"
dotenv.config();
const pool = new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    port:process.env.DB_PORT,

});
pool 
.connect().then(()=>console.log("Connected to postgreSQL"))
.catch((err)=>console.error(err));

export default pool;
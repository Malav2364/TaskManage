import {Pool} from 'pg';

const pool = new Pool({
    user : "malav2364",
    password : 'Msking007',
    database : "Task_Manager",
    port : 5432,
    host : 'taskmanage.c548geae6ll5.ap-south-1.rds.amazonaws.com'
})

export default pool;
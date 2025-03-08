import {Pool} from 'pg';

const pool = new Pool({
    user : "myuser",
    password : 'mypassword',
    database : "Task_Manager",
    port : 5432,
    host : 'localhost'
})

export default pool;
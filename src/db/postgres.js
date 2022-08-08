import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const connection = new Pool({
    host: process.env.HOST,
    port: process.env.CONNECTION_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_USER,
    database: process.env.DB_NAME
});

export default connection;
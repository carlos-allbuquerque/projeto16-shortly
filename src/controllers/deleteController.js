import connection from "../db/postgres.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export default async function deleteUrl(req, res) {
    const { urlId, token } = res.locals;

    const { rows } = await connection.query(`
    SELECT * FROM links WHERE "userId" = $1        
    `, [userId])

}
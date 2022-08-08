import joi from "joi";
import dotenv from "dotenv";
import connection from "../db/postgres.js";

dotenv.config();

export function urlMiddleware(req, res, next) {
    const { authorization } = req.headers;

    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send("token inválido")
    };
    
    res.locals.token = token;
    next();
} 

export async function getUrlByIdMiddleware(req, res, next) {
    const { id } = req.params;
    console.log(id);
    const numberId = parseInt(id);

    const { rows, rowCount } = await connection.query(`
    SELECT * FROM links WHERE id = $1
    `, [numberId]);

    if (!rowCount) {
        res.sendStatus(404);
    }
    console.log(rows[0]);
    res.locals.url = rows[0];

    next();
}

export async function redirectMiddleware(req, res, next) {
    const shortUrl = Number(req.params.shortUrl);

    console.log(shortUrl);
    const { rowCount, rows } = await connection.query(`
    SELECT * FROM links WHERE id = $1
    `, [shortUrl]);

    if (rowCount === 0) {
        return res.sendStatus(404);
    }
    console.log(rows);
    res.locals.url = rows[0].url;
    
    next();
}
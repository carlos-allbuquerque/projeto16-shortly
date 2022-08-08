import { nanoid } from "nanoid";
import connection from "../db/postgres.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function shortenUrl(req, res) {
    const token = res.locals.token;
    
    try{
        const { url } = req.body;
        const shortUrl = nanoid(8);
        const { sessionId } =  jwt.verify(token, process.env.JWT_KEY);
        console.log(sessionId);
        await connection.query(`
            INSERT INTO links (url, "shortUrl", "userId")
            VALUES ($1, $2, $3)
        `, [url, shortUrl, sessionId]); 
  
        return res.status(201).send({ shortUrl });
    }catch (error) {

        console.log(error.message);
        return res.sendStatus(500);
    }
}

export async function getUrlById(req, res) {
    const { id } = req.params;
    const url = res.locals.url;


    res.status(200).send(url);
}

export async function redirect(req, res) {
    const url = res.locals.url;

    res.redirect(url);

}
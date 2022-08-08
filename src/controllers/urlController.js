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
    const userId = res.locals.userId;

    const {rows} = connection.query(`
    UPDATE links SET "visitCount" = "visitCount" + 1 WHERE  links.url = $1 AND links."userId = $2"`, [url, userId]);

    res.redirect(url);
}

export async function getRanking(req, res) {
    
    try {
        const {rows} = await connection.query(`
            SELECT users.id, users.name,
            COUNT(links) as "linkCount",
            SUM(
                CASE WHEN links."visitCount" IS NULL THEN 0 ELSE links."visitCount" END
            ) as "visitCount"
            FROM users
            LEFT JOIN links ON links."userId"=users.id
            GROUP BY users.id
            ORDER BY "linkCount" DESC LIMIT 10
        `)
        return res.status(200).send(rows);
    }catch (error){
        console.log(error.message);
        return res.sendStatus(500);
    }
}

export async function getUserData(req, res) {
    const token = res.locals.token;

    try {
        const { sessionId } = jwt.verify(token, process.env.JWT_KEY);
        const userId = Number(sessionId);

        const { rows: userData } = await connection.query(`
            SELECT users.id, users.name FROM users WHERE users.id = $1
        `, [userId]);

        if (!userData) {
            return res.sendStatus(404);
        }

        const { rows: userLinksData } = await connection.query(`
            SELECT links.id, links."shortUrl", links.url, links."visitCount" 
            FROM links WHERE links."userId" = $1
        `, [userId]);

        const user = userData[0];
        const userLinks = userLinksData[0];
        const array = [userLinks];
        let visitsSum = 0;

        for (let i = 0; i < array.length; i++) {
            visitsSum += array[i].visitCount;
        }

        const mergedUser = {
            ...user,
            visitCount: visitsSum,
            shortenedUrl: [
                userLinks
            ]
        }
        
        return res.status(200).send(mergedUser);

    } catch (error){
        console.log(error.message);
        return res.sendStatus(500);
    }
}
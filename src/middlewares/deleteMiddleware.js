import connection from "../db/postgres.js";
import jwt from "jsonwebtoken";

export default async function deleteUrlMiddleware(req, res, next) {
    const { authorization } = req.headers;
    const { id } = req.params;
    console.log(id);
    const numberId = parseInt(id);

    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send("token inválido")
    };
    
    const { rowCont } = connection.query(`
        SELECT * FROM links WHERE id = $1
    `, [numberId]);

    if (!rowCont) {
        return res.sendStatus(404);
    }

    res.locals.token = token;
    res.locals.urlId = numberId;

    next();
}
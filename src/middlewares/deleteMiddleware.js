import connection from "../db/postgres.js";
import jwt from "jsonwebtoken";

export default async function deleteUrlMiddleware(req, res, next) {
    const { authorization } = req.headers;
    const id = req.params.id;
    console.log(id);
    const numberId = parseInt(id);

    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send("token inválido")
    };
    
    const { sessionId } =  jwt.verify(token, process.env.JWT_KEY);

    const { rowCont, rows } = await connection.query(`
        SELECT * FROM links WHERE id = $1
    `, [numberId]);

    if (rowCont === 0) {
        return res.sendStatus(404);
    }
    

    if (rows[0].userId !== sessionId) {
        return res.sendStatus()
    }

 

    res.locals.token = token;
    res.locals.urlId = numberId;

    next();
}
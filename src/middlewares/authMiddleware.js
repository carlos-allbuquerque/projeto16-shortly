import connection from "../db/postgres.js";
import { createAccountSchema } from "../schemas/authSchema.js";
import { loginAccountSchema } from "../schemas/authSchema.js";
import bcrypt from "bcrypt";


export default async function createUserMiddleware(req, res, next) {
    const newUser = req.body;
    
    const { error } = createAccountSchema.validate(newUser, {abortEarly: false});

    if (error) {
        return res.sendStatus(422);
    }

    if (newUser.password !== newUser.confirmPassword) {
        res.send(409)
    }

    const { rowCount } = await connection.query(`
    SELECT email FROM users WHERE users.email = $1
    `, [newUser.email]);

    if (rowCount) {
        return res.sendStatus(409);
    } 

    next();
}

export async function signInMiddleware(req, res, next) {
    const user = req.body;

    const { error } = loginAccountSchema.validate(user, {abortEarly: false});

    if (error) {
        return res.sendStatus(422);
    }

    const { rows, rowCount } = await connection.query(`
        SELECT * FROM users WHERE users.email = $1
    `, [user.email]);

    if (!rowCount || !bcrypt.compareSync(user.password, rows[0].password) ) {
        return res.sendStatus(401);
    }
    res.locals.userId = rows[0].id;

    next();
}

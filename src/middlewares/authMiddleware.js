import connection from "../db/postgres.js";
import joi from "joi";

export default async function createUserMiddleware(req, res, next) {
    const newUser = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required()
      });
    
    const { error } = userSchema.validate(newUser);

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
        return res.status(409).send("caiu aqui");
    } 

    next();
}
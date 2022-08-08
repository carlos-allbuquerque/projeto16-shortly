import connection from '../db/postgres.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export async function createUser(req, res) {
    const {name, email, password} = req.body;

    await connection.query(
      `INSERT INTO users (name, email, password) 
        VALUES ($1, $2, $3)`, [name, email, bcrypt.hashSync(password, 10)]
    );
  
    res.status(201).send('Usuário criado com sucesso');
}

export async function login(req, res) {
  const userId = res.locals.userId;

  try {
    await connection.query(`
      INSERT INTO sessions ("userId")
      VALUES ($1)`
    , [userId]);

    const { rows } = await connection.query(`
      SELECT "userId" from sessions WHERE "userId" = $1 
    `, [userId]);

    const sessionId = rows[0].userId;
    const token = jwt.sign({sessionId}, process.env.JWT_KEY);

    res.status(200).send(token);

  } catch {
    res.sendStatus(500);
  }
}


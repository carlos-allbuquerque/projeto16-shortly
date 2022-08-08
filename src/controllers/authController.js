
import connection from '../db/postgres.js';

export async function createUser(req, res) {
    const newUser = req.body;
      
    await connection.query(
      `INSERT INTO users (name, email, password) 
        VALUES ($1, $2, $3)`, [newUser.name, newUser.email, newUser.password]
    );
  
    res.status(201).send('Usuário criado com sucesso');
  }
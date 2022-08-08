import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/authRouter.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Servidor rodando na porta 5000'));
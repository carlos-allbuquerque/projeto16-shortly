import { createUser } from "../controllers/authController.js";
import createUserMiddleware from "../middlewares/authMiddleware.js";

import { Router } from "express";

const router = Router();

router.post('/user', createUserMiddleware, createUser);

export default router;
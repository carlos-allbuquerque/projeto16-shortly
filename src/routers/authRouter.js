import { createUser } from "../controllers/authController.js";
import createUserMiddleware from "../middlewares/authMiddleware.js";
import { signInMiddleware } from "../middlewares/authMiddleware.js";
import { login } from "../controllers/authController.js";

import { Router } from "express";

const router = Router();

router.post('/signup', createUserMiddleware, createUser);
router.post("/signin", signInMiddleware, login);

export default router;
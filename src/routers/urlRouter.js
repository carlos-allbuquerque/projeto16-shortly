import { Router } from "express";
import { shortenUrl } from "../controllers/urlController.js";
import { urlMiddleware } from "../middlewares/urlMiddleware.js";
import { getUrlById } from "../controllers/urlController.js";
import { getUrlByIdMiddleware } from "../middlewares/urlMiddleware.js";
import { redirect } from "../controllers/urlController.js";
import { redirectMiddleware, getUserDataMiddleware } from "../middlewares/urlMiddleware.js";
import deleteUrl from "../controllers/deleteController.js";
import deleteUrlMiddleware from "../middlewares/deleteMiddleware.js";
import { getRanking, getUserData } from "../controllers/urlController.js";

const router = Router();

router.post("/urls/shorten", urlMiddleware, shortenUrl);
router.get("/urls/:id", getUrlByIdMiddleware, getUrlById);
router.get("/urls/open/:shortUrl",redirectMiddleware, redirect);
router.delete("/urls/:id", deleteUrlMiddleware, deleteUrl);
router.get("/users/me", getUserDataMiddleware, getUserData);
router.get("/ranking", getRanking);

export default router;
import express from "express";
import clienteController from "../controllers/clienteController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware, clienteController.criar);
router.get("/", authMiddleware, clienteController.listar);

export default router;

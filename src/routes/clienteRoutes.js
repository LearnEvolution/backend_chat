/*import express from "express";
import clienteController from "../controllers/clienteController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware, clienteController.criar);
router.get("/", authMiddleware, clienteController.listar);

export default router;
*/
import express from "express";
import { createCliente, getClientes } from "../controllers/clienteController.js";

const router = express.Router();

router.post("/", createCliente);
router.get("/", getClientes);

export default router;  // ← AQUI É O QUE ESTÁ FALTANDO

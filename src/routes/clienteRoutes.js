import express from "express";
import { createCliente, getClientes } from "../controllers/clienteController.js";

const router = express.Router();

router.post("/", createCliente);
router.get("/", getClientes);

export default router;

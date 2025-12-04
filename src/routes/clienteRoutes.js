const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware, clienteController.criar);
router.get("/", authMiddleware, clienteController.listar);

module.exports = router;

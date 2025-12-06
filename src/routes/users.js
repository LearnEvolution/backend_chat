import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Retorna TODOS os usuários, exceto o próprio usuário logado
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("_id name email");

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

export default router;

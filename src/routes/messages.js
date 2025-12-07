import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// LISTAR MENSAGENS ENTRE DOIS USUÁRIOS
router.get("/:from/:to", async (req, res) => {
  try {
    const { from, to } = req.params;

    const messages = await Message.find({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    });

    res.json(messages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
});

export default router;

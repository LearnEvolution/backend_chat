import Cliente from "../models/Cliente.js";

export default {
  async criar(req, res) {
    try {
      const cliente = await Cliente.create(req.body);
      return res.json(cliente);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async listar(req, res) {
    const clientes = await Cliente.find();
    return res.json(clientes);
  },
};

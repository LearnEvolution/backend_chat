const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const clienteRoutes = require("./routes/clienteRoutes");
const messageRoutes = require("./routes/messages");

const app = express();

// 💥 CORS LIBERADO – ACEITA QUALQUER FRONTEND
app.use(cors({
origin: "*",
methods: ["GET", "POST", "PUT", "DELETE"],
allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ROTAS
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/clientes", clienteRoutes);
app.use("/messages", messageRoutes);

// CONEXÃO MONGO
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.error("❌ Erro ao conectar MongoDB:", err));

// SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log("🔥 Backend rodando na porta: ${PORT}");
});

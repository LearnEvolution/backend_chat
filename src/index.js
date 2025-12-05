import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();

// 💥 CORS LIBERADO PARA TODOS OS FRONTENDS
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

// DATABASE
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB conectado"))
.catch((err) => console.log("❌ Erro ao conectar Mongo:", err));

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🔥 Backend rodando na porta ${PORT}"));

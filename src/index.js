import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import clienteRoutes from "./routes/clienteRoutes.js";

import Message from "./models/Message.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Rotas HTTP
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/clientes", clienteRoutes);

const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
cors: {
origin: "*",
methods: ["GET", "POST"]
}
});

// AUTENTICAÇÃO DO SOCKET (agora decodifica o JWT de verdade!)
io.use((socket, next) => {
const token = socket.handshake.query.token;

if (!token) return next(new Error("NO_TOKEN"));

try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
socket.userId = decoded.id; // agora é o ID correto do MongoDB
next();
} catch (err) {
return next(new Error("INVALID_TOKEN"));
}
});

// CONEXÃO SOCKET.IO
io.on("connection", (socket) => {
console.log("🔥 Usuário conectado:", socket.userId);

socket.join(socket.userId);

// Receber e salvar mensagens
socket.on("private_message", async ({ to, text }) => {
console.log("📩 Mensagem recebida:", text);

// salva no banco
const msg = await Message.create({
  from: socket.userId,
  to,
  text
});

// envia para o destinatário
io.to(to).emit("private_message", msg);

// envia para quem mandou (para atualizar chat)
io.to(socket.userId).emit("private_message", msg);

});

socket.on("disconnect", () => {
console.log("❌ Usuário desconectado:", socket.userId);
});
});

// INÍCIO
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
console.log("🔥 Backend rodando na porta", PORT);
});

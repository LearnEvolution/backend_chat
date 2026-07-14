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

// ROTAS HTTP
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/clientes", clienteRoutes);

const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// AUTENTICAÇÃO SOCKET.IO
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) return next(new Error("NO_TOKEN"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    return next(new Error("INVALID_TOKEN"));
  }
});

// EVENTOS DO SOCKET
io.on("connection", (socket) => {
  console.log("🔥 Usuário conectado:", socket.userId);

  socket.join(socket.userId);

  socket.on("private_message", async ({ to, text }) => {
    const msg = await Message.create({
      from: socket.userId,
      to,
      text,
    });

    io.to(to).emit("private_message", msg);
    io.to(socket.userId).emit("private_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ Usuário desconectado:", socket.userId);
  });
});

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});
server.listen(PORT, () => {
  console.log(`🔥 Backend rodando na porta ${PORT}`);
});

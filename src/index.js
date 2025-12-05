import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// rotas REST
app.use("/auth", authRoutes);

// servidor HTTP
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// autenticação do socket
io.use((socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    console.log("❌ Socket sem token");
    return next(new Error("NO_TOKEN"));
  }

  socket.userId = token; // TEMPORÁRIO, só pra funcionar
  next();
});

// conexão
io.on("connection", (socket) => {
  console.log("🔥 socket conectado:", socket.id);

  socket.join(socket.userId);

  socket.on("private_message", (msg) => {
    io.to(socket.userId).emit("private_message", {
      from: socket.userId,
      text: msg,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ socket desconectado:", socket.id);
  });
});

// início
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log("🔥 Backend rodando na porta", PORT);
});

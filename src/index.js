import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// Permitir requisições do frontend
app.use(cors({
  origin: "https://frontendchat-musog-5105-learnevolutions-projects.vercel.app",
  credentials: true,
}));
app.use(express.json());

// Rotas do backend
app.get("/ping", (req, res) => {
  res.json({ msg: "pong" });
});

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://frontendchat-musog-5105-learnevolutions-projects.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Socket conectado:", socket.id);

  socket.on("private_message", (msg) => {
    console.log("Mensagem recebida:", msg);
    // envia de volta para todos os clientes conectados
    io.emit("private_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket desconectado:", socket.id);
  });
});

// Rodar servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));

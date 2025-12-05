import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);

const FRONTEND =
  "https://frontendchat-musog-5105-learnevolutions-projects.vercel.app";

app.use(
  cors({
    origin: FRONTEND,
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: FRONTEND,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔥 Cliente conectado:", socket.id);

  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Backend OK ✔️");
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`🔥 Backend rodando na porta: ${PORT}`);
});

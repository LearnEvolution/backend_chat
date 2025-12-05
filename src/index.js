const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

// conecta MongoDB
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

// autenticação
io.use((socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    console.log("❌ Socket sem token");
    return next(new Error("NO_TOKEN"));
  }

  socket.userId = token; // provisório
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

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log("🔥 Backend rodando na porta", PORT);
});

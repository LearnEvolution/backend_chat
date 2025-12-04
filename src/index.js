require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(helmet());

app.use(cors({
  origin: [
    "*"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use("/api/clientes", require("./routes/clienteRoutes"));

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: new Date() });
});

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log("🔌 Socket conectado:", socket.id);

  socket.on('join', ({ userId }) => {
    if (userId) socket.join(userId);
  });

  socket.on('private_message', ({ to, from, text }) => {
    if (!to || !from || !text) return;

    const payload = { from, text, createdAt: new Date() };

    io.to(to).emit('private_message', payload);
    socket.emit('private_message_sent', payload);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket desconectado:", socket.id);
  });
});

// Iniciar Servidor + MongoDB
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || 'chatdb'
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar MongoDB:", err.message);
    process.exit(1);
  });


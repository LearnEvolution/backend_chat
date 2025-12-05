const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const clienteRoutes = require("./routes/clienteRoutes");
const messageRoutes = require("./routes/messages");

const app = express();

app.use(cors({
origin: "*",
methods: ["GET", "POST", "PUT", "DELETE"],
allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/clientes", clienteRoutes);
app.use("/messages", messageRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB conectado"))
.catch((err) => console.log("❌ Erro MongoDB:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🔥 Backend rodando na porta ${PORT}"));

const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "chatdb",
    });
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Erro ao conectar MongoDB", err);
    process.exit(1);
  }
}

module.exports = connectDB;

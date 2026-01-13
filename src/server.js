import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("🚀 ====================================");
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🚀 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log("🚀 ====================================");
});

// Manejo de cierre graceful
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM recibido, cerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor cerrado correctamente");
  });
});

import express from "express";
import cors from "cors";
import helmet from "helmet";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import { success } from "zod";

const app = express();

// ========== MIDDLEWARES GLOBALES ==========

// Seguridad HTTP Headers
app.use(helmet());

//CORS - permite peticiones desde cualquier origen (ajustar en produccion)
app.use(cors());

//Parsear JSON en el body
app.use(express.json());

//Parsear datos de formularios
app.use(express.urlencoded({ extended: true }));

// Logging simple de peticiones (solo desarrollo)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ========== RUTAS ==========

// Ruta de healt check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la api
app.use("/api/tasks", taskRoutes);

// ========== MANEJO DE ERRORES ==========

// Capturar rutas no encontradas
app.use(notFound);

// Manejador global de errors
app.use(errorHandler);

export default app;

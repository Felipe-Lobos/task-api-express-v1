import { success } from "zod";

//Middleware para rutas no encontradas (404)
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no econtrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//Middleware para manejo centralizado de errores
export const errorHandler = (err, req, res, next) => {
  //si hay un status code, usarlo; sino 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // solo motrar stack trace en desarrollo
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

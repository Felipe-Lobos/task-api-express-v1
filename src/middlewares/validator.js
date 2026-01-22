import { z } from 'zod';

// Schema para crear tarea
export const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'El título es obligatorio')
    .max(100, 'El título no puede tener más de 100 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .nullish(),
  completed: z.boolean()
    .optional()
    .default(false)
});

// Schema para actualizar tarea
export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, 'El título es obligatorio')
    .max(100, 'El título no puede tener más de 100 caracteres')
    .optional(),
  description: z.string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .nullish(),
  completed: z.boolean()
    .optional()
});

// Middleware para validar datos
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validar y transformar datos
      req.validatedData = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};
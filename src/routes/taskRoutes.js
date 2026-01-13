import express from "express";
import { taskController } from "../controllers/taskController.js";
import {
  validate,
  createTaskSchema,
  updateTaskSchema,
} from "../middlewares/validator.js";

const router = express.Router();

// GET /api/tasks - Obtener todas las tareas
router.get("/", taskController.getAllTasks);

//GET /api/tasks/:id - Obtener tarea por id
router.get("/:id", taskController.getTaskById);

// POST /api/tasks - Crear nueva tarea
// validate() funciona como un middleware, y en express se pueden encadenar indefinidamente
// si validate() pasa correctamnete responde con un next(), y pasa a taskController
router.post("/", validate(createTaskSchema), taskController.createTask);

// PUT /api/tasks/:id - Actualizar tarea completa
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);

// DELETE /api/tasks/:id - Eliminar tarea
router.delete("/:id", taskController.deleteTask);

export default router;

import { success } from "zod";
import TaskModel from "../models/taskModel.js";
import { Prisma } from '@prisma/client';

export const taskController = {
  //obtener todas las tareas
  getAllTasks: async (req, res, next) => {
    try {
      const tasks = await TaskModel.getAll();

      res.json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener tareas por ID
  getTaskById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const task = await TaskModel.getById(id);

      if (!task) {
        res.status(404);
        throw new Error(`Tarea con ID ${id} no encontrada`);
      }

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },

  //Crear nueva tarea
  createTask: async (req, res, next) => {
    try {
      //los datos ya vienen validados por zod
      const taskData = req.validatedData;
      const newTask = await TaskModel.create(taskData);

      res.status(201).json({
        success: true,
        message: "Tarea creada exitosamente",
        data: newTask,
      });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar tarea
  updateTask: async (req, res, next) => {
    try {
      const { id } = req.params;
      const taskData = req.validatedData;

      const updatedTask = await TaskModel.update(id, taskData);

      res.json({
        success: true,
        message: "Tarea actualizada exitosamente",
        data: updatedTask,
      });
    } catch (error) {
      // Manejar error de registro no encontrado
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404);
          return next(new Error(`Tarea con ID ${req.params.id} no encontrada`));
        }
      }
      next(error);
    }
  },

  // Eliminar tarea
  deleteTask: async (req, res, next) => {
    try {
      const { id } = req.params;
      await TaskModel.delete(id);

      res.json({
        success: true,
        message: "Tarea eliminada exitosamente",
      });
    } catch (error) {
      // Manejar error de registro no encontrado
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404);
          return next(new Error(`Tarea con ID ${req.params.id} no encontrada`));
        }
      }
      next(error);
    }
  },
};

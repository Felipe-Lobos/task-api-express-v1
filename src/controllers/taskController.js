import { success } from "zod";
import TaskModel from "../models/taskModel.js";

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

      // Verificar que la tarea existe
      const existingTask = await TaskModel.getById(id);
      if (!existingTask) {
        res.status(404);
        throw new Error(`Tarea con ID ${id} no encontrada`);
      }

      // Merge de datos: mantener los antiguos si no se envían nuevos
      const dataToUpdate = {
        title: taskData.title || existingTask.title,
        description:
          taskData.description !== undefined
            ? taskData.description
            : existingTask.description,
        completed:
          taskData.completed !== undefined
            ? taskData.completed
            : existingTask.completed,
      };

      const updatedTask = await TaskModel.update(id, dataToUpdate);

      res.json({
        success: true,
        message: "Tarea actualizada exitosamente",
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  },

  // Eliminar tarea
  deleteTask: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Verificar que la tarea existe
      const existingTask = await TaskModel.getById(id);
      if (!existingTask) {
        res.status(404);
        throw new Error(`Tarea con ID ${id} no encontrada`);
      }

      const result = await TaskModel.delete(id);

      if (!result.deleted) {
        res.status(400);
        throw new Error('No se pudo eliminar la tarea');
      }

      res.json({
        success: true,
        message: "Tarea eliminada exitosamente",
      });
    } catch (error) {
      next(error);
    }
  },
};

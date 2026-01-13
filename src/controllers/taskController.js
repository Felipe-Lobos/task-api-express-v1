import { success } from "zod";
import TaskModel from "../models/taskModel.js";

export const taskController = {
  //obtener todas las tareas
  getAllTasks: (req, res, next) => {
    try {
      const tasks = TaskModel.getAll();

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
  getTaskById: (req, res, next) => {
    try {
      const { id } = req.params;
      const task = TaskModel.getById(id);

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
  createTask: (req, res, next) => {
    try {
      //los datos ya vienen validados por zod
      const taskData = req.validatedData;

      // Convertir boolean a integer para SQLite
      const taskToCreate = {
        ...taskData,
        completed: taskData.completed ? 1 : 0,
      };

      const newTask = TaskModel.create(taskToCreate);

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
  updateTask: (req, res, next) => {
    try {
      const { id } = req.params;
      const taskData = req.validatedData;

      // Verificar que la tarea existe
      const existingTask = TaskModel.getById(id);
      if (!existingTask) {
        res.status(404);
        throw new Error(`Tarea con ID ${id} no encontrada`);
      }

      // Convertir boolean a integer si existe
      const tasToUpdate = {
        ...existingTask,
        ...taskData,
        ...(taskData.completed !== undefined && {
          completed: taskData.completed ? 1 : 0,
        }),
      };
      // Desestructura primera la tarea existente, luego la sobre escribe
      // con la nueva tarea, y luego hace una destructuracion de
      // Si taskData.completed es distinto de undefined  entonces pasa el obj{}
      // como el {} solo tiene la propiedad completed, eso es lo unico que sobreescribe

      const result = TaskModel.update(id, tasToUpdate);

      if (result.changes === 0) {
        res.status(400);
        throw new Error("No se pudo actualizar la tarea");
      }

      // Obtener la tarea actualizada
      const updatedTask = TaskModel.getById(id);

      res.json({
        success: true,
        message: "Tarea actualziada exitosamente",
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  },

  // Eliminar tarea
  deleteTask: (req, res, next) => {
    try {
      const { id } = req.params;

      // Verificar que la tarea existe
      const existingTask = TaskModel.getById(id);
      if (!existingTask) {
        res.status(404);
        throw new Error(`Tarea con ID ${id} no encontrada`);
      }
      
      const result = TaskModel.delete(id)
      
      if(result === 0 ){
        res.status(400)
        throw new Error("No se pudo eliminar la tarea")
      }

      res.json({
        success: true,
        message: "Tarea eliminada exitosamente"
      })
    } catch (error) {
      next(error);
    }
  },
};

import prisma from "../config/prisma.js";

const TaskModel = {
  // Obtener todas las tareas
  getAll: async () => {
    return await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Obtener tareas por ID
  getById: async (id) => {
    return await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });
  },

  // Crear nueva tarea
  create: async (taskData) => {
    return await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description || null,
        completed: taskData.completed || false,
      },
    });
  },

  // Actualizar tarea
  update: async (id, taskData) => {
    return await prisma.task.update({
      where: { id: parseInt(id) },
      data: taskData,
    });
  },

  // Eliminar tarea
  delete: async (id) => {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    return { deleted: true };
  },
};

export default TaskModel;

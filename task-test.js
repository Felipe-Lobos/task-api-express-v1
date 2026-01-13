import 'dotenv/config';
import TaskModel from './src/models/taskModel.js';

try {
  // Crear tarea de prueba
  const newTask = TaskModel.create({
    title: 'Aprender Stack 2025',
    description: 'Express + better-sqlite3 + Zod'
  });
  console.log('✅ Tarea creada:', newTask);

  // Obtener todas las tareas
  const tasks = TaskModel.getAll();
  console.log('📋 Todas las tareas:', tasks);
  
} catch (error) {
  console.error('❌ Error:', error);
}
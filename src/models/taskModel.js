import db from '../config/database.js';

const TaskModel = {
  // Obtener todas las tareas
  getAll: () => {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    return db.prepare(sql).all();
  },

  // Obtener tarea por ID
  getById: (id) => {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    return db.prepare(sql).get(id);
  },

  // Crear nueva tarea
  create: (taskData) => {
    const { title, description, completed } = taskData;
    const sql = `
      INSERT INTO tasks (title, description, completed)
      VALUES (?, ?, ?)
    `;
    
    const info = db.prepare(sql).run(
      title, 
      description || null, 
      completed || 0
    );
    
    return { id: info.lastInsertRowid, ...taskData };
  },

  // Actualizar tarea
  update: (id, taskData) => {
    const { title, description, completed } = taskData;
    const sql = `
      UPDATE tasks 
      SET title = ?, 
          description = ?, 
          completed = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const info = db.prepare(sql).run(title, description, completed, id);
    return { changes: info.changes };
  },

  // Eliminar tarea
  delete: (id) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const info = db.prepare(sql).run(id);
    return { changes: info.changes };
  }
};

export default TaskModel;
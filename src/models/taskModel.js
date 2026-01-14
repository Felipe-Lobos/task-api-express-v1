import pool from "../config/database.js";

const TaskModel = {
  //obtener todas las tareas
  getAll: async () => {
    const sql = "SELECT * FROM tasks ORDER BY created_at DESC";
    const result = await pool.query(sql);
    return result.rows;
  },

  // Obtener tarea por ID
  getById: async (id) => {
    const sql = "SELECT * FROM tasks WHERE id = $1";
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  },

  // crear tarea nueva
  create: async (taskData) => {
    const { title, description, completed } = taskData;
    const sql = `
      INSERT INTO tasks (title, description, completed)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(sql, [
      title,
      description || null,
      completed || false,
    ]);

    return result.rows[0];
  },

  // Actualizar tarea
  update: async (id, taskData) => {
    const { title, description, completed } = taskData;
    const sql = `
      UPDATE tasks 
      SET title = $1, 
          description = $2, 
          completed = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(sql, [title, description, completed, id]);
    return result.rows[0];
  }, 
  
  // Eliminar tarea
  delete: async (id) => {
    const sql = "DELETE FROM tasks WHERE id = $1";
    const result = await pool.query(sql, [id]);
    return { deleted: result.rowCount > 0 };
  },
};

export default TaskModel;

const express = require('express');
const pool = require('../db');
const authenticateUser = require('../middleware/authMiddleware'); // Import middleware
const router = express.Router();

// ✅ Create a new task (Protected)
router.post('/tasks', authenticateUser, async (req, res) => {
    console.log("✅ Authenticated user from token:", req.user); // ✅ DEBUG LOG

    try {
        const { title, description, due_date, priority, category, tags } = req.body;
        const user_id = req.user.id; // Extract user ID from token

        const newTask = await pool.query(
            `INSERT INTO tasks (title, description, due_date, priority, category, tags, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, description, due_date, priority, category, tags, user_id]
        );

        res.json(newTask.rows[0]);
    } catch (err) {
        console.error("❌ Server error when inserting task:", err.message); // ✅ DEBUG LOG
        res.status(500).send('Server error');
    }
});


// ✅ Get all tasks for logged-in user (Protected)
router.get('/tasks', authenticateUser, async (req, res) => {
    try {
        const user_id = req.user.id;
        const allTasks = await pool.query(`SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`, [user_id]);
        res.json(allTasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ✅ Get a single task by ID (Protected)
router.get('/tasks/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const task = await pool.query(`SELECT * FROM tasks WHERE id = $1 AND user_id = $2`, [id, user_id]);

        if (task.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ✅ Update a task (Protected)
router.put('/tasks/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, due_date, priority, status, category, tags } = req.body;
        const user_id = req.user.id;

        const updateTask = await pool.query(
            `UPDATE tasks 
             SET title = $1, description = $2, due_date = $3, priority = $4, 
                 status = $5, category = $6, tags = $7, updated_at = CURRENT_TIMESTAMP
             WHERE id = $8 AND user_id = $9 RETURNING *`,
            [title, description, due_date, priority, status, category, tags, id, user_id]
        );

        if (updateTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        res.json(updateTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ✅ Delete a task (Protected)
router.delete('/tasks/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const deleteTask = await pool.query(`DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`, [id, user_id]);

        if (deleteTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

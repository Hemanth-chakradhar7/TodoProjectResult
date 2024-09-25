const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const authMiddleware = require('./middleware');

// User Signup
router.post('/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    db.run("INSERT INTO User (id, name, email, password) VALUES (?, ?, ?, ?)", [id, name, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: "Error creating user" });
        res.status(201).json({ message: "User created" });
    });
});

// User Login
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM User WHERE email = ?", [email], async (err, user) => {
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token });
    });
});

// CRUD Operations for Tasks
router.post('/tasks', authMiddleware, (req, res) => {
    const { title } = req.body;
    const id = uuidv4();
    const status = 'pending';
    db.run("INSERT INTO Task (id, userId, title, status) VALUES (?, ?, ?, ?)", [id, req.user.id, title, status], (err) => {
        if (err) return res.status(500).json({ message: "Error creating task" });
        res.status(201).json({ message: "Task created", id });
    });
});

router.get('/tasks', authMiddleware, (req, res) => {
    db.all("SELECT * FROM Task WHERE userId = ?", [req.user.id], (err, tasks) => {
        if (err) return res.status(500).json({ message: "Error retrieving tasks" });
        res.json(tasks);
    });
});

router.put('/tasks', authMiddleware, (req, res) => {
    const { id, title, status } = req.body;
    db.run("UPDATE Task SET title = ?, status = ? WHERE id = ? AND userId = ?", [title, status, id, req.user.id], function(err) {
        if (err || this.changes === 0) {
            return res.status(404).json({ message: "Task not found or error updating" });
        }
        res.json({ message: "Task updated" });
    });
});

router.delete('/tasks', authMiddleware, (req, res) => {
    const { id } = req.body;
    db.run("DELETE FROM Task WHERE id = ? AND userId = ?", [id, req.user.id], function(err) {
        if (err || this.changes === 0) {
            return res.status(404).json({ message: "Task not found or error deleting" });
        }
        res.json({ message: "Task deleted" });
    });
});

module.exports = router;

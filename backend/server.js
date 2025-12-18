const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Database
const db = new sqlite3.Database('./equipment.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// Create Table
db.run(`CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  lastCleaned TEXT
)`);

// API Endpoints
app.get('/api/equipment', (req, res) => {
    db.all("SELECT * FROM equipment", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/equipment', (req, res) => {
    const { name, type, status, lastCleaned } = req.body;
    const sql = `INSERT INTO equipment (name, type, status, lastCleaned) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, type, status, lastCleaned], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
});

app.put('/api/equipment/:id', (req, res) => {
    const { name, type, status, lastCleaned } = req.body;
    const sql = `UPDATE equipment SET name=?, type=?, status=?, lastCleaned=? WHERE id=?`;
    db.run(sql, [name, type, status, lastCleaned, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});

app.delete('/api/equipment/:id', (req, res) => {
    db.run(`DELETE FROM equipment WHERE id = ?`, req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
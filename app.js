const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// GET /tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// POST /tasks
app.post('/tasks', (req, res) => {
  const { name, description, dueDate, status, priority } = req.body;
  db.run(
    'INSERT INTO tasks (name, description, dueDate, status, priority) VALUES (?, ?, ?, ?, ?)',
    [name, description, dueDate, status || 'Pending', priority],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

// PATCH /tasks/:id
app.patch('/tasks/:id', (req, res) => {
  const { name, description, dueDate, status, priority } = req.body;
  db.run(
    'UPDATE tasks SET name = ?, description = ?, dueDate = ?, status = ?, priority = ? WHERE id = ?',
    [name, description, dueDate, status, priority, req.params.id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ updated: this.changes });
    }
  );
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', req.params.id, function (err) {
    if (err) return res.status(500).send(err.message);
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

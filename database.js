const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Initialize the tasks table
db.serialize(() => {
  db.run(`
    CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      dueDate TEXT,
      status TEXT CHECK(status IN ('Pending', 'In Progress', 'Completed')),
      priority TEXT CHECK(priority IN ('Low', 'Medium', 'High'))
    )
  `);
});

module.exports = db;

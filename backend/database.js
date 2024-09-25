const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE User (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT)");
    db.run("CREATE TABLE Task (id TEXT PRIMARY KEY, userId TEXT, title TEXT, status TEXT, FOREIGN KEY(userId) REFERENCES User(id))");
});

module.exports = db;

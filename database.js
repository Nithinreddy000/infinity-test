const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:'); // In-memory database for demonstration

db.serialize(() => {
    // Create users table
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            guid TEXT NOT NULL
        )
    `);

    // Insert a mock user
    const stmt = db.prepare(`INSERT INTO users (email, password, guid) VALUES (?, ?, ?)`);
    stmt.run('user@example.com', 'password123', 'mock-guid-123');
    stmt.finalize();

    // Create company users table
    db.run(`
        CREATE TABLE company_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id INTEGER NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    // Insert a mock company user
    const stmtCompanyUser = db.prepare(`INSERT INTO company_users (company_id, email, password) VALUES (?, ?, ?)`);
    stmtCompanyUser.run(1, 'companyuser@example.com', 'companypassword123');
    stmtCompanyUser.finalize();
});

module.exports = db;

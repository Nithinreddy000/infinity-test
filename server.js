const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const db = require('./database'); // Import the database

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// License Validation Endpoint
app.post('/api/license-validation', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            res.status(500).json({ message: 'Database error' });
        } else if (row) {
            req.session.guid = row.guid; // Store GUID in session
            res.json({ guid: row.guid });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

// Mock companies data
const companies = [
    { id: '1', name: 'Google' },
    { id: '2', name: 'Microsoft' },
    { id: '3', name: 'Tesla' }
];

// Companies Endpoint
app.get('/api/companies', (req, res) => {
    const guid = req.get('Authorization').split(' ')[1];

    if (guid === 'mock-guid-123') {
        res.json(companies);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});
// Company Login Endpoint
app.post('/api/company-login', (req, res) => {
    const { email, password, companyId } = req.body;
    db.get('SELECT * FROM company_users WHERE email = ? AND password = ? AND company_id = ?', [email, password, companyId], (err, row) => {
        if (err) {
            res.status(500).json({ message: 'Database error' });
        } else if (row) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid email or password for the selected company' });
        }
    });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

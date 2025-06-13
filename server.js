const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// User database (in-memory for demonstration)
let users = [];
let services = [];
let intervalMinutes = 5;
let pingInterval;

// Middleware for authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });

    jwt.verify(token, 'your-jwt-secret', (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Ping all services
function pingAllServices() {
    services.forEach(service => {
        fetch(service.url)
            .then(res => {
                service.status = res.ok ? "active" : "inactive";
                service.lastPing = new Date().toISOString();
            })
            .catch(() => {
                service.status = "inactive";
                service.lastPing = new Date().toISOString();
            });
    });
}

// Start ping loop
function startPingLoop() {
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(pingAllServices, intervalMinutes * 60000);
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Auth routes
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing email or password' });

    if (users.some(user => user.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    users.push({ email, password });
    res.json({ success: true, message: 'User registered successfully' });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing email or password' });

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ email: user.email }, 'your-jwt-secret', { expiresIn: '1h' });
    res.json({ success: true, token });
});

app.post('/api/logout', authenticateToken, (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});

// Service routes
app.post('/api/services', authenticateToken, (req, res) => {
    const { name, url } = req.body;
    if (!name || !url) return res.status(400).json({ success: false, message: 'Missing name or URL' });

    if (services.some(service => service.url === url)) {
        return res.status(400).json({ success: false, message: 'Service already exists' });
    }

    services.push({ name, url, status: 'unknown', lastPing: null });
    res.json({ success: true, message: 'Service added successfully', services });
});

app.delete('/api/services', authenticateToken, (req, res) => {
    const { url } = req.body;
    const index = services.findIndex(service => service.url === url);
    if (index === -1) return res.status(404).json({ success: false, message: 'Service not found' });

    services.splice(index, 1);
    res.json({ success: true, message: 'Service deleted successfully', services });
});

app.get('/api/services', authenticateToken, (req, res) => {
    res.json({ success: true, services });
});

app.post('/api/interval', authenticateToken, (req, res) => {
    const { minutes } = req.body;
    if (!minutes || minutes < 1) return res.status(400).json({ success: false, message: 'Invalid interval' });

    intervalMinutes = minutes;
    startPingLoop();
    res.json({ success: true, message: 'Interval updated successfully' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startPingLoop();
});

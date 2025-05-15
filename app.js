// app.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const setupSocket = require('./socket');
const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

// base de données
connectDB();
app.use(express.static(path.join(__dirname, 'public')));

// attacher io à chaque requête
app.use((req, res, next) => { req.io = io; next(); });

// middlewares
app.use(express.json());
// routes
app.use('/api/status', require('./routes/status'));
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// socket.io
setupSocket(io);

// **On n’appelle PLUS server.listen ici**

module.exports = { app, server };

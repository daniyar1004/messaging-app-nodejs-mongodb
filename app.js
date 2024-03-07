const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const socketIO = require('socket.io');
const http = require('http');
const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/channelRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/messaging-app';
const SESSION_SECRET = 'f8ed588b94342c8f7ac7562bd0ae0fb30b64882fd615a81594ef2a42c6266aee';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use('/api', userRoutes);
app.use('/api', channelRoutes);
app.use('/api', messageRoutes);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

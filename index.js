const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer(app);

const io = socketIO(server);


io.on('connection', (socket) => {
    console.log("User Connected!");
})

server.listen(port, () => {
    console.log(`Website is on port ${port}`);
});
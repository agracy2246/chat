const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

io.on('connect', (socket) => {
   console.log('Client has connected..');

   socket.broadcast.emit('connect-message');
    
    // For each individual client, this events are managed
    socket.on('disconnect', () => {
        console.log('Client has disconnected..');
        socket.broadcast.emit('disconnect-message', socket.userName);
    });
    socket.on('chat message', (msg) => {
        socket.userName = msg['user'];
        socket.broadcast.emit('chat message', msg);
    });
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/redirect.html');
});

app.get('/chat', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080, () => {
    console.log('listening port 8080');
});
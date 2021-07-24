const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

io.on('connect', (socket) => {
    console.log('Client has connected..');

    socket.on('disconnect', () => {
        console.log('Client has disconnected..');
    });
    
    io.emit('connect-message');
    
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
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
// Start Project:
// Run two commands in different terminal windows:
// In project directory:
// npm run start
// In directory with ngrok executable:
// ./ngrok http 3000 -> Opens connection with localhost:3000

var express = require('express')
var app = express();
var server = app.listen(process.env.PORT || 3000);

// tell the app to use the public folder files
app.use(express.static('public'));
var socket = require('socket.io');
var io = socket(server); // tell socket to connect to the server we created
io.sockets.on('connection', newConnection); // catch a connection, and call newConneciton

var cs = [];
var usersOnline = 0;

function newConnection(socket) {
    usersOnline++;

    io.emit('usersOnline', usersOnline);
    io.emit('currentState', cs);

    socket.on('clear canvas', function() {
        cs = [];
        // clear the canvas for rest of users
        socket.broadcast.emit('clear canvas');
    })
    socket.on('mouseEvent', function(data){
        cs.push(data);
        socket.broadcast.emit('syncDrawing', data);
    });
    socket.on('disconnect', function() { 
        usersOnline--;
        console.log(usersOnline)
        io.emit('usersOnline', usersOnline);
    })    
}

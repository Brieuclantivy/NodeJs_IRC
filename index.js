var app = require('express')();
var express = require("express");

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
        socket.on('nouveau_client', function(pseudo) {
                socket.broadcast.emit('nouveau_client', pseudo + " has enter in the chat !");
        });
        
        socket.on('chat message', function(pseudo, msg){
                console.log("MSG PSEUDO : " + pseudo);
                io.emit('chat message', pseudo + " : " + msg);
        });
});

/**
 * // join to subscribe the socket to a given channel (server-side):
socket.join('some room');

// then simply use to or in (they are the same) when broadcasting or emitting (server-side)
io.to('some room').emit('some event'):

// leave to unsubscribe the socket to a given channel (server-side)
socket.leave('some room');

 */

http.listen(3000, function(){
  console.log('listening on *:3000');
});

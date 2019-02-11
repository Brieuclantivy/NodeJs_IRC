var app = require('express')();
var express = require("express");

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static('public'));

var rooms = ['room1','room2','room3'];


io.sockets.on('connection', function(socket){

  socket.on('nouveau_client', function(pseudo) {
    socket.username = pseudo;
    // store the room name in the socket session for this client
    socket.room = 'room1';
    //socket.broadcast.emit('nouveau_client', pseudo + " has enter in the chat !");
    socket.join('room1');
    console.log("ROOM : " + socket.room);
		// echo to client they've connected
		socket.emit('nouveau_client', 'Chat', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to('room1').emit('nouveau_client', 'Chat', pseudo + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');

  });
        
  socket.on('chat message', function(pseudo, msg){
    console.log("MSG PSEUDO : " + pseudo + " Chat Room : " + socket.room);
    io.sockets.in(socket.room).emit('chat message', pseudo + " : " + msg);
  });


  socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('chat message', 'Chat', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('chat message', 'Chat', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('chat message', 'Chat', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
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


/*

Bonus /all ?
This makes it easy to broadcast messages to other sockets:
io.on('connection', function(socket){
  socket.on('say to someone', function(id, msg){
    socket.broadcast.to(id).emit('my message', msg);
  });
});



*/
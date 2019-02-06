var app = require('express')();
var express = require("express");

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
        socket.on('chat message', function(pseudo, msg){
                console.log("MSG PSEUDO : " + pseudo);
                io.emit('chat message', pseudo + " : " + msg);
        });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

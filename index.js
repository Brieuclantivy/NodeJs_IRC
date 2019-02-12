var app = require('express')();
var express = require("express");

var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static('public'));

var rooms = ['room1','room2','room3'];
var usernames = {};
/*var db = "irc";

var url = "mongodb://localhost:27017/irc";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("irc");
	var myquery = { msg: /^b/ };
  dbo.collection("msg").deleteMany(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
    db.close();
  });
});*/

/* DELETE
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("irc");
	var myquery = { msg: /^b/ };
  dbo.collection("msg").deleteMany(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
    db.close();
  });
});
*/

/* INSERT
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("irc");
  var myobj = { pseudo: "brieuc", msg: "bonjour, c'est un test", room: "room1" };
  dbo.collection("msg").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
	});
});

*/


/** FIND
 MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("irc");
  dbo.collection("msg").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.msg);
    db.close();
  });});
 */


io.sockets.on('connection', function (socket) {
	
	socket.on('newUser', function(username){
		socket.username = username;
		socket.room = 'room1';
		usernames[username] = username;
		socket.join('room1');
		socket.emit('msgToChat', 'SERVER', 'you have connected to room1');
		socket.broadcast.to('room1').emit('msgToChat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
	});
	
	socket.on('sendchat', function (data) {
    if (data.includes('/all ')) {
      rooms.forEach(function(room){
        io.sockets.in(room).emit('msgToChat', socket.username, data.substr(5));
      });
    }
    else
      io.sockets.in(socket.room).emit('msgToChat', socket.username, data);
  });
  
  socket.on('addRoom', function (data) {
    rooms.push(data);
    socket.emit('updaterooms', rooms, socket.room);
  });
  
  socket.on('supprRoom', function (data) {
    rooms.pop(data);
    socket.emit('updaterooms', rooms, socket.room);
  });

	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('msgToChat', 'SERVER', 'you have connected to '+ newroom);
		socket.broadcast.to(socket.room).emit('msgToChat', 'SERVER', socket.username+' has left this room');
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('msgToChat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});
	

	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('msgToChat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});

/**

https://socket.io/docs/emit-cheatsheet/

/color
/mp pseudo msg
/all
/gras
/italique
time out si spam
l'heure 
/clear pour clear le chat visuel
/clearall pour delete la bdd
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

/*

io.sockets.on('connection', function(socket){

  socket.on('nouveau_client', function(pseudo) {
    console.log("nouveau_client ");
    socket.username = pseudo;
    // store the room name in the socket session for this client
    socket.room = 'room1';
    //usernames[username] = username;
    //socket.broadcast.emit('nouveau_client', pseudo + " has enter in the chat !");
    socket.join('room1');
    console.log("ROOM : " + socket.room);
    name = pseudo;
		// echo to client they've connected
		socket.emit('nouveau_client', pseudo + ' you have connected to room1');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to('room1').emit('nouveau_client', pseudo + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');

  });
        
  socket.on('chat message', function(pseudo, msg){
    console.log("MSG PSEUDO : " + pseudo + " Chat Room : " + socket.id);
    io.sockets.in(socket.room).emit('chat message', pseudo + " : " + msg);
  });


  socket.on('switchRoom', function(newroom){
    console.log("SWITCH ROOM");
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('chat message', socket.username +  ' you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('chat message', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('chat message', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

});


*/


/*

<!doctype html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
  </head>
  <script src="/socket.io/socket.io.js"></script>
<script>
        var socket = io();
</script>
<script src="/socket.io/socket.io.js"></script>
<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
	<script>
		var pseudo = prompt('Quel est votre pseudo ?');//NE MARCHE PAS SUR MOBILE
		socket.emit('nouveau_client', pseudo);

		socket.on('nouveau_client', function(message) {
			$('#messages').append($('<li>').text(message));
		})
		$(function () {
			var socket = io();
			$('form').submit(function(e){
				e.preventDefault(); // prevents page reloading
				socket.emit('chat message', pseudo, $('#m').val());
				$('#m').val('');
				return false;
			});
			socket.on('chat message', function(msg){
				console.log("JE SUIS LA")
				$('#messages').append($('<li>').text(msg));
			});
		});

		socket.on('chat message', function(msg){
			console.log("JE SUIS LA")
			$('#messages').append($('<li>').text(msg));
		});

		socket.on('updaterooms', function(rooms, current_room) {
			$('#rooms').empty();
			$.each(rooms, function(key, value) {
				if(value == current_room){
					$('#rooms').append('<div>' + value + '</div>');
				}
				else {
					$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
				}
			});
		});
		function switchRoom(room){
			socket.emit('switchRoom', room);
		}
	</script>
	<body>
		<div style="float:left;width:100px;border-right:1px solid black;height:300px;padding:10px;overflow:scroll-y;">
			<b>ROOMS</b>
			<div id="rooms"></div>
		</div>
		<ul id="messages"></ul>
		<form action="">
			<input id="m" autocomplete="off" /><button>Send</button>
		</form>
	</body>
</html>



*/
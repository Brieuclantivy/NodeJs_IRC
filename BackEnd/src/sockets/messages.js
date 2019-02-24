function clearMessages(room, IrcModel) {
  console.log("CLEAEEEEEER");
  IrcModel.deleteMany({
    room: room
  })
    .then(response => {
      console.log("CLEAEEEEEER : " + response);
    })
    .catch(err => {
      console.error(err);
    });
}

function sendToRoom(message, socket, rms, io) {
  var res = message.split(" ");

  var roomName = res[0].substring(1, res[0].length);
  for (i = 0; rms[i]; i++) {
    if (roomName == rms[i]) {
      var send = message.substr(rms[0].length);
      io.sockets
      .in(roomName)
      .emit("sendMessage", socket.username, send);
      return;
    }
  }
}

module.exports.sendMessage = function(socket, io, IrcModel, rms) {
  /**
   * Wait for a new message
   * save the message
   * send a message with the user + msg to the front
   */
  socket.on("sendMessage", message => {
    console.log("New message : " + message);
    var d = new Date();
    var t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var test = t.toString();
    let msg = new IrcModel({
      msg: message,
      nickname: socket.username,
      room: socket.room,
      sendDate: d
    });

    msg
      .save()
      .then(doc => {})
      .catch(err => {
        socket.broadcast.emit("throwError", err);
        console.error(err);
      });
    if (message.includes("/all ")) {
      rms.forEach(function(room) {
        io.sockets
          .in(room)
          .emit("sendMessage", socket.username, message.substr(5));
      });
    } else if (message.includes("/clear")) {
      clearMessages(socket.room, IrcModel);
    } else if (message.includes("/")) {
      sendToRoom(message, socket, rms, io);
    } else
      io.sockets.in(socket.room).emit("sendMessage", socket.username, message);
  });
};

module.exports.getHistory = function(socket, io, IrcModel) {
  socket.on("getHistory", function(room) {
    console.log("GETHISTORY");
    IrcModel.find({
      room: room
    })
      .then(msglist => {
        console.log("GETHISTORY : " + msglist);
        io.sockets.in(socket.room).emit("getHistory", msglist);
      })
      .catch(err => {
        socket.broadcast.emit("throwError", err);
        console.error(err);
      });
  });
};

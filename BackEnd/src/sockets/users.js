module.exports.disconnect = function(socket, UsersModel, io, usernames) {
  /**
   * DISCONNECT
   */
  socket.on("disconnect", function() {
    console.log("Disconnect : ");
    io.sockets.emit("updateusers", usernames);
    socket.broadcast.emit("sendMessage", socket.username, " has disconnected");
    socket.leave(socket.room);
    delete usernames[socket.username];

    /*Find the users, then remove him from the user list */
    UsersModel.findOneAndRemove({
      username: socket.username
    })
      .then(response => {
        //console.log(response)
      })
      .catch(err => {
        socket.broadcast.emit("throwError", err);
        console.error(err);
      });
  });
};

module.exports.newUser = function(
  socket,
  UsersModel,
  rms,
  IrcModel,
  RoomsModel,
  io,
  usernames
) {
  /**Wait for a newUserConnected call
   * find all message from room1
   * Find all users from room1
   * set socket.username + socket.room
   * Save the user with his room
   * send a message to the front
   */
  socket.on("newUserConnected", function(username) {
    console.log("New User : " + username);

    /*Set a room to rms */
    RoomsModel.find({})
      .then(roomslist => {
        for (var i = 0; roomslist[i]; i++) {
          rms[i] = roomslist[i].room;
        }
      })
      .catch(err => {
        socket.broadcast.emit("throwError", err);
        console.error(err);
      });

    /*List all messages from room1 */
    IrcModel.find({
      room: "general"
    })
      .then(msglist => {
        //console.log("Messages list : " + msglist)
      })
      .catch(err => {
        socket.broadcast.emit("throwError", err);
        console.error(err);
      });

    socket.username = username;
    //		socket.room = rms[0];
    socket.room = "general";
    usernames[username] = username;

    /*Save the user with his room */
    let user = new UsersModel({
      username: socket.username,
      room: socket.room
    });
    user
      .save()
      .then(doc => {
        /*Find all users from room1 */
        UsersModel.find({
          room: "general"
        })
          .then(list => {
            var tab = [];
            for (var i = 0; list[i]; i++) {
              tab[i] = list[i].username;
            }
            io.in("general").emit("updateRoomList", rms, "general", tab);
          })
          .catch(err => {
            socket.broadcast.emit("throwError", err);
            console.error(err);
          });
      })
      .catch(err => {
        socket.broadcast.emit("throwError", err);
        console.error(err);
      });

    socket.join("general");
    socket.emit("sendMessage", username, "you have connected to " + "general");
    socket.broadcast
      .to("general")
      .emit("sendMessage", username, " has connected to this room");
  });
};

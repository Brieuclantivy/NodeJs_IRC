module.exports.addRoom = function(socket, RoomsModel, rms) {
  /*Save the room */
  socket.on("addRoom", function(data) {
    /*Save the room */
    let roomSave = new RoomsModel({
      room: data
    });
    roomSave
      .save()
      .then(doc => {})
      .catch(err => {
        socket.broadcast.emit("throwError", err);
        console.error(err);
      });

    console.log("Add room : " + data);
    rms.push(data);
    socket.emit("updateRoomList", rms, data, null);
  });
};

module.exports.deleteRoom = function(socket, RoomsModel, rms, UsersModel) {
  socket.on("deleteRoom", function(data) {
    var clientObjects = socket.room.connected;

    //Object.keys(clientObjects).forEach(function (id) {
    //console.log("JI SUIS LA )================== " + id);
    //});

    if (data != "general") {
      /*Find all user from newroom */
      UsersModel.find({
        room: data
      })
        .then(list => {
          if (list[0] == undefined) {
            RoomsModel.findOneAndRemove({
              room: data
            })
              .then(response => {})
              .catch(err => {
                console.error(err);
              });
            console.log("Suppr room : " + data);
            rms.pop(data);
            socket.emit("updateRoomList", rms, data, null);
          }
        })
        .catch(err => {
          socket.broadcast.emit("throwError", err);
          console.error(err);
        });

      /* RoomsModel.findOneAndRemove({
        room: data
      })
        .then(response => {})
        .catch(err => {
          console.error(err);
        });
      console.log("Suppr room : " + data);
      rms.pop(data);
      socket.emit("updateRoomList", rms, socket.room);*/
    }
  });
};

module.exports.getListRoom = function(socket, rms, io) {
  /**
   * Send room list
   */
  socket.on("getListRoom", function() {
    console.log("GETROOM");
    io.sockets.emit("getListRoom", rms);
  });
};

module.exports.switchRoom = function(socket, rms, io, UsersModel) {
  /**
   * SWITCH ROOM
   */
  socket.on("switchRoom", function(newroom) {
    console.log("switch room : " + newroom);

    if (newroom != socket.room) {
      /*Update user list when an user change his room */
      UsersModel.findOneAndUpdate(
        { username: socket.username },
        { room: newroom },
        {
          new: true,
          runValidators: true
        }
      )
        .then(doc => {
          UsersModel.find({
            room: socket.room
          })
            .then(list => {
              var tab = [];
              for (var i = 0; list[i]; i++) {
                tab[i] = list[i].username;
              }
              socket.broadcast
                .to(socket.room)
                .emit("updateRoomList", rms, socket.room, tab);
              socket.leave(socket.room);
              socket.join(newroom);
              socket.broadcast
                .to(socket.room)
                .emit("sendMessage", socket.username, " has left this room");
              socket.room = newroom;
              socket.broadcast
                .to(newroom)
                .emit("sendMessage", socket.username, " has joined this room");

              /*Find all user from newroom */
              UsersModel.find({
                room: newroom
              })
                .then(list => {
                  var tab = [];
                  for (var i = 0; list[i]; i++) {
                    tab[i] = list[i].username;
                  }
                  io.sockets
                    .in(socket.room)
                    .emit("updateRoomList", rms, newroom, tab);
                  //console.log(tab)
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
        })
        .catch(err => {
          socket.broadcast.emit("throwError", err);
          console.error(err);
        });
    }
  });
};

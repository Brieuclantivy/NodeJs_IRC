let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/irc", function(err, res) {
  if (err) {
    console.log("ERROR connecting to : Rooms " + err);
    process.exit(84);
  } else {
    console.log("Succeeded connected to: Rooms");
  }
});

/*INIT rooms database */
let RoomsSchema = new mongoose.Schema({
  room: String
});

let room = new mongoose.model("rooms", RoomsSchema)({
  room: "general"
});
room
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.error(err);
    process.exit(84);
  });

room = new mongoose.model("rooms", RoomsSchema)({
  room: "divers"
});
room
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.error(err);
    process.exit(84);
  });

room = new mongoose.model("rooms", RoomsSchema)({
  room: "game"
});
room
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.error(err);
    process.exit(84);
  });
module.exports = mongoose.model("rooms", RoomsSchema);

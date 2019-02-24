let mongoose = require('mongoose')


mongoose.connect("mongodb://localhost/irc", function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to : Users ' + err);
    process.exit(84);
  } else {
    console.log ('Succeeded connected to: Users');
  }
});

let UsersSchema = new mongoose.Schema({
  username: String,
  password: String,
  room: String
})

module.exports = mongoose.model('users', UsersSchema)
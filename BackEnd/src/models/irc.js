let mongoose = require('mongoose')


mongoose.connect("mongodb://localhost/irc", function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: msgs ' + err);
    process.exit(84);
  } else {
    console.log ('Succeeded connected to: msgs');
  }
});

let IrcSchema = new mongoose.Schema({
  msg: String,
  nickname: String,
  room: String,
  sendDate: Date,
})

module.exports = mongoose.model('msg', IrcSchema)
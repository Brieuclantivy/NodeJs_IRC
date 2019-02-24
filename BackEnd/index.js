let express = require("express");
let app = express();

let http = require("http");
let server = http.Server(app);

let socketIO = require("socket.io");
let io = socketIO(server);
let user = require("./src/routes/user");
const port = process.env.PORT || 10001;
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secretIrcKey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 } //60000
  })
);
app.use(cookieParser());

/*routes for sockets */
var functionRooms = require("./src/sockets/rooms");
var functionUsers = require("./src/sockets/users");
var functionMsgs = require("./src/sockets/messages");

/*List of rooms */
var rms = [];

/*array of usernames */
var usernames = {};

/*use config to connect to the mongo database */
let IrcModel = require("./src/models/irc");
let UsersModel = require("./src/models/users");
let RoomsModel = require("./src/models/rooms");

/*user socket io */
io.on("connection", socket => {
  functionRooms.addRoom(socket, RoomsModel, rms);
  functionRooms.deleteRoom(socket, RoomsModel, rms, UsersModel);
  functionRooms.getListRoom(socket, rms, io);
  functionRooms.switchRoom(socket, rms, io, UsersModel);

  //USERS
  functionUsers.disconnect(socket, UsersModel, io, usernames);
  functionUsers.newUser(
    socket,
    UsersModel,
    rms,
    IrcModel,
    RoomsModel,
    io,
    usernames
  );

  //messages
  functionMsgs.sendMessage(socket, io, IrcModel, rms);
  functionMsgs.getHistory(socket, io, IrcModel);
});

app.post("/api/register", user.register);
app.post("/api/login", user.login);

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});

/**

https://socket.io/docs/emit-cheatsheet/

/color
/mp pseudo msg
/all
/gras
/italique
time out si spam
/clear pour clear le chat visuel
/help
faire un switchroom quand on passe de edit to room

 */

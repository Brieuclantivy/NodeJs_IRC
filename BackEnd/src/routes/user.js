var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var config = require("../../config"); // get config file

exports.register = function(req, res) {
  message = "";
  let UsersModel = require("./../models/users");
  if (req.method == "POST") {
    var post = req.body;
    var name = post.username;

    UsersModel.find({
      username: name
    })
      .then(loginUser => {
        if (loginUser[0] == undefined) {
          var hashedPassword = bcrypt.hashSync(post.password, 8);

          let user = new UsersModel({
            username: name,
            password: hashedPassword,
            room: "general"
          });
          user
            .save()
            .then(doc => {
              message = "Succesfully! Your account has been created.";
              res.status(200).send(message);
            })
            .catch(err => {
              var message = "Cannot save users";
              res.status(404).send(message);
            });
        } else {
          var message = "User allready exist";
          res.status(404).send(message);
        }
      })
      .catch(err => {
        message = "User does not exist";
        res.status(404);
      });
  }
};

exports.login = function(req, res) {
  var message = "";

  let UsersModel = require("./../models/users");
  if (req.method == "POST") {
    var post = req.body;
    var name = post.username;
    var pass = post.password;

    UsersModel.find({
      username: name
    })
      .then(loginUser => {
        var passwordIsValid = bcrypt.compareSync(pass, loginUser[0].password);
        if (!passwordIsValid) {
          message = "Wrong Credentials.";
          res.status(404).send(message);
        }
        req.session.userId = loginUser[0]._id;
        req.session.user = loginUser[0].username;
        message = "You are connected !";
        res.status(200).send(message);
      })
      .catch(err => {
        message = "User does not exist";
        res.status(404).send(message);
      });
  }
};

var MongoClient = require('mongodb');

var db_export;

var url = "mongodb://localhost:27017/irc";
connect = function(mode, done) {
    if (db_export) return done()
  
    MongoClient.connect(url, function(err, db) {
      if (err) return done(err)
      db_export = db
      done()
    })
  }
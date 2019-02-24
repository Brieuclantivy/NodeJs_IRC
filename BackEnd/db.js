let mongoose = require('mongoose');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'irc';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect()
  }

_connect() {
     mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}

module.exports = new Database()


/*var MongoClient = require('mongodb');

var db_export;

var url = "mongodb://localhost:27017/irc";
connect = function(mode, done) {
  if (db_export) return done()
  
  MongoClient.connect(url, function(err, db) {
    if (err) return done(err)
    db_export = db
    done()
  })
}*/
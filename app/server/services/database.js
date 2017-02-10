const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const dbConfig = require('./config/' + process.env.NODE_ENV).db;
const dbUri = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;

var _dbInstance;

module.exports = {

  getDb: function() {

    return new Promise((resolve, reject) => {
      if (_dbInstance) {
        resolve(_dbInstance);
      }

      MongoClient.connect(dbUri, (err, db) => {
        if (err) {
          reject(err);
        }
        _dbInstance = db;
        resolve(db);
      });
    });
  }

};

/**
 * @module server/services/db/mongo
 * @requires module:mongodb
 */

const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;

/**
 * Interface with the mongodb native client
 * @class
 * @memberof server/services/db
 */
class MongoDb {

  /**
   * @param {Object} options - Database options
   */
  constructor (options) {
    this.collectionName = options.collectionName;
    this.url = `mongodb://${options.host}:${options.port}/${options.dbName}`;
  }

  /**
   * Initalize a database connection and get the db instance
   * @returns {Promise} Success or failure
   */
  connect () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.url, (err, db) => {
        if (err) return reject(err);
        resolve(db);
      });
    });
  }

  /**
   * Retreive a document with filter
   * @param {Object} filter - Query to filter the documents
   * @returns {Promise} Success or failure
   */
  findOne (filter) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {

        if (filter._id) {
          filter._id = new Mongo.ObjectID(filter._id)
        }

        db.collection(this.collectionName).findOne(filter, (err, result) => {
          db.close();
          if (err) return reject(err);
          resolve(result);
        });
      }).catch(reject);
    });
  }

  findAll (filter) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {

        if (filter._id) {
          filter._id = new Mongo.ObjectID(filter._id)
        }

        db.collection(this.collectionName).find(filter).toArray((err, result) => {
          db.close();
          if (err) return reject(err);
          resolve(result);
        });
      }).catch(reject);
    });
  }

  /**
   * Create a new document
   * @param {Object} data - Data to insert into the document
   * @returns {Promise} Success or failure
   */
  insert (data) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {

        if (data._id) {
          data._id = new Mongo.ObjectID(data._id)
        }

        db.collection(this.collectionName).insertOne(data, (err, result) => {
          db.close();
          if (err) return reject(err);
          resolve(result);
        });
      }).catch(reject);
    });
  }

  /**
   * Update a document
   * @param {Object} filter - Query to identify which document must be updated
   * @param {Object} data - Data to updated
   * @returns {Promise} Success or failure
   */
  update (filter, data) {

    return new Promise((resolve, reject) => {
      this.connect().then(db => {

        if (filter._id) {
          filter._id = new Mongo.ObjectID(filter._id)
        }

        db.collection(this.collectionName).updateOne(filter, { $set: data }, (err, result) => {
          db.close();
          if (err) return reject(err);
          resolve(result);
        });
      }).catch(reject);
    });
  }

  /**
   * Remove a document
   * @param {Ofilter - Query to identify which document must be deleted
   * @returns {Promise}
   */
  remove (filter) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {

        if (filter._id) {
          filter._id = new Mongo.ObjectID(filter._id)
        }

        db.collection(this.collectionName).remove(filter, (err, result) => {
          db.close();
          if (err) return reject(err);
          resolve(result);
        });
      }).catch(reject);
    });
  }

}

module.exports = MongoDb;
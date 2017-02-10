/**
 * @module server/services/db
 * @namespace server/services/db
 */

const config = require(`../config/${process.env.NODE_ENV}`).db;

/**
 * Database factory
 * @class
 * @memberof server/services
 */
class Database {

    /**
     * Build a database context
     * @param {string} collectionName - Collection or table name
     * @returns {*} Instance of database context
     */
    constructor(collectionName) {
        let options = { host: config.host, port: config.port, dbName: config.dbName, collectionName: collectionName };
        let dbProvider = require('./provider/' + config.name);
        return new dbProvider(options);
    }

}

module.exports = Database;

/**
 * @module server/router
 * @requires module:socket.io-client
 */

const io = require('socket.io-client');

const userApi = require('./api/user');
const watchApi = require('./api/watch');
const balanceApi = require('./api/balance');


/**
 * Initiliaze the router
 * @param {Object} app - Express application
 * @param {integer} port - Port of the application
 */
module.exports = (app, port) => {

  userApi(app);
  balanceApi(app);

  let ioClient = io.connect(`http://localhost:${port}`, { query: "auth=backend_9zU5d@M78k4hJ" });
  ioClient.on('connect', () => {
    watchApi(app, ioClient);
  });

};

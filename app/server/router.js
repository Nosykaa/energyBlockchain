/**
 * @module server/router
 * @requires module:socket.io-client
 */

const io = require('socket.io-client');

const i18nAPi = require('./api/i18n');
const authApi = require('./api/auth');
const userApi = require('./api/user');
const subscriptionApi = require('./api/subscription');
const validatorApi = require('./api/validator');
const notificationApi = require('./api/notification');
const digitalidApi = require('./api/digitalid');
const watchApi = require('./api/watch');
const balanceApi = require('./api/balance');


/**
 * Initiliaze the router
 * @param {Object} app - Express application
 * @param {integer} port - Port of the application
 */
module.exports = (app, port) => {

  i18nAPi(app);
  userApi(app);
  validatorApi(app);
  balanceApi(app);

  let ioClient = io.connect(`http://localhost:${port}`, { query: "auth=backend_9zU5d@M78k4hJ" });
  ioClient.on('connect', () => {
    authApi(app, ioClient);
    notificationApi(app, ioClient);
    digitalidApi(app, ioClient);
    watchApi(app, ioClient);
    subscriptionApi(app, ioClient);
  });

};

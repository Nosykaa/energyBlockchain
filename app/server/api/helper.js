/**
 * @module server/api/helper
 * @requires module:server/services/user
 * @requires module:util
 */

const userService = require('../services/user');
const util = require('util');

/**
 * Defines helper class for api
 * @class
 * @memberof server/api
 */
class ApiHelper {

    formatError (res, err) {
      if (err.code && Number.isInteger(err.code) && err.message) {
        res.status(err.code).send({ message: util.format(err.message) }).end();
      }
      else {
        res.status(500).send({ message: util.format(err) }).end();
      }
    }
}

module.exports = new ApiHelper();

const util = require('util');

class ErrorHelper {

  display (res, err) {
    if (err.code && Number.isInteger(err.code) && err.message) {
      res.status(err.code).send({ message: err.message }).end();
    }
    else {
      res.status(500).send({ message: util.format(err) }).end();
    }
  }

}

module.exports = new ErrorHelper();

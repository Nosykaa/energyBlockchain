/**
 * @module server/api/subscription
 * @requires module:server/services/blockchain/subscription
 * @requires module:server/api/helper
 */

const userService = require('../services/user');
const apiHelper = require('./helper');

module.exports = (app) => {

  app.post('/user/:login/charging', (req, res) => {
      
    if (!req.body.user)
      return apiHelper.formatError(res, {code: 403, message:'User object is required'});
    userService.save(req.params.login, req.body.user)
      .then(() => res.status(200).end())
      .catch(err =>  apiHelper.formatError(res, err));
  });

  app.get('/user/:login', (req, res) => {
      userService.findByLogin(req.params.login)
      .then(user => res.status(200).json(user))
      .catch(err =>  apiHelper.formatError(res, err));
  });

  app.get('/user/:login/chargingHistory', (req, res) => {
      userService.findByLogin(req.params.login)
      .then(user => res.status(200).json(user.chargingHistory))
      .catch(err =>  apiHelper.formatError(res, err));
  });

  app.get('/app/toto', (req, res) => {
      userService.findHomeGridAddress()
      .then(address => {
          console.log(address);
          res.status(200).json(address)})
      .catch(err =>  apiHelper.formatError(res, err));
  });

};
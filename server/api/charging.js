/**
 * @module server/api/subscription
 * @requires module:server/services/blockchain/subscription
 * @requires module:server/api/helper
 */

const blockchainService = require('../services/blockchain/charging');
const apiHelper = require('./helper');

module.exports = (app) => {


  app.post('/charging/deploy', (req, res) => {
    console.log("Request is received");
    console.log("Request body is: " + req.body.userAddress);
    console.log(JSON.stringify(req.body));
    if (!req.body.userAddress)
      return apiHelper.formatError(res, {code: 403, message:'UserAddress is required'});
    if (!req.body.homeAddress)
      return apiHelper.formatError(res, {code: 403, message:'HomeAddress is required'});
    if (!req.body.carAddress)
      return apiHelper.formatError(res, {code: 403, message:'CarAddress is required'} );
    if (!req.body.sellPrice)
      return apiHelper.formatError(res, {code: 403, message:'SellPrice is required'} );
    blockchainService.deployContract(req.body.userAddress, req.body.homeAddress, req.body.carAddress, req.body.sellPrice, req.body.startingPointenergy)
      .then(contractAddress => res.status(200).send(contractAddress))
      .catch(err => apiHelper.formatError(res, err));
  });

  app.post('/charging/:contractAddress/chargeStarted', (req, res) => {
    if (!req.body.userAddress)
      return apiHelper.formatError(res, {code: 403, message:'UserAddress is required'});
    if (!req.body.amountToKeep)
      return apiHelper.formatError(res, {code: 403, message:'AmountToKeep is required'});

    blockchainService.chargeStarted(req.body.userAddress, req.params.contractAddress, req.body.amountToKeep)
      .then(contractAddress => res.status(200).send(contractAddress))
      .catch(err => apiHelper.formatError(res, err));
  });

  app.post('/charging/:contractAddress/chargeCompleted', (req, res) => {
    if (!req.body.userAddress)
      return apiHelper.formatError(res, {code: 403, message:'UserAddress is required'});
    if (!req.body.contractAddress)
      return apiHelper.formatError(res, {code: 403, message:'ContractAddress is required'});
    if (!req.body.endMeterReading)
      return apiHelper.formatError(res, {code: 403, message:'EndMeterReading is required'});

    blockchainService.chargeCompleted(req.body.userAddress, req.body.contractAddress, req.body.endMeterReading)
      .then(contractAddress => res.status(200).send(contractAddress))
      .catch(err => apiHelper.formatError(res, err));
  });

  app.get('/charging/:contractAddress/status', (req, res) => {
    blockchainService.getStatus(req.params.contractAddress)
      .then(contractAddress => res.status(200).send(contractAddress))
      .catch(err => apiHelper.formatError(res, 500, err));
  });

};

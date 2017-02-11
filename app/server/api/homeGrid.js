/**
 * @module server/api/subscription
 * @requires module:server/services/blockchain/subscription
 * @requires module:server/api/helper
 */

const blockchainService = require('../services/blockchain/homeGrid');
const apiHelper = require('./helper');

module.exports = (app, ioClient) => {

  app.post('/homeGrid/deploy', (req, res) => {
    if (!req.body.userAddress)
      return apiHelper.formatError(res, 403, 'User address is required');
    blockchainService.deployContract(req.body.userAddress)
      .then(contractAddress => res.status(200).send(contractAddress))
      .catch(err => apiHelper.formatError(res, err));
  });

  app.post('/homeGrid/:contractAddress/addProsumers', (req, res) => {
    if (!req.body.userAddress)
      return apiHelper.formatError(res, {code: 403, message:'Contract URL is required'});
    if (!req.body.contractAddress)
      return apiHelper.formatError(res, {code: 403, message:'Contract URL is required'});
    if (!req.body.boxAdress)
      return apiHelper.formatError(res, {code: 403, message:'Validator API URL is required'});
    if (!req.body.psysicalAddress)
      return apiHelper.formatError(res, {code: 403, message:'RiskProvider API URL API URL is required'} );
    if (!req.body.isAvailable)
      return apiHelper.formatError(res, {code: 403, message:'CheckListProvider API URL is required'} );
    if (!req.body.sellPrice)
      return apiHelper.formatError(res, {code: 403, message:'Validator address is required'} );
    if (!req.body.buyPrice)
      return apiHelper.formatError(res, {code: 403, message:'RiskProvider address is required'} );
    if (!req.body.chargingContractListHash)
      return apiHelper.formatError(res, {code: 403, message:'CheckListProvider API URL is required'} );

    blockchainService.addProsumers(req.body.userAddress, req.body.contractAddress, req.body.boxAdress, req.body.psysicalAddress, req.body.isAvailable, req.body.sellPrice, req.body.buyPrice, req.body.chargingContractListHash)
      .then(contractAddress => res.status(200).send(contractAddress))
      .catch(err => apiHelper.formatError(res, err));
  });

  app.post('/homeGrid/:contractAddress/addConsumers', (req, res) => {
    if (!req.body.userAddress)
      return apiHelper.formatError(res, {code: 403, message:'Contract URL is required'});
    if (!req.body.contractAddress)
      return apiHelper.formatError(res, {code: 403, message:'Contract URL is required'});
    if (!req.body.psysicalAddress)
      return apiHelper.formatError(res, {code: 403, message:'Validator API URL is required'});
    if (!req.body.isAvailable)
      return apiHelper.formatError(res, {code: 403, message:'RiskProvider API URL API URL is required'} );
    if (!req.body.buyPrice)
      return apiHelper.formatError(res, {code: 403, message:'CheckListProvider API URL is required'} );
    if (!req.body.chargingContractListHash)
      return apiHelper.formatError(res, {code: 403, message:'CheckListProvider API URL is required'} );

    blockchainService.addConsumers(req.body.userAddress, req.body.contractAddress, req.body.psysicalAddress, req.body.isAvailable, req.body.buyPrice, req.body.chargingContractListHash)
      .then(contractAddress => res.status(200).send(contractAddress))
      .catch(err => apiHelper.formatError(res, err));
  });


  app.post('/homeGrid/:contractAddress/updateHome', (req, res) => {
    if (!req.body.userAddress)
      return apiHelper.formatError(res, {code: 403, message:'Contract URL is required'});
    if (!req.body.contractAddress)
      return apiHelper.formatError(res, {code: 403, message:'Contract URL is required'});
    if (!req.body.isAvailable)
      return apiHelper.formatError(res, {code: 403, message:'Validator API URL is required'});
    if (!req.body.sellPrice)
      return apiHelper.formatError(res, {code: 403, message:'RiskProvider API URL API URL is required'} );
    if (!req.body.buyPrice)
      return apiHelper.formatError(res, {code: 403, message:'CheckListProvider API URL is required'} );
    if (!req.body.chargingContractListHash)
      return apiHelper.formatError(res, {code: 403, message:'CheckListProvider API URL is required'} );
    if (!req.body.isProsumer)
      return apiHelper.formatError(res, {code: 403, message:'CheckListProvider API URL is required'} );
 

    blockchainService.updateHome(req.params.userAddress, req.body.contractAddress, req.body.isAvailable, req.body.sellPrice, req.body.buyPrice, req.body.isProsumer, req.body.chargingContractListHash)
      .then(txhash => res.status(200).send(txhash))
      .catch(err => apiHelper.formatError(res, err));
  });


  app.get('/homeGrid/:contractAddress/prosumers', (req, res) => {
    blockchainService.getHomeGridProsumers(req.params.contractAddress)
      .then(prosumers => res.status(200).send(prosumers))
      .catch(err => apiHelper.formatError(res, 500, err));
  });

  app.get('/homeGrid/:contractAddress/consumers', (req, res) => {
    blockchainService.getHomeGridConsumers(req.params.contractAddress)
      .then(consumers => res.status(200).send(consumers))
      .catch(err => apiHelper.formatError(res, 500, err));
  });
  
  app.get('/homeGrid/:contractAddress/consumer/:consumerAddress', (req, res) => {
    blockchainService.getConsumer(req.params.contractAddress, req.params.consumerAddress)
      .then(consumer => res.status(200).send(consumer))
      .catch(err => apiHelper.formatError(res, 500, err));
  });

  app.get('/homeGrid/:contractAddress/prosumer/:prosumerAddress', (req, res) => {
    blockchainService.getProsumer(req.params.contractAddress, req.params.prosumerAddress)
      .then(prosumer => res.status(200).send(prosumer))
      .catch(err => apiHelper.formatError(res, 500, err));
  });

  app.get('/homeGrid/:contractAddress/prosumerByBox/:boxAddress', (req, res) => {
    blockchainService.getProsumerByBox(req.params.contractAddress, req.params.boxAddress)
      .then(prosumer => res.status(200).send(prosumer))
      .catch(err => apiHelper.formatError(res, 500, err));
  });

 app.get('/homeGrid/:contractAddress/consumerByBox/:boxAddress', (req, res) => {
    blockchainService.getProsumerByBox(req.params.contractAddress, req.params.boxAddress)
      .then(prosumer => res.status(200).send(prosumer))
      .catch(err => apiHelper.formatError(res, 500, err));
  });

};

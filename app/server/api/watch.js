const apiHelper = require('./helper');
const watchService = require('../services/blockchain/watch');

module.exports = (app, ioClient) => {
  //Get validator
  app.post('/event/listen/:event',  (req, res) => {
    if (!req.body.contractName)
      return apiHelper.formatError(res, {code: 403, message:'contractName is required'});
    if (!req.body.contractAddress)
      return apiHelper.formatError(res, {code: 403, message:'contractAddress is required'});
    watchService.listenEvent(req.body.contractName, req.body.contractAddress, req.params.event, ioClient, req.body.qualificationRequestId);
  });
};

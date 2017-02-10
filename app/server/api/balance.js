const apiHelper = require('./helper');
const auth = require('../services/auth');
const balanceBlockchainService = require('../services/blockchain/balance');

module.exports = app => {

  app.get('/balance/:address', (req, res) => {

    balanceBlockchainService.getBalance(req.params.address)
      .then(ethers => res.status(200).send({ ethBalance: ethers }))
      .catch(err => apiHelper.formatError(res, err));
  });


  app.get('/balance/audit/:address', (req, res) => {
    balanceBlockchainService.getTransactionsByAccount(req.params.address)
      .then(balance => res.status(200).send( balance ))
      .catch(err => apiHelper.formatError(res, err));
  });

};

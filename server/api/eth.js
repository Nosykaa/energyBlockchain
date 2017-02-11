const balanceService = require('../services/blockchain/balance');
const error = require('../services/error');

module.exports = app => {

  app.get('/balance/:userAddress/', (req, res) => {
    balanceService.getBalance(req.params.userAddress)
      .then(data => res.status(200).json(data))
      .catch(err => error.display(res, err));
  });


};

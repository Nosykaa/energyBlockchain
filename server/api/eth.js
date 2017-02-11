const balanceService = require('../services/blockchain/balance');
const error = require('../services/error');

module.exports = app => {

  app.get('/balance/:contractAddress/', (req, res) => {

    balanceService.getRisk(req.params.contractAddress)
      .then(data => res.status(200).json({
        amount: data.amount,
      }))
      .catch(err => error.display(res, err));
  });


};

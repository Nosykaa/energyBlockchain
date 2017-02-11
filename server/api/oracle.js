const oracleService = require('../services/oracleService');
const error = require('../services/error');

module.exports = app => {

  app.get('/oracle/:contractAddress/', (req, res) => {

    oracleService.getRisk(req.params.contractAddress)
      .then(data => res.status(200).json({
        price: data.price,
        enerAddress: data.validatorAddress
      }))
      .catch(err => error.display(res, err));
  });


};

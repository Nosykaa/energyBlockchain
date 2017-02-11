const request = require('request');

const web3 = require('./index').provider;
const GUID = require('../../index').GUID;


const balanceService = require('../blockchain/balance');

const RISK_REQUEST_EVENT = "RiskRequest";
const CRITERIA_REQUEST_EVENT = "CriteriaRequest";
const RESULT_CRITERIA_EVENT = "ResultCriteriaRequest";
const VALIDATION_REQUEST_EVENT = "ValidationRequest";


class WatchService {

  listenEvent(contractName, contractAddress, event, ioClient, qualificationRequestId) {

    let abi = require('./contract/' + contractName).abi;
    let contract = web3.eth.contract(abi).at(contractAddress);
    contract[event]({}, (err, result) => {
      switch (event) {
        case RISK_REQUEST_EVENT:
          this.handleRiskRequest(contractAddress, result.args.riskProviderAPIURL, result.args.digitalIDAddress, ioClient);
          break;
        case CRITERIA_REQUEST_EVENT:
          this.handleCriteriaRequest(contractAddress, result.args.digitalIDAddress, result.args._checkListProviderAPIURL, result.args.riskProfilContributor, result.args.categoryFund, ioClient);
          break;
        case RESULT_CRITERIA_EVENT:
          this.handleResultCriteria(result.args._validatorAPIURL, qualificationRequestId, ioClient);
          break;
        case VALIDATION_REQUEST_EVENT:
          this.handleValidationRequest(result.args._fundAPIURL);
          break;
      }
    });
  }

  listenBalance (address, userId, ioClient) {

    let filter = web3.eth.filter('latest');

    filter.watch(err => {

      if (err) {
        throw err;
      }

      balanceService.getBalance(address).then(eth => {
        ioClient.emit('watchBalance', {
          userTargets: [userId],
          ethBalance: eth
        });
      })
      .catch(err => {
        filter.stopWatching();
        throw err
      });

    });

  }

  handleRiskRequest (contractAddress, riskProviderAPIURL,digitalIDAddress, ioClient) {

    request.post(riskProviderAPIURL + '/auth?source=http://localhost:3000', {json: {userId: GUID}}, (err, response, body) => {

      if (err) {
        throw err
      }
      if (response.statusCode !== 200) throw body;

      let token = body;

      request.get(riskProviderAPIURL + '/oracle/' + digitalIDAddress + '/risk', {headers: {'x-access-token': token}}, (err, response, body) => {

        if (err) {
          throw err;
        }
        if (response.statusCode != 200) {
          throw  body;
        }

        let data = JSON.parse(body);

        let risk = data.risk;
        let validatorAddress = data.validatorAddress;

        subscriptionService.setRisk(contractAddress, validatorAddress, risk)
          .then(() => {
            userService.find({ "exchange.contractAddress": digitalIDAddress }).then(contributor => {
              ioClient.emit('sendSubscriptionStatus', {
                userTargets: [contributor._id],
                status: 'risk'
              });
            });
          })
          .catch(err => {
            throw err;
          });
      });
    });
  }

  handleCriteriaRequest (subscriptionAddress, digitalIdAddress, checkListProviderAPIURL, risk, categoryFund, ioClient) {

    request.post(checkListProviderAPIURL + '/auth?source=http://localhost:3000', {json: {userId: GUID}}, (err, response, body) => {
      let token = body;

      request.get(checkListProviderAPIURL + '/oracle/' + digitalIdAddress + '/matrix/' + risk + '/type/' + categoryFund, {
        headers: {
          'x-access-token': token
        }
      }, (err, response, body) => {
        if (err) {
          throw err;
        }

        let data = JSON.parse(body);
        let matrix = data.matrix;
        let validatorAddress = data.validatorAddress;

        subscriptionService.setCriteriaList(subscriptionAddress, validatorAddress, matrix)
          .then(() => {
            userService.find({ "exchange.contractAddress": digitalIdAddress }).then(contributor => {
              ioClient.emit('sendSubscriptionStatus', {
                userTargets: [contributor._id],
                status: 'matrix'
              });
            });
          })
          .catch(err => {
            throw err;
          });
      });
    });
  }

  handleResultCriteria (validatorAPIURL, qualificationRequestId, ioClient) {

    userService.findAll({"type": "validator", "exchange.endpoint": validatorAPIURL})
      .then(validators => {
        validators.forEach(validator => {
          notificationService.createByUserId(validator._id, {
            title: 'New subscription',
            action: 'seeQualificationRequest',
            data: {
              qualificationRequestType: 'subscription',
              qualificationRequestId: qualificationRequestId
            }
          }, ioClient);
        });
      })
      .catch(err => {
        throw err;
      });
  }

  handleValidationRequest (fundAPIURL) {
    request.post(fundAPIURL, (err, response, body) => {
      if (err) {
        throw err;
      }
      if (response.statusCode !== 200) {
        throw body;
      }
    });
  }


}

module.exports = new WatchService();

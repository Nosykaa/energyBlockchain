const web3 = require('./index').provider;
const CONTRACT = require('./contract/charging');


class ChargingService {




  deployContract(userAddress, homeAddress, carAddress, sellPrice, startingPointenergy) {
    return new Promise((resolve, reject) => {
      web3.eth.contract(CONTRACT.abi).new(homeAddress, carAddress, startingPointenergy, sellPrice, { from: userAddress, data: CONTRACT.code, gas: 4500000 }, (err, contract) => {
        if (err) {
          reject;
        } else if (contract.address) {
          resolve(contract.address);
        }
      });
    });
  }

  chargeStarted(userAddress, contractAddress, amountToKeep) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      contract.chargeStarted({ from: userAddress, gas: 2500000, value: web3.toWei(amountToKeep, 'ether') }, (err, result) => {
        if (err) {
          return reject(err);
        }
        let txhash = result;
        let filter = web3.eth.filter('latest');
        filter.watch(function (error) {
          if (error) reject(error);
          let receipt = web3.eth.getTransactionReceipt(txhash);
          if (receipt && receipt.transactionHash == txhash) {
            filter.stopWatching();
            if (receipt.logs[0] == undefined) {
              return reject("Error during contract call : no logs");
            }
            //TODO handle error event
            resolve(txhash);
          }
        });
      });

    });
  }

  chargeCompleted(userAddress, contractAddress, endMeterReading) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      contract.chargeCompleted(endMeterReading, { from: userAddress, gas: 2500000}, (err, result) => {
        if (err) {
          return reject(err);
        }
        let txhash = result;
        let filter = web3.eth.filter('latest');
        filter.watch(function (error) {
          if (error) reject(error);
          let receipt = web3.eth.getTransactionReceipt(txhash);
          if (receipt && receipt.transactionHash == txhash) {
            filter.stopWatching();
            if (receipt.logs[0] == undefined) {
              return reject("Error during contract call : no logs");
            }
            //TODO handle error event
            resolve(txhash);
          }
        });
      });

    });
  }


  getStatus(contractAddress) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      let ret = contract.state();
      resolve(ret);
    });
  }


}
module.exports = new ChargingService();

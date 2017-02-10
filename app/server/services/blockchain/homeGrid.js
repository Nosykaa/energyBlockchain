const web3 = require('./index').provider;
const CONTRACT = require('./contract/subscription');


class HomeGridService {

  deployContract(userAddress) {
    return new Promise((resolve, reject) => {
      web3.eth.contract(CONTRACT.abi).new({ from: userAddress, data: CONTRACT.code, gas: 4500000 }, (err, contract) => {
        if (err) {
          reject;
        } else if (contract.address) {
          resolve(contract.address);
        }
      });
    });
  }

  addProsumers(userAddress, contractAddress, boxAdress, psysicalAddress, isAvailable, sellPrice, buyPrice) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      contract.addProsumers(boxAdress, psysicalAddress, isAvailable, sellPrice, buyPrice, { from: userAddress, gas: 2500000, value: web3.toWei(75, 'ether') }, (err, result) => {
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
            resolve(txhash);
          }
        });
      });

    });
  }

  addConsumers(userAddress, contractAddress, psysicalAddress, isAvailable, buyPrice) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      contract.addConsumers(psysicalAddress, isAvailable, buyPrice, { from: userAddress, gas: 2500000, value: web3.toWei(75, 'ether') }, (err, result) => {
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
            resolve(txhash);
          }
        });
      });

    });
  }

  updateHome(userAddress, contractAddress, isAvailable, sellPrice, buyPrice, isProsumer) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      contract.updateHome(sellPrice, buyPrice, isAvailable, isProsumer, { from: userAddress, gas: 2500000, value: web3.toWei(75, 'ether') }, (err, result) => {
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
            resolve(txhash);
          }
        });
      });

    });
  }

  getHomeGridProsumers(contractAddress) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      let len = contract.prosumersLength();
      let returnList = [];

      for (let i = 1; i < len; i++) {
        let o = contract.prosumers[i];
        let item = {
          box: o[0],
          home: o[1],
          psysicalAddress: o[2],
          available: o[3],
          sellPrice: o[4],
          buyPrice: o[5]
        }
        returnList.push(item);
      }
      resolve(returnList);
    });
  }

  getHomeGridConsumers(contractAddress) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      let len = contract.consumersPosition();
      let returnList = [];

      for (let i = 1; i < len; i++) {
        let o = contract.consumers[i];
        let item = {
          home: o[0],
          psysicalAddress: o[1],
          available: o[2],
          buyPrice: o[3]
        }
        returnList.push(item);
      }
      resolve(returnList);
    });
  }

  getConsumer(contractAddress, consumerAddress) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      let ret = contract.getConsumer(consumerAddress, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  getProsumer(contractAddress, prosumerAddress) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      let ret = contract.getProsumer(prosumerAddress, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}
module.exports = new HomeGridService();

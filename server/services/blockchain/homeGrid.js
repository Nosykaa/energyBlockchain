const web3 = require('./index').provider;
const CONTRACT = require('./contract/homeGrid');


class HomeGridService {

  deployContract(userAddress) {
    return new Promise((resolve, reject) => {
      web3.eth.contract(CONTRACT.abi).new({ from: userAddress, data: CONTRACT.code, gas: 4500000 }, (err, contract) => {
        if (err) {
          return reject(err);
        } else if (contract.address) {
          resolve(contract.address);
        }
      });
    });
  }

  addProsumers(userAddress, contractAddress, boxAdress, psysicalAddress, isAvailable, sellPrice, buyPrice, chargingContractListHash) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      contract.addProsumers(boxAdress, psysicalAddress, isAvailable, sellPrice*100, buyPrice*100, chargingContractListHash, { from: userAddress, gas: 2500000 }, (err, result) => {
        if (err) {
          return reject(err);
        }
        let txhash = result;
        let filter = web3.eth.filter('latest');
        filter.watch(function (error) {
          if (error) {
            reject(error);
          }
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

  addConsumers(userAddress, contractAddress, psysicalAddress, isAvailable, buyPrice, chargingContractListHash) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      contract.addConsumers(psysicalAddress, isAvailable, buyPrice*100, chargingContractListHash, { from: userAddress, gas: 2500000 }, (err, result) => {
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

  updateHome(userAddress, contractAddress, isAvailable, sellPrice, buyPrice, isProsumer, chargingContractListHash) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      contract.updateHome(sellPrice, buyPrice, isAvailable, isProsumer, { from: userAddress, gas: 2500000}, (err, result) => {
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
        let o = contract.prosumers(i);
        let item = {
          box: o[0],
          home: o[1],
          psysicalAddress: o[2],
          available: o[3],
          sellPrice: o[4]/100,
          buyPrice: o[5]/100
        }
        returnList.push(item);
      }
      resolve(returnList);
    });
  }

  getHomeGridConsumers(contractAddress) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      let len = contract.consumersLength();
      let returnList = [];

      for (let i = 1; i < len; i++) {
        let o = contract.consumers(i);
        let item = {
          home: o[0],
          psysicalAddress: o[1],
          available: o[2],
          buyPrice: o[3]/100
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
        result.buyPrice = result.buyPrice/100;
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
        result.buyPrice = result.buyPrice/100;
        result.sellPrice = result.sellPrice/100;
        resolve(result);
      });
    });
  }


  getConsumerByBox(contractAddress, boxAddress) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      let ret = contract.getConsumer(boxAddress, (err, result) => {
        if (err) {
          return reject(err);
        }
        result.buyPrice = result.buyPrice/100;
        resolve(result);
      });
    });
  }

  getProsumerByBox(contractAddress, boxAddress) {
    return new Promise((resolve, reject) => {
      let contract = web3.eth.contract(CONTRACT.abi).at(contractAddress);
      let ret = contract.getProsumer(boxAddress, (err, result) => {
        if (err) {
          return reject(err);
        }
        result.buyPrice = result.buyPrice/100;
        result.sellPrice = result.sellPrice/100;
        resolve(result);
      });
    });
  }

  getAccounts() {
    return new Promise((resolve, reject) => {
      let accounts = web3.eth.accounts;
      /*for (let i = 0; i < accounts.length; i++) {
        web3.personal.unlockAccount(accounts[i], "test");
      }*/
      resolve(accounts);
    });
  }

}
module.exports = new HomeGridService();

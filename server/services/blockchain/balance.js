const web3 = require('./index').provider;

class BalanceService {

  getBalance (address) {

    return new Promise((resolve, reject) => {
      web3.eth.getBalance(address, (err, result) => {
        if (err) {
          return reject(err);
        }
        let ethers = parseFloat(web3.fromWei(result, 'ether').toString());
        resolve(ethers);
      });
    });
  }

  getTransactionsByAccount(address) {
    return new Promise((resolve) => {
      var list = [];
      for (var i = 0 ; i <= web3.eth.blockNumber; i++) {
          var block = web3.eth.getBlock(i, true);
          if (block != null && block.transactions != null) {
            block.transactions.forEach( function(e) {
              let input = e.input.substr(0, 10);
              if (address == "*" || address == e.from || address == e.to) {
                let obj = {
                  from: e.from,
                  to: e.to,
                  value: value,
                  update_date:  new Date(block.timestamp*1000),
                  action : input,
                  hash : e.hash
                };
                list.push(obj);
              }
            })
          }
        }

      let sortedList = list.sort((x, y) => new Date(y.update_date) - new Date(x.update_date));
      resolve(sortedList);
    });
  }

}
module.exports = new BalanceService();

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
                let action, value;
                switch(input) {
                  case "0xee92d502":
                    action = "Digital ID Validation";
                    value = 0;
                    break;
                  case "0xa085820e":
                    action = "Fund subscription evaluated";
                    value = 0;
                    break;
                  case "0x31c4e7da":
                    action = "Validator and fund requirements evaluated";
                    value = 0;
                    break;
                  case "0xc5f7d9f0":
                    action = "Validator requirements retrievied";
                    value = 20;
                    break;
                  case "0x5c3729f5":
                    action = "Risk profile evaluated";
                    value = 10;
                    break;
                  case "0xd2025fdc":
                    action = "Subscription confirmed";
                    value = 30;
                    break;
                  case "0x9790e49f":
                    action = "Fund's validators added";
                    value = 0;
                    break;
                  default:
                    action = input;
                    value = 0;
                    break;
                }
                let obj = {
                  from: e.from,
                  to: e.to,
                  value: value,
                  update_date:  new Date(block.timestamp*1000),
                  action : action,
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

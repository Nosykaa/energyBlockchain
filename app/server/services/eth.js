/**
 * @module server/services/Eth
 * @requires module:web3
 * @requires module:eth-lightwallet
 * @requires module:coder
 */

let lightwallet = require('eth-lightwallet');
let coder = require('web3/lib/solidity/coder')
let Web3 = require('web3');
let web3 = new Web3();
let bcServer = "http://localhost:8545";

try {
  web3.setProvider(new web3.providers.HttpProvider(bcServer));
  console.log("Connected to Ethereum blockchain on " + bcServer + " successfully");
} catch (error) {
  throw new Error("Blockchain not connected");
}

/**
 * Ethereum blockchain handling
 * @class
 * @memberof server/services
 */
class EtherService {


  deployContract(CONTRACT, userAddress, contributorAddr, validatorAddr, documentList, termAndCondition){
    return new Promise((resolve, reject) => {
      var listBytes = web3.fromAscii(JSON.stringify(documentList));
      web3.eth.contract(CONTRACT.abi).new(contributorAddr, validatorAddr, listBytes, termAndCondition, {
        from: userAddress,
        data: CONTRACT.code,
        gas: 1500000
      }, (err, contract) => {
        if (err) {
          reject;
        } else if (contract.address) {
          resolve(contract.address);
        }
      });
    });
  }

  sendFunctionTx = function(_contractName, _functionName, _keystore, _contractAddress, _nonce, _jsonArrayOfArguments){
    var signingAddress = _keystore.ksData["m/0'/0'/0'"].addresses[0];
    var contract = Contract.findOne({contractName: _contractName});
    var account = UserAccount.findOne({address: signingAddress});
    var _pass = account.pwd;
    if(contract === undefined){
      throw "No contract named contractName in the Contract database. check your contractName parameter (the first one in your call)"
    } else {
      var abi = contract.abi;
      var keystore = lightwallet.keystore.deserialize(JSON.stringify(_keystore));
      var args = [];
      for(i = 0; i < Object.keys(_jsonArrayOfArguments).length; i++){
        args.push(_jsonArrayOfArguments[Object.keys(_jsonArrayOfArguments)[i]].toString());
      }
      var txOptions = {
        nonce: _nonce,
        to: _contractAddress,
        gasPrice: 180000000000000,
        gasLimit: 100000 * 30
      };
      var functionTx = lightwallet.txutils.functionTx(abi, _functionName,  args, txOptions)
      var fut = new Future();
      lightwallet.keystore.deriveKeyFromPassword(_pass, function(error, pwDerivedKey){
        if(pwDerivedKey){
          return "0x" + lightwallet.signing.signTx(keystore, pwDerivedKey, functionTx, signingAddress, undefined);
        }
      });
    }
  }

  getEvent = function(){

  }
}






let Web3 = require('web3');
let web3 = new Web3();

let bcServer = process.env.ETHEREUM_URI && process.env.ETHEREUM_PORT ? `${process.env.ETHEREUM_URI}:${process.env.ETHEREUM_PORT}` : "http://localhost:8545";

module.exports = {

  provider: web3,

  connect: function () {
    try {
      web3.setProvider(new web3.providers.HttpProvider(bcServer));
      console.log("Connected to Ethereum blockchain on " + bcServer + " successfully");
    } catch (error) {
        throw new Error("Blockchain not connected");
    }
  },

};

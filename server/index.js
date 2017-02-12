process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.NODE_PORT = process.env.NODE_PORT || 5000;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const blockchain = require('./services/blockchain');

app.use(cors());
app.use(bodyParser.json({ limit: '500mb' }));


require('./api/homeGrid')(app);
require('./api/charging')(app);
require('./api/eth')(app);
require('./api/user')(app);

app.listen(process.env.NODE_PORT, () => {
  console.log('Server Trade-E App listenning on port ' + process.env.NODE_PORT);
  blockchain.connect();
  initFactory();
});


function initFactory() {
  let homeGridService = require('./services/blockchain/homeGrid');
  let database = require('./services/db');
  //init UserAccount
  homeGridService.getAccounts()
    .then(accounts => {
      let prosumer = {
        login: "prosumer",
        password: "test",
        address: accounts[0],
        chargingHistory : []
      };
      let consumer = {
        login: "consumer",
        password: "test",
        address: accounts[1],
        chargingHistory : []
      };
      let box = {
        login: "box",
        password: "test",
        address: accounts[2]
      };
      let car = {
        login: "car",
        password: "test",
        address: accounts[3]
      };

      let homeGrid = {
        consumers: [
          {
            home: consumer.address,
            psysicalAddress: "53.2096288,6.5694025",
            available: true,
            buyPrice: 0.15,
          },
          {
            home: consumer.address,
            psysicalAddress: "53.208681, 6.567191",
            available: true,
            buyPrice: 0.17,
          },
          {
            home: consumer.address,
            psysicalAddress: "53.206561, 6.566017",
            available: true,
            buyPrice: 0.13,
          },
        ],
        prosumers: [
          {
            box: box.address,
            home: prosumer.address,
            psysicalAddress: "53.209022, 6.572535",
            available: true,
            buyPrice: 0.13,
            sellPrice: 0.15,
          },
          {
            box: box.address,
            home: prosumer.address,
            psysicalAddress: "53.211001, 6.572159",
            available: true,
            buyPrice: 0.15,
            sellPrice: 0.17,
          },
          {
            box: box.address,
            home: prosumer.address,
            psysicalAddress: "53.207319, 6.571741",
            available: true,
            buyPrice: 0.10,
            sellPrice: 0.13,
          },
        ]
      }

      homeGridService.deployContract(accounts[4])
        .then(contractAddress => {
          let homeGridAddress = contractAddress;

          for (let i = 0; i < homeGrid.prosumers.length; i++) {
            let elt = homeGrid.prosumers[i];
            homeGridService.addProsumers(elt.home, homeGridAddress, elt.box, elt.psysicalAddress, elt.available, elt.sellPrice, elt.buyPrice, 0)
            .catch(err => {
                throw err;
              });
          }

          for (let j = 0; j < homeGrid.consumers.length; j++) {
            let elt = homeGrid.consumers[j];
            homeGridService.addConsumers(elt.home, homeGridAddress, elt.psysicalAddress, elt.available, elt.buyPrice, 0)
              .catch(err => {
                throw err;
              });
          }

          console.log("Blockchain init added to db");
          database.getDb()
            .then(db => {

              db.collection('app').deleteMany({});
              db.collection('user').deleteMany({});

              db.collection('app').insertOne({
                "login" : "homeGrid",
                "homeGridAddress": homeGridAddress
              }, err => {
                if (err) {
                  throw err;
                }
              });

              console.log("Homegrid address added to db");
              db.collection('user').insertOne(prosumer, err => {
                if (err) {
                  throw err;
                }
              });

              db.collection('user').insertOne(consumer, err => {
                if (err) {
                  throw err;
                }
              });
              db.collection('user').insertOne(box, err => {
                if (err) {
                  throw err;
                }
              });

              db.collection('user').insertOne(car, err => {
                if (err) {
                  throw err;
                }
              });
              console.log("user added to db");
            })
            .catch(err => {
              throw err;
            });
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });
}

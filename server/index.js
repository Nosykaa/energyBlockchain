process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.NODE_PORT = process.env.NODE_PORT || 5000;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(bodyParser.json({ limit: '500mb' }));

require('./api/oracle')(app);

app.listen(process.env.NODE_PORT, () => {
  console.log('Server Trade-E App listenning on port ' + process.env.NODE_PORT);
  initFactory();
});


function initFactory() {
  let database = require('./services/db');
  database.getDb()
  .then(db => {

      db.collection('identity').insertOne({
        "keystore_public_address": "0x2574ee585b9cb0da4df5e8c8a279bb4760282e6b",
        "keystore_private_address": "6e65908741a60e14d2ea18876870ca2fd70109dd088d3c07ff15acadbb385f57"
      }, err => {
        if (err) {
          throw err;
        }
      });
    })
  .catch(err => {
    throw err;
  });
}

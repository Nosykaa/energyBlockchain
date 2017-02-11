process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.NODE_PORT = process.env.NODE_PORT || 5000;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const blockchain = require('./services/blockchain');

app.use(cors());
app.use(bodyParser.json({ limit: '500mb' }));


require('./api/oracle')(app);
require('./api/watch')(app);

app.listen(process.env.NODE_PORT, () => {
    console.log('Blockchain listening on localhost');
    blockchain.connect();
    console.log('Validator App listenning on port ' + process.env.NODE_PORT);
});

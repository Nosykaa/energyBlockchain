const port = process.env.NODE_PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const config = require(`./server/services/config/${process.env.NODE_ENV}`);
const http = require('http');
const blockchain = require('./server/services/blockchain');
const Database = require('./server/services/database');

let app = require('./server')(port);
let server = http.createServer(app);

server.listen(port, () => {
    console.log('Application listening on localhost:' + port);
    blockchain.connect();

});


module.exports = server;

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const i18n = require('./services/i18n');
const auth = require('./services/auth');

const env = process.env.NODE_ENV || 'dev';
//const publicSrc = 'src';
const publicSrc = env === 'prod' ? 'dist' : 'src';

module.exports = (port) => {

  let app = express();

  //Set middlewares
  app.use(cors());
  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(auth.initialize());
  app.use(express.static(__dirname + '/../public/' + publicSrc));
  app.use(i18n.init);

  //Render the rootpath for the application
  app.get('/', (req, res) => {
    res.sendFile('index.html');
  });

  require('./router')(app, port);

  return app;
};

module.exports.GUID = new require('mongodb').ObjectID();

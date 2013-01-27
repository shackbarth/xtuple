var X = {},
  xt = require('xt');

  require('../../../../node-xt/foundation/foundation');
  require('../../../../node-xt/database/database');

  var orm = require('./orm');

  var creds = { hostname: 'localhost',
     username: 'shackbarth',
     port: '5432',
     database: 'dev',
     organization: 'dev' };

  var path = '../../../public-extensions/source/incident_plus/database/orm';
  var socket = {databaseOptions: creds};

orm.select(socket, creds, function () {
  orm.refresh(socket, {path: path}, function () {
    orm.install(socket);
  });
});

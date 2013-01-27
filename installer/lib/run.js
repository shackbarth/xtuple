NOSERVER = true;

var X = {};
  //xt = require('xt');
  require('../../../../node-xt/foundation/foundation');
  require('../../../../node-xt/database/database');

  var orm = require('./orm');

  var creds = { hostname: 'localhost',
     username: 'shackbarth',
     port: '5432',
     database: 'dev3',
     organization: 'dev3' };

  var path = '../../../public-extensions/source/crm/database/orm';
  //var path = '../../client/orm';


  orm.run(creds, path);

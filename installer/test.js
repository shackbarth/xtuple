  var orm = require('./lib/orm'),
    creds = {
      hostname: 'localhost',
      username: 'shackbarth',
      port: '5432',
      database: 'dev3',
      organization: 'dev3'
    };

  var path = '../../../public-extensions/source/crm/database/orm';
  orm.run(creds, path);


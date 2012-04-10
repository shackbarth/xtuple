/*globals global require __dirname BT */

require('blossom/buildtools'); // adds the SC and BT namespaces as globals

var path = require('path');

var project = BT.Project.create({

  "postbooks": BT.App.create({
    frameworks: 'blossom xt xm'.w(),
    sourceTree: path.join(__dirname, 'apps/postbooks')
  }),

  "console": BT.App.create({
    frameworks: 'blossom xt xm'.w(),
    sourceTree: path.join(__dirname, 'apps/console')
  }),

  "blossom": require('blossom'),
  "foundation": require('blossom/foundation'),
  "datastore": require('blossom/datastore'),

  "xm": require('./frameworks/xm/node/buildfile'),
  "xt": require('./frameworks/xt/node/buildfile'),

  "datasource": BT.Proxy.create({
    proxyHost: 'aurora.xtuple.com',
    proxyPort: 9000,
    proxyPrefix: '/'
  }),

  "data": BT.Proxy.create({
    proxyHost: 'aurora.xtuple.com',
    proxyPort: 9000,
    proxyPrefix: '/data'
  })
});

BT.Server.create({
  project: project
});

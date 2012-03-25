/*globals global require __dirname BT */

require('blossom/buildtools'); // adds the SC and BT namespaces as globals

var path = require('path');

var project = BT.Project.create({

  "postbooks": BT.App.create({
    frameworks: 'blossom xm xt'.w(),
    sourceTree: path.join(__dirname, 'apps/postbooks')
  }),

  "console": BT.App.create({
    frameworks: 'blossom xm'.w(),
    sourceTree: path.join(__dirname, 'apps/console')
  }),

  "blossom": require('blossom'),
  "foundation": require('blossom/foundation'),
  "datastore": require('blossom/datastore'),

  "xm": require('./frameworks/xm/node/buildfile'),
  "xt": require('./frameworks/xt/node/buildfile'),

  "datasource": BT.Proxy.create({
    proxyHost: '127.0.0.1',
    proxyPort: 9000,
    proxyPrefix: '/'
  }),

  "data": BT.Proxy.create({
    proxyHost: '127.0.0.1',
    proxyPort: 9000,
    proxyPrefix: '/data'
  })
});

// project.accept(BT.LoggingVisitor.create());

BT.Server.create({
  project: project
});

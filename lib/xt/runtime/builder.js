
var _fs     = require('fs');
var _path   = require('path');

var mode = XT.mode;
var clientRoot = _path.join(XT.basePath, '../client');

if(mode === 'develop') {

  require('blossom/buildtools');

  var target = XT.opts['target-app'];
  var port = XT.opts['app-port'];

  var project = BT.Project.create({
  
    main: BT.App.create({
      frameworks: 'blossom xm'.w(),
      sourceTree: _path.join(clientRoot, 'apps', target) 
    }),

    blossom: require('blossom'),

    xm: require(_path.join(clientRoot, 'frameworks/xm/node/buildfile')),

    // seems silly but whatever
    datasource: BT.Proxy.create({
      proxyHost: 'localhost',
      proxyPort: XT.opts['server-port'],
      proxyPrefix: '/'
    }),

    data: BT.Proxy.create({
      proxyHost: 'localhost',
      proxyPort: XT.opts['server-port'],
      proxyPrefix: '/data'
    })

  });
  
  // temp
  BT.Server.create({
    project: project
  });
}



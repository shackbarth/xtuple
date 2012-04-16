
if(XT.mode !== 'develop') return;

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

  // THIS IS ALL TEMPORARY
  var log = console.log;
  var buf = XT.StringBuffer.create();
  console.log = function() {
    var idx = 0;
    for (; idx < arguments.length; ++idx) {
      buf.push(arguments[idx]);
    }
  }
  console.log("Blossom Buildtools Server >> ");
  // NOW START THE SERVER BUT CATCH ITS OUTPUT SINCE
  // WE HAVE NO CONTROL OVER IT
  BT.Server.create({
    project: project
  });
  // NOW RESUME NORMAL OUTPUT
  console.log = log;
  console.log(buf.flush().color);
}



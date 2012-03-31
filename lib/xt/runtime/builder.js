
var mode = XT.mode;
var clientRoot = XT.fs.join(XT.basePath, '../client');

if(mode === 'develop') {

  require('blossom/buildtools');

  var target = XT.opts['target-app'];
  var port = XT.opts['app-port'];

  var project = BT.Project.create({
  
    main: BT.App.create({
      frameworks: 'blossom xm'.w(),
      sourceTree: XT.fs.join(clientRoot, 'apps', target) 
    }),

    blossom: require('blossom'),

    xm: require(XT.fs.join(clientRoot, 'frameworks/xm/node/buildfile')),

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



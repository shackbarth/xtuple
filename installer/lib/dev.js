
/*global XT */

var _path     = require('path');

var root = _path.join(XT.basePath, 'www');
var connect = XT.connect;
var server = connect.createServer();


// we want the server to have a few features available
// from connect
server.use(connect.static(root, { redirect: true }));

// this may not be useful, necessary or even desirable
// but its here so get used to it...unless it needs to
// be removed...
server.use(connect.directory(root, { icons: true }));

XT.dev = XT.Server.create(
  /** @lends XT.dev.prototype */ {

  port: 9080,
  useWebSocket: true,
  name: 'dev',
  autoStart: true,
  server: server
});

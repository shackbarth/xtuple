
//...........................................
// Server Initialization/Setup
//
// Include all of the necessary modules and ensure that
// they will be available throughout the application
// by adding them to the xt namespace.

/** @lends xt */  require('./xt');

// once bootstrapper is complete the framework is up
// and running and procedures can continue...
process.once('xtBootstrapped', function() {
  
  // start a development server
  xt.server.create({
    port: 8080,
    useWebSocket: YES,
    name: 'devUI',
    _server: xt.connect.createServer(
      xt.connect.static(xt.fs.basePath + '/www')
    )
  }).once('xtSocketsSet', function(sockets) {
    var orm = require('./xt/ext/orm');
    sockets.on('connection', function(socket) {
      orm.populate(socket); 
      socket.on('refresh', function() {
        orm.populate(socket);
      });
    });
  }).start();

})

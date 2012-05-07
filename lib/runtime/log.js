
Logger = XT.Object.create(
  /** @lends Logger.prototype */ {

  /**
    Array of sockets waiting to be notified.
  */
  sockets: [],

  /** @private */
  init: function() {

    // hook the logging functions so we will be
    // notified when output is supposed to be
    // published
    XT.io.addHook(['log', 'debug', 'warn', 'report'], this.log);
    XT.io.addHook(['err'], this.error);

    // make sure to set ourselves as the handler for the
    // /log socket routes on the devUI server
    XT.dev.setSocketHandler(
      '/log',           // socket path
      'connection',     // socket event to secure the socket
      this.addSocket,   // callback when fired
      this              // context
    );
  },

  /** @private */
  addSocket: function(socket) {
    var sockets = Logger.get('sockets');
    sockets.push(socket);
  },

  /** @private */
  error: function(msg) {
    var sockets = Logger.get('sockets');
    sockets.forEach(function(socket) {
      socket.json.emit('error', msg.plain);
    });
  },

  /** @private */
  log: function(msg) {
    var sockets = Logger.get('sockets');
    sockets.forEach(function(socket) {
      socket.json.emit('log', msg.plain);
    });
  }

});

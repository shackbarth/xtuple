
// start the primary datasource server process
var server = XT.dataServer = XT.Server.create({
  name: 'dataServer',
  port: XT.opts['server-port'],
  autoStart: true,
  router: XT.dataRouter,
  useWebSocket: true,
  init: function() {
    arguments.callee.base.apply(this, arguments);

    var functors = XT.functors;
    var map = {};
    var handles;
    var functor;
    var idx = 0;
    for (; idx < functors.length; ++idx) {
      handles = functors[idx].handles;
      functor = functors[idx].target;
      map[handles] = functor;
    }
    this.set('handlers', map);
  },
  makeHandler: function(callback) {
    return function(wrapper, ack) {
      var payload = wrapper.payload;
      if (XT.typeOf(payload) === XT.T_STRING) payload = XT.json(payload);
      var session = XT.Session.create().from(wrapper);
      callback(payload, session, ack);
    }
  }
});

server.setSocketHandler('/client', 'connection', initClientSocket, server);

function initClientSocket(socket) {
  var map = this.get('handlers');
  var keys = Object.keys(map);
  var idx = 0;
  var handles;
  var handler;
  for (; idx < keys.length; ++idx) {
    handles = keys[idx];
    handler = map[handles];
    handler = this.makeHandler(handler.handle);
    socket.on(handles, handler);
  }
  socket.on('message', function() { XT.debug(arguments); });
}

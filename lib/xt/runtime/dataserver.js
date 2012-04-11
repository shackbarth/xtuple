
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
      // var session = new XT.Session(wrapper);
      var session = undefined;
      var response = callback(payload, session);
      ack(response);
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

    console.log('registering for event', handles);

    handler = map[handles];
    handler = this.makeHandler(handler.handle);
    socket.on(handles, handler);
  }
  socket.on('message', function() { XT.debug(arguments); });
}

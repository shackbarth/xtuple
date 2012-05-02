
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
    var jdx = 0;
    for (; idx < functors.length; ++idx) {
      handles = functors[idx].handles;
      functor = functors[idx].target;
      if (XT.typeOf(handles) !== XT.T_ARRAY) {
        handles = [handles];
      }
      for (jdx = 0; jdx < handles.length; ++jdx) {
        map[handles[jdx]] = functor;
      }
    }
    this.set('handlers', map);
  },

  makeHandler: function(callback, event, functor, socket) {
    return function(wrapper, ack) {
      var payload = wrapper.payload;
      var session = null;
      if (XT.typeOf(payload) === XT.T_STRING) payload = XT.json(payload);

      if (functor.needsSession) {
        session = XT.Session.create(wrapper);
        session.on('session:message', function(message) {
          socket.json.emit('debug', { message: message });
        });
      }

      var wrappedAck = function(payload, overloaded) {
        var packet = {};

        // making special note even before other comments have been
        // written because this isn't obvious - in cases where a 
        // session has been manually created such as the session
        // request handler it needed a way to hand the ack the
        // new session 
        if (overloaded) session = overloaded;

        packet.code = session.get('state');
        packet.data = payload;

        // XT.debug("Payload response to client => ", packet.data);

        ack(packet);
      }

      if (session) {
        session.ready(function(session) {
          callback(payload, session, wrappedAck, event, socket);
        });
      } else { callaback(payload, wrappedAck, event, socket); }
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
  var handle;
  for (; idx < keys.length; ++idx) {
    handles = keys[idx];
    handler = map[handles];
    handler = this.makeHandler(handler.handle, handles, handler, socket);
    socket.on(handles, handler);
  }
  socket.on('message', function() { XT.debug(arguments); });
}

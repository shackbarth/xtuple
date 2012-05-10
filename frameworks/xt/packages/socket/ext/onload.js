
sc_require('ext/socket.io.min');

// RESET THESE PROPERTIES BY HAND FOR NOW
SOCKET_SOURCE = window.DATASOURCE_HOST || 'aurora.xtuple.com';
SOCKET_PORT = 9000;
SOCKET_SERVER_DEBUGGING = true;

//.........................................
// this needs to work by exposing the actual
// node address/port to the client by the
// builder?
// TODO: THIS SHOULD NOT BE HARD CODED TO LOOK HERE!
// var socket = XT.socket = io.connect('http://aurora.xtuple.com:9000/client');
SOCKET_URL = 'http://' + SOCKET_SOURCE + ':' + SOCKET_PORT + '/client';
SC.Logger.info("USING %@ TO CONNECT TO SOCKET".fmt(SOCKET_URL));
var socket = XT.socket = io.connect(SOCKET_URL);
// set a timeout so we can tell if something
// most likely went wrong, this is not a long
// term way to fix this problem but for a first
// pass attempt it will have to suffice
var socketInterval = setInterval(function() {
  SC.Logger.warn("Still waiting on a socket...");
}, 500);
// try to catch a connect event but make sure to
// clear the timer
socket.on('connect', function() {
  // don'tallow it to stupidly attempt to redo all of the initial
  // load stuff when we're simply reconnecting
  if (XT.DATASOURCE_CONNECTED) return;
  XT.DATASOURCE_CONNECTED = true;
  clearInterval(socketInterval);
  SC.Logger.info("Connected to datasource via socket");
  SC.ready(function() {

    // THIS NEEDS TO BE REPLACED BECAUSE THERE SHOULD BE A LOGIN
    // AVAILABLE TO SET THIS!
    // XT.session.acquireSession('admin', 'Assemble!Aurora', 'aurora');
    XT.session.acquireSession("{{@databaseUser}}", "{{@databaseUserPassword}}", "{{@databaseOrganization}}");
  });
});
// for debugging purposes
socket.on('debug', function(payload) {
  if (SOCKET_SERVER_DEBUGGING) {
    console.log("<<SOCKET DEBUG MESSAGE>> " + payload.message, "\n<<END>>");
  }
});

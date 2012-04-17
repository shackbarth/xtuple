
sc_require('ext/socket.io.min');

//.........................................
// this needs to work by exposing the actual
// node address/port to the client by the
// builder?
var socket = XT.socket = io.connect('http://localhost:9000/client');
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
  clearInterval(socketInterval);
  SC.Logger.info("Connected to datasource via socket");
});
// for debugging purposes
socket.on('debug', function(payload) {
  console.log("<<SOCKET DEBUG MESSAGE>> " + payload.message, "\n<<END>>");
});

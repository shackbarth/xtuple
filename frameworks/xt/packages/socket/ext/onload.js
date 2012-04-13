
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
var socketTimeout = setTimeout(function() {
  SC.Logger.error("Could not acquire a socket to the datasource");
}, 2000);
// try to catch a connect event but make sure to
// clear the timer
socket.on('connect', function() {
  clearTimeout(socketTimeout);
  SC.Logger.info("Connected to datasource via socket");
});

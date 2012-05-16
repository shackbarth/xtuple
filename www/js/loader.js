SC.ready(function() {
  var url = 'http://' + BUILDER_HOST + ':' + BUILDER_HOST_PORT + '/' + BUILDER_HOST_NAMESPACE;
  var socket = window.BUILDER_SOCKET = io.connect(url);
  console.log("Connecting to builder via " + url);
  socket.on('connect', function() {
    console.log("Connection established to the builder");
  });
  socket.on('source', function(source) {
    var target = source.name;
    var code = source.source;    
    console.log("Loading source from target " + target);
    try {
      (window.execScript || function(data) {
        window['eval'].call(window, data);
      })(code);
    } catch(err) {
      console.error("Failed to execute application source (target: " + target + ")");
      console.error(err.message, err.stack);
      console.log(code);
    }
  });
  socket.on('start', function() {
    SC.didBecomeReady();
  });
  if (PROJECT_MODE !== 'inlined' && PROJECT_MODE !== 'development') {
    socket.emit('fetch', { request: 'source' });
  } else if (PROJECT_MODE === 'development') {
    SC.didBecomeReady();
  }
});

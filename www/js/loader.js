//hack for chrome...
var chrometimeout = setTimeout(function(){onload();},4000);
function onload() {
  var url = 'http://' + BUILDER_HOST + ':' + BUILDER_HOST_PORT + '/' + BUILDER_HOST_NAMESPACE;
  var socket = window.BUILDER_SOCKET = io.connect(url);
  var count = 0;
  var targets = BUILDER_TARGET_COUNT;
  if (chrometimeout) clearTimeout(chrometimeout);
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
      count += 1;
      if (count === targets) SC.didBecomeReady();
    } catch(err) {
      console.error("Failed to execute application source (target: " + target + ")");
      console.error(err.message, err.stack);
      console.log(code);
    }
  });
  if (PROJECT_MODE !== 'development') {
    socket.emit('fetch', { request: 'source' });
  } else if (PROJECT_MODE === 'development') {
    SC.didBecomeReady();
  }
}

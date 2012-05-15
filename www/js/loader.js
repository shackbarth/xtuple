function onload() {
  var url = 'http://' + BUILDER_HOST + ':' + BUILDER_HOST_PORT + '/' + BUILDER_HOST_NAMESPACE;
  var socket = window.BUILDER_SOCKET = io.connect(url);
  // var container = $('#loader-container');
  // var width = $(window).innerWidth();
  // var height = $(window).innerHeight();
  // $(container).css('left', ((width /2) - 250) + 'px');
  // $(container).css('top', ((height /2) - 100) + 'px');
  // $('#loader-progress-bar').progressbar({ 'value': 0 });
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
        // var loader = $('#loader-progress-bar');
        // var value = $(loader).progressbar('value');
        // $(loader).progressbar('value', value + (100 / BUILDER_TARGET_COUNT));
      })(code);
    } catch(err) {
      console.error("Failed to execute application source (target: " + target + ")");
      console.error(err.message, err.stack);
      console.log(code);
    }
  });
  var clearLoader = function() {
    // document.body.removeChild(document.getElementById('loader-container'));
    // setTimeout(function() {
    //   $('#loader-container').remove();
    // }, 2000);
  }
  socket.on('start', function() {
    SC.didBecomeReady();
    clearLoader();
  });
  if (PROJECT_MODE !== 'inlined' && PROJECT_MODE !== 'development') {
    socket.emit('fetch', { request: 'source' });
  } else { 
    // $('#loader-progress-bar').progressbar({ 'value': 100 }); 
    clearLoader();
  }
};

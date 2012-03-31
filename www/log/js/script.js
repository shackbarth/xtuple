
window.loc = (function() {
  var l = window.location.href,
      p = l.match(/:(\d+)\//)[1],
      d = document.domain;
  return 'http://' + d + ':' + p + '/log';
})();

function log() {
  var args = Array.prototype.slice.call(arguments),
      label = args.length > 1 ? args.shift() : '&gt; ',
      msg = args.shift(),
      type = args.length >= 1 ? args.shift() : '';

  // hack
  if(msg === '') label = '&nbsp;';
  msg = sterilize(label + msg);
  console.log(msg);
  $(con).append($('<span />').addClass('entry').addClass(type).html(msg));
  $(con).scrollTop(con[0].scrollHeight);
}

function sterilize(html) {
  return html
    .replace(/\'/, "&rsquo;");
}

$(document).ready(function() {

  // connect to the correct server and make the socket
  // available for all future methods
  var socket = io.connect(loc);

  // grab the reference to the console once
  window.con = $('#console');

  // fix so we can see the initial console messages
  log('')

  // wait for the list to be auto-populated
  socket.on('connect', function() {
    log("connected to remote server");
    log("waiting for output from datasource");
  });

  // on error
  socket.on('error', function(payload) {
    log("&lt;error&gt; ", payload, 'error');
  });

  // on message
  socket.on('log', function(message) {
    log("", message, 'server');
  });

})

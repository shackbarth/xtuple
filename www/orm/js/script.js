
/**
  Assume the ajax routed server is running
  at port 19656 and gather the actual host
  information to allow for appropriate requests
  to be made.
*/
window.loc = (function() {
  var l = window.location.href,
      p = l.match(/:(\d+)\//)[1],
      d = document.domain;
  return 'http://' + d + ':' + p;
})();

function log() {
  var args = Array.prototype.slice.call(arguments),
      label = args.length > 1 ? args.shift() : '&gt; ',
      msg = args.shift(),
      type = args.length >= 1 ? args.shift() : '';

  // hack
  if(msg === '') label = '&nbsp;';

  console.log(label + msg);
  $(con).append($('<span />').addClass('entry').addClass(type).html(label + msg));
  $(con).scrollTop(con[0].scrollHeight);
}

$(document).ready(function() {

  // connect to the correct server and make the socket
  // available for all future methods
  var socket = io.connect(loc);

  // grab the reference to the console once
  window.con = $('#console');
  window.list = $('#list > .files');

  // need to adjust list height on window resize
  $(window).resize(adjustList);

  // fix so we can see the initial console messages
  log("")

  // wait for the list to be auto-populated
  socket.on('connect', function() {
    log("connected to remote server");
    log("waiting for populated list of ORM's");
  });

  // on populate
  socket.on('populate', function(payload) {
    console.log(payload);
    log("received content for list");
    populate(payload);
  });

  // on error
  socket.on('error', function(payload) {
    var message = payload.context + ' => ' + payload.message;
        message += '<br />&nbsp;&nbsp;&nbsp;&nbsp;This usually indicates there is a typo in a source file';
    log("&lt;error&gt; ", message, 'error');
  });

  // on message
  socket.on('message', function(message) {
    log("update &gt; ", message, 'server');
  });

  // select all functionality
  $('#selectAll').click(function(e) {
    $('input:checkbox', $(list)).each(function() {
      $(this).prop('checked', true);
    });
  });

  // deselect all functionality
  $('#deselectAll').click(function(e) {
    $('input:checkbox', $(list)).each(function() {
      $(this).prop('checked', false);
    });
  });

  // clear console functionality
  $('#clear').click(function(e) {
    $('.entry', $('#console')).each(function() {
      $(this).remove();
    });
  });

  // refresh list functionality
  $('#refresh').click(function(e) {
    log("refreshing populated list");
    socket.emit('refresh');
  });

})

function populate(orms) {
  log("populating table");
  $(list).empty();
  $.each(orms, function(model, orm) {
    var c = $('<div class="entry" />')
      .append($('<div class="header" />')
        .append($('<span class="model" />')
          .text(model))
        .append($('<span class="comment" />')
          .text(orm.comment))
        .append($('<span class="check" />')
          .append($('<input type="checkbox" />')
            .attr('name', orm.type)
            .attr('value', orm.type))))
      .append($('<div class="details" />')
        .append($('<div class="column" />')
          .append($('<span class="label" />')
            .text('Filename'))
          .append($('<span class="value" />')
            .text(orm.fileName)))
        .append($('<div class="column" />')
          .append($('<span class="label" />')
            .text('Table'))
          .append($('<span class="value" />')
            .text(orm.table))));
    if(orm.deps)
      $(c).append($('<div class="column" />')
        .append($('<span class="label" />')
          .text('Dependencies'))
        .append($('<span class="value" />')
          .text(orm.deps.join(', '))));
    $(list).append(c);
  });
  $('.entry > .header', $(list)).each(function() {
    $(this).hover(
      function() { $(this).css('background-color', '#ddd'); },
      function() { $(this).css('background-color', '#eee'); }
    );
    $(this).click(function(e) {
      e.preventDefault();
      var c = $('span > input', $(this));
      $(c).prop('checked', $(c).prop('checked') ? false : true);
    });
  });
  adjustList();
}

function adjustList() {
  $(list).css('height', ($(con).position().top - 50) + 'px');
}

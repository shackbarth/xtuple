
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
  window.list = $('#list > .files');

  // need to adjust list height on window resize
  $(window).resize(adjustList);

  // fix so we can see the initial console messages
  log('')

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
        if(payload.context.match('.json'))
          message += '<br />&nbsp;&nbsp;&nbsp;&nbsp;This usually indicates there is a typo in a source file';
        else if(payload.context === 'init')
          message += '<br />&nbsp;&nbsp;&nbsp;&nbsp;The repository is missing or has invalid permissions';
    log("&lt;error&gt; ", message, 'error');
  });

  // on success
  socket.on('success', function(name) {
    log("successfully installed " + name);
    doneInstalling(name);
  });

  // on message
  socket.on('message', function(message) {
    log("update &gt; ", message, 'server');
  });

  // select all functionality
  $('#selectAll').click(function(e) {
    $('input:checkbox', $(list)).each(function() {
      if($(this).hasClass('unselectable')) return;
      $(this).prop('checked', true);
    });
  });

  // install functionality
  $('#install').click(function(e) {
    var types = [], pos, controls;
    $('input:checkbox:checked').each(function(k, input) {
      var entry = $(input).closest('.entry');
      $(entry).addClass('installing');
      types.push($(entry).attr('name'));
      $(input).prop('checked', false).attr('disabled', true);
    });
    if(types.length <= 0) return;

    var c = $('<div id="installing" />');
    $(c).append($('<span class="light-header">Installing</span>'));
    $.each(types, function(k, type) {
      $(c).append($('<span class="entry" />')
        .text(type));
    });
    $('div[role="main"]').append(c);
    controls = $('#controls');
    pos = $(controls).position().top + $(controls).outerHeight() + 10;
    $(c).css('top', pos + 'px');
    $(c).css('width', $(controls).outerWidth() + 'px');

    // ok, enough of the cute stuff lets tell the datasource
    // what the hell is going on
    socket.json.emit('install', types);
    log("sending install command to datasource");
  });

  // deselect all functionality
  $('#deselectAll').click(function(e) {
    $('input:checkbox:checked', $(list)).each(function() {
      $(this).prop('checked', false);
    });
  });

  // clear console functionality
  $('#clear').click(function(e) {
    $('.entry', $('#console')).each(function() {
      $(this).remove();
    });
    log('');
  });

  // refresh list functionality
  $('#refresh').click(function(e) {
    log("refreshing populated list");
    socket.emit('refresh');
  });

})

function populate(orms) {
  log("analyzing data and creating list content");
  $(list).empty();
  var typesAvailable = [];
  $.each(orms, function(namespace, defs) {
    $.each(defs, function(k) { typesAvailable.push(k); });
    $.each(defs, function(model, orm) { 
      var c = $('<div class="entry" />')
        .attr('id', namespace.toLowerCase() + model.toLowerCase())
        .attr('name', namespace + '.' + model)
        .append($('<div class="header" />')
          .append($('<span class="namespace" />')
            .text(orm.nameSpace))
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
      if(orm.deps && orm.deps.length > 0) {
        var col = $('<div class="column" />')
              .append($('<span class="label" />')
                .text('Dependencies'))
              .append($('<span class="value" />')),
            deps = [];
        $.each(orm.deps, function(k, dep) { 
          if($.inArray(dep.type, deps) <= -1) deps.push(dep.type); 
          if($.inArray(dep.type, typesAvailable) <= -1) {
            console.warn("SHOULD BE DISABLING", orm);
            $('input[type="checkbox"]', $(c)).addClass('unselectable');
          }
        });
        $('> span.value', $(col)).text(deps.join(', '));
        $(c).append(col);
      }
      if(orm.isExtension)
        $(c).append($('<div class="column" />')
          .append($('<span class="label" />')
            .text('isExtension'))
          .append($('<span class="value" />')
            .text('YES')));
      $(list).append(c);
    });
  });

  // this has to come first
  pruneList();
  $('.entry > .header', $(list)).each(function() {
    if(!$(this).hasClass('missing-dependencies')) {
      $(this).hover(
        function() { 
          if($(this).parent().hasClass('installed')) return;
          $(this).css('background-color', '#ddd'); 
        },
        function() { 
          if($(this).parent().hasClass('installed')) return;
          $(this).css('background-color', '#eee'); 
        }
      );
    }
    $(this).click(function(e) {
      var c = $('span > input', $(this));
      if($(c).hasClass('unselectable')) return;
      $(c).prop('checked', $(c).prop('checked') ? false : true);
    });
  });
  adjustList();
}

function pruneList() {
  $('.unselectable').each(function() {
    $(this).attr('disabled', true);
    $(this).closest('.header').addClass('missing-dependencies');
  });
}

function adjustList() {
  $(list).css('height', ($(con).position().top - 50) + 'px');
}

function doneInstalling(name) {
  
  console.log("doneInstalling ", name);
  var id = name.replace(/\./g, '').toLowerCase(),
      entry = $('#'+id);

  console.log(id);
  $(entry)
    .removeClass('installing')
    .addClass('installed');
  var span = $('span:contains('+name+')');
  console.log(span);
  $(span).remove();
}

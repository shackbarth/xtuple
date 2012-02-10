
/** @namespace
  Exception handling for the process.
  
  @todo Complete the implementation
*/
xt.exception = xt.object.create(
  /** @lends xt.exception.prototype */ {
    
  /**
    All manageable exceptions encountered during runtime
    will be handed to this method to be dealt with properly.
    An appropriately thrown error will minimally have
    a type and a message and can have an array of arguments to
    be applied to the handler for that type.
    
    @param {Object} e The object hash returned from the exception.
    @private
  */
  handle: function(e) {
    var s = xt.exception;
    switch(e.type) {
      case xt.exception.t_warning:
      case xt.exception.t_report:
        xt.warn("Exception encountered", e);
        break;
      case xt.exception.t_close:
        var a = e.args;
        if(xt.kindOf(a[0], xt.response))
          a[0].close();
        delete e.args;
        xt.warn("Exception required closing client connection", e);
        break;
      case xt.exception.t_fatal:
        xt.err("Error encountered", e);
        s.count += 1;
        break;
      default:
        xt.err("Unrecoverable exception", e);
        xt.trucking = NO;
        break;
    }
    if(s.count > 5) throw xt.fatal("Too many errors encountered");
  },
    
  //...........................................
  // Types of Exceptions
  //

  /** @property */
  t_fatal:    'fatal',

  /** @property */
  t_warning:  'warning',

  /** @property */
  t_close:    'close',

  /** @property */
  t_report:   'report',
  
  /**
    Creates a fatal error hash from the message.

    @param {String} message The message for the exception.
    @return {Object} The exception hash.
  */
  fatal: function() {
    var m = arguments[0];
    return { type: 'fatal', message: m };
  },
  
  /**
    Creates a warning hash from the message.

    @param {String} message The message for the exception.
    @return {Object} The exception hash.
  */
  warning: function() {
    var m = arguments[0];
    return { type: 'warning', message: m };
  },
  
  /**
    Creates a close hash from the message and any additional
    arguments.

    @param {String} message The message for the exception.
    @param {Object} [args] Any arguments to be passed to the handler.
    @return {Object} The exception Hash.
  */
  close: function() {
    var a = args(),
        m = a.shift();
    return { type: 'close', message: m, args: a };
  },
  
  count: 0,
  
  /** @private */
  className: 'xt.exception'
    
}) ;

// Convenience
xt.fatal    = xt.exception.fatal;
xt.warning  = xt.exception.warning;
xt.close    = xt.exception.close;

xt.trucking = YES;

//................................................
// Need to handle specific events
// 
// When some unhandled exception is throw, not much we can
// but report it
// process.on('uncaughtException', xt.exception.handle);

/**
  Much like native throw, issue will pass an xt exception directly to the
  handler. If the exception is fatal it will cease execution of the entire
  system. If it is non-fatal, it will handle the exception and continue
  executing in the current context where it was issued.

  Note that issue is the prefered way to handle exceptions that interrupt
  responses to HTTP requests in a server.

  @see xt#exception#close

  @param {Object} exception The xt exception to issue.
  @param {Object} [response] Any active server response to be affected.
*/
issue = function() {
  var a = args();
  if(!a || a.length <= 0) return;
  xt.exception.handle(a[0]);
}

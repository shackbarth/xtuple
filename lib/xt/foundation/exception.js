
/** @namespace
  Exception handling for the process.
  
  @todo Complete the implementation
*/
XT.exception = XT.Object.create(
  /** @lends XT.exception.prototype */ {
    
  /**
    All manageable exceptions encountered during runtime
    will be handed to this method to be dealt with properly.
    An appropriately thrown error will minimally have
    a type and a message and can have an array of arguments to
    be applied to the handler for that type.
    
    @param {Object} e The object hash returned from the exception.
    @private
  */
  handle: function(err) {
    switch(err.type) {
      case XT.exception.T_WARNING:
      case XT.exception.T_REPORT:
        XT.warn("Exception encountered. ", err.message);
        break;
      case XT.exception.T_CLOSE:
        var a = err.args;
        if(XT.kindOf(a[0], XT.Response)) {
          var xtr = a[0];
          xtr.write({ 
            error: YES, 
            message: err.message 
          }).close();
        }
        delete err.args;
        XT.warn("Exception required closing client connection. ", err.message);
        break;
      case XT.exception.T_FATAL:
        XT.err("Error encountered. ", err.message);
        process.emit('SIGINT');
        break;
      default:
        XT.err("Unrecoverable exception. ", err.message, err.stack);
        process.emit('SIGINT');
        break;
    }
  },
    
  //...........................................
  // Types of Exceptions
  //

  /** @property */
  T_FATAL:    'fatal',

  /** @property */
  T_WARNING:  'warning',

  /** @property */
  T_CLOSE:    'close',

  /** @property */
  T_REPORT:   'report',
  
  /**
    Creates a fatal error hash from the message.

    @param {String} message The message for the exception.
    @return {Object} The exception hash.
  */
  fatal: function() {
    var m = arguments[0];
    console.log(require('util').inspect(arguments));
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
  className: 'XT.exception'
    
}) ;

// Convenience
XT.fatal    = XT.exception.fatal;
XT.warning  = XT.exception.warning;
XT.close    = XT.exception.close;

//................................................
// Need to handle specific events
// 
// When some unhandled exception is throw, not much we can
// but report it
process.on('uncaughtException', XT.exception.handle);

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
  XT.exception.handle(a[0]);
}

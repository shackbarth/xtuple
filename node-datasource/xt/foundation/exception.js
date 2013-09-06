/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, issue:true */

//........................................
// DEFINE GLOBAL FUNCTION
//
issue = function () {
  "use strict";
  var args = X.$A(arguments);
  if (args.length <= 0) return;
  X.exception.handle(args[0]);
};

(function () {
  "use strict";

  /**
    The exception object.

   @class
   @type X.Object
   */
  X.exception = X.Object.create(/** @lends X.exception */{

    /**
      Handles exception.

      @param {Object} err The exception to be handled. Exceptions with unknown
         type are treated as fatal exceptions.
      @param {String} err.type
      @param {String} err.message
      @param {Object} err.stack

     */
    handle: function (err) {
      var type = err.type, message = err.message, stack = err.stack;
      switch (type) {
      case X.exception.T_WARNING:
      case X.exception.T_REPORT:
        X.warn("Exception encountered. ", message);
        break;
      case X.exception.T_FATAL:
        X.err("Error encountered. ", message);
        process.emit('SIGINT');
        break;
      default:
        X.err("Unrecoverable exception. ", message, stack);
        process.emit('SIGINT');
        break;
      }
    },

    /**
      Fatal exception type. This kind of exception when handled will stop the process

      @type {String}
     */
    T_FATAL:    'fatal',

    /**
      Warning exception type.

      @type {String}
     */
    T_WARNING:  'warning',

    /**
      Report exception type. Is currently handled in the same way as a warning.

      @type {String}
     */
    T_REPORT:   'report',

    /**
      @return {Object} Fatal exception
     */
    fatal: function () {
      return { type: 'fatal', message: arguments[0] };
    },

    /**
      @return (Object} Warning exception
     */
    warning: function () {
      return { type: 'warning', message: arguments[0] };
    },

    className: "X.exception"
  });

  X.fatal    = X.exception.fatal;
  X.warning  = X.exception.warning;
  X.close    = X.exception.close;

  process.on('uncaughtException', X.exception.handle);
}());

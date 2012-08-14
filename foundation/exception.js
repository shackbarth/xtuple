/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

//........................................
// DEFINE GLOBAL FUNCTION
//
issue = function () {
  var args = X.$A(arguments);
  if (args.length <= 0) return;
  X.exception.handle(args[0]);
};

(function () {
  "use strict";

  X.exception = X.Object.create({

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
      
    T_FATAL:    'fatal',
    T_WARNING:  'warning',
    T_REPORT:   'report',

    fatal: function () {
      return { type: 'fatal', message: arguments[0] };
    },
    
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

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

//........................................
// DEFINE GLOBAL FUNCTION
//
issue = function () {
  var args = XT.$A(arguments);
  if (args.length <= 0) return;
  XT.exception.handle(args[0]);
};

(function () {
  "use strict";

  XT.exception = XT.Object.create({

    handle: function (err) {
      var type = err.type, message = err.message, stack = err.stack;
      switch (type) {
        case XT.exception.T_WARNING:
        case XT.exception.T_REPORT:
          XT.warn("Exception encountered. ", message);
          break;
        case XT.exception.T_FATAL:
          XT.err("Error encountered. ", message);
          process.emit('SIGINT');
          break;
        default:
          XT.err("Unrecoverable exception. ", message, stack);
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
    
    className: "XT.exception"
  });
  
  XT.fatal    = XT.exception.fatal;
  XT.warning  = XT.exception.warning;
  XT.close    = XT.exception.close;
  
  process.on('uncaughtException', XT.exception.handle);
}());
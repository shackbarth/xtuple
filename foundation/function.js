/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.Function = {};
  
  X.mixin(X.Function, {
    property: function (func) {
      func.isProperty = true;
      return func;
    },

    observes: function (func, event) {
      if (!func.events) func.events = [];
      func.events.push(event);
      return func;
    }
  });
}());

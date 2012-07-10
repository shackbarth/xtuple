/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  XT.Function = {};
  
  XT.mixin(XT.Function, {
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
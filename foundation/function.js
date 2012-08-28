/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  /**
  The X.Function object

  @class
  */
  X.Function = {};

  X.mixin(X.Function, /** @lends X.Function */{
    /**
      Sets the isProperty value of the function in the parameters to true.

      @param {Function} func The function
      @returns {Function} func The function from the parameters
    */
    property: function (func) {
      func.isProperty = true;
      return func;
    },

    /**
      Attaches an observer for an event onto a function.

      @param {Function} func The function
      @param {Object} event The event
      @returns {Function} func The function from the parameters
    */
    observes: function (func, event) {
      if (!func.events) func.events = [];
      func.events.push(event);
      return func;
    }
  });
}());

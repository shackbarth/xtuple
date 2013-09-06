/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, io:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    A place holder class that provides an API for models to attach to a datasource.
    The functions have no code and need to be developed for a real implementation.
  */
  XT.DataSource = {

    datasourceUrl: null,
    datasourcePort: null,
    isConnected: false,

    /*
    Returns a single record.

    @param {Object} model
    @param {String} method
    @param {Number} payload
    @param {Object} options
    */
    request: function (model, method, payload, options) {
      // Your code here
    }

  };

}());

/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
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
    Returns a record array based on a query.

    @param {Object} query
    @param {Object} options
    */
    fetch: function (options) {
      // Your code here.
    },

    /*
    Returns a single record.

    @param {String} record type
    @param {Number} id
    @param {Object} options
    */
    retrieveRecord: function (recordType, id, options) {
      // Your code here
    },

    /*
    Commit a single record.

    @param {XM.Model} model
    @param {Object} options
    */
    commitRecord: function (model, options) {
      // Your code here
    },

    /*
    Dispatch a server side function call to the datasource.

    @param {String} class name
    @param {String} function name
    @param {Object} parameters
    @param {Function} success callback
    @param {Function} error callback
    */
    /** @private */
    dispatch: function (name, func, params, options) {
      // Your code here
    }

  };

}());

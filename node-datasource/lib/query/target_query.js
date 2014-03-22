/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true,
noarg:true, regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true, moment:true */

(function () {
  'use strict';

  var Query = require('./query');

  /**
   * @constructor
   */
  function TargetQuery(query) {
    Query.call(this, query);
  }

  /**
   * @extends Query
   */
  TargetQuery.prototype = _.extend(Object.create(Query.prototype), {

    /**
     * @public
     */
    getDateFormat: function () {
      return moment.defaultFormat;
    }
  });

  module.exports = TargetQuery;
})();

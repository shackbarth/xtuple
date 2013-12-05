(function () {
  'use strict';

  var Query = require('./query');

  /**
   * @constructor
   */
  function TargetQuery (query) {
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

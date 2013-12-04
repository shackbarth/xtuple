(function () {
  'use strict';

  var Query = require('./query');

  /**
   * @constructor
   */
  function TargetQuery (template, query) {
    Query.call(this, template, query);
  }

  /**
   * @extends Query
   */
  TargetQuery.prototype = _.extend(Object.create(Query.prototype), {
    
    /**
     * @public
     */
    getDateFormat: function () {
      return 
    }
  });

  module.exports = TargetQuery;

})();

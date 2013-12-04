(function () {
  'use strict';

  /**
   * A database query structured as a javascript object.
   * @constructor Query
   */
  function Query (template, query) {
    this.query = _.clone(query);
    this.valid = _.test(template, query);
  }

  Query.prototype = Object.create({

    /**
     * Returns true if this query is valid; false otherwise.
     * @public
     */
    isValid: function () {
      return this.valid;
    }
  });

  module.exports = Query;
})();

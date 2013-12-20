(function () {
  'use strict';

  /**
   * A database query structured as a javascript object.
   * @constructor Query
   * @param {Object}
   */
  function Query (query) {
    if (!this.template) {
      return new Error('subclasses must set the template field');
    }
    this.errors = [ ];
    this.query = _.clone(query);
    this.valid = _.test(this.template, query, this.errors);
  }

  Query.prototype = Object.create({

    /**
     * Returns true if this query is valid; false otherwise.
     * @public
     */
    isValid: function () {
      return this.valid;
    },
    getErrors: function () {
      return _.unique(this.errors);
    }
  });

  module.exports = Query;
})();

(function () {
  'use strict';

  var _ = require('underscore'),
    moment = require('moment');
  _.mixin(require('congruence'));

  /**
   * A database query structured as a javascript object.
   * @constructor Query
   */
  function Query (template, query) {
    this.query = _.clone(query);
    this.errors = [ ];

    this.valid = _.test(template, query, this.errors);
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

(function () {
  'use strict';

  // @private
  // ---

  var _ = require('underscore'),
    moment = require('moment');
  _.mixin(require('congruence'));

  var dateformats = [
      'MM/DD/YY',
      'MM/DD/YYYY',
      moment.defaultFormat
    ],
    isValidDate = _.isValidDate(dateformats),
    template = {
      attributes: {
        'children: 0+': [
          // xtuple custom operators
          { EQUAL:         _.isDefined },
          { NOT_EQUAL:     _.isDefined },
          { GREATER_THAN:  _.or(_.isFinite, isValidDate) },
          { AT_LEAST:      _.or(_.isFinite, isValidDate) },
          { LESS_THAN:     _.or(_.isFinite, isValidDate) },
          { AT_MOST:       _.or(_.isFinite, isValidDate) },

          // mongodb query operators
          { $eq:  _.isDefined },                   // =
          { $ne:  _.isDefined },                   // !=
          { $gt:  _.or(_.isFinite, isValidDate) }, // >
          { $gte: _.or(_.isFinite, isValidDate) }, // >=
          { $lt:  _.or(_.isFinite, isValidDate) }, // <
          { $lte: _.or(_.isFinite, isValidDate) }, // <=
        ],
      },
      orderby: {
        'children: 0+': _.or(_.isFinite, /ASC/i, /DESC/i)
      },
      $orderby: {
        'children: 0+': _.or(_.isFinite, /ASC/i, /DESC/i)
      },
      maxresults: _.isFinite,
      pagetoken: _.isFinite,
      count: function (count) {
        return _.contains([ true, false, 1, 0], count);
      }
    };

  // @public
  // ---

  /**
   * @class RestQuery
   */
  function RestQuery (query) {
    this.errors = [ ];
    this.isValid = _.test(template, query, this.errors);
    this.query = query;
  }

  RestQuery.prototype = {

    /**
     * Convert rest query object into xt.get query object.
     * @public
     */
    toXtQuery: function () {
      console.log('isValid: '+ this.isValid);
      console.log(this.query);
    }
  };

  module.exports = RestQuery;

})();

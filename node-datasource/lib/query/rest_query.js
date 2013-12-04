(function () {
  'use strict';

  var Query = require('./query'),
    SourceQuery = require('./source_query'),
    isValidDate = _.isValidDate([
      'MM/DD/YY',
      'MM/DD/YYYY',
      moment.defaultFormat
    ]);

  /**
   * @class RestQuery
   */
  function RestQuery (query) {
    SourceQuery.call(this, RestQuery.template, query);
  }

  Object.defineProperties(RestQuery, {
    template: {
      value: {
        attributes: {
          'children: 0+': [
            // xtuple custom operators
            { EQUALS:        _.isDefined },
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
      }
    },

    /**
     * @static
     */
    isValidDate: {
      value: isValidDate
    }
  });

  /**
   * @extends SourceQuery
   */
  RestQuery.prototype = _.extend(Object.create(SourceQuery.prototype), {

    /**
     * @override
     */
    _toTarget: function (targetClass) {
      console.log('isValid: '+ this.isValid());
      console.log(this.query);
    }
  });

  module.exports = RestQuery;

})();

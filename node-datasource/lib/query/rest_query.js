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
    this.template || (this.template = RestQuery.template);
    SourceQuery.call(this, query);
  }

  Object.defineProperties(RestQuery, {

    /**
     * @static
     */
    template: {
      value: {
        '(?)attributes': {
          '(+)': _.or(
            { EQUALS:        _.isDefined },
            { MATCHES:       _.isString },
            { BEGINS_WITH:   _.isString },
            { GREATER_THAN:  _.or(_.isFinite, isValidDate) },
            { AT_LEAST:      _.or(_.isFinite, isValidDate) },
            { LESS_THAN:     _.or(_.isFinite, isValidDate) },
            { AT_MOST:       _.or(_.isFinite, isValidDate) }
          )
        },
        '(?)orderby': {
          '(+)': _.or(_.isFinite, /ASC/i, /DESC/i)
        },
        '(?)maxresults': _.isFinite,
        '(?)pagetoken': _.isFinite,
        '(?)count': function (count) {
          return _.contains([ true, false, 1, 0], count);
        },
        '(?)access_token': _.isString
      }
    },

    /**
     * @static
     */
    operators: {
      value: {
        EQUALS:       '=',
        LESS_THAN:    '<',
        AT_MOST:      '<=',
        GREATER_THAN: '>',
        AT_LEAST:     '>=',
        MATCHES:      'MATCHES',
        BEGINS_WITH:  'BEGINS_WITH'
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
    _toTarget: function (TargetQuery, options) {
      if (TargetQuery.name === 'XtGetQuery') {
        return new TargetQuery(toXtGetQuery(this.query, options));
      }
    }
  });

  /**
   * Translate this RestQuery to a XtGetQuery
   */
  function toXtGetQuery (source) {
    var target = {
      parameters: (function () {
        return _.flatten(
          _.map(source.attributes, function (clause, attr) {
            return _.map(clause, function (operand, operator) {
              return {
                attribute: attr,
                operator: RestQuery.operators[operator],
                value: operand
              };
            });
          })
        );
      })(),
      orderBy: (function () {
        return _.map(source.orderby, function (direction, attr) {
          return {
            attribute: attr,
            descending: /desc/i.test(direction)
          };
        });
      })(),
      rowOffset: (function () {
        return (+source.pagetoken || 0) * (+source.maxresults || 100);
      })(),
      rowLimit: (function () {
        return Math.max(+source.maxresults, 100);
      })()
    };
    return _.compactObject(target);
  }

  module.exports = RestQuery;
})();

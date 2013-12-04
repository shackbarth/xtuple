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
    /**
     * @static
     */
    template: {
      value: {
        '(?)attributes': {
          '(+)': _.or(
            // xtuple custom operators
            { EQUALS:        _.isDefined },
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
        }
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
        AT_LEAST:     '>='
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
      var x = toXtGetQuery(this.query);
      //console.log(x);
      return x;
      //console.log(this.query);
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
        return source.pagetoken;
      })(),
      rowLimit: (function () {
        return source.maxresults;
      })()
    };

    //console.log(source);
    //console.log(target);

    return _.compactObject(target);
  }

  module.exports = RestQuery;

})();

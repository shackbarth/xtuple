/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true,
noarg:true, regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true, moment:true */

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
  function RestQuery(query) {
    // Use keywork "query" for REST API queries. Convert to "attributes" for internal use.
    // e.g. ?query[code][BEGINS_WITH]=TOYS
    if (query.query) {
      query.attributes = query.query;
      delete query.query;
    }
    // Allow mixed case orderBy.
    if (query.orderBy) {
      query.orderby = query.orderBy;
      delete query.orderBy;
    }
    // Allow mixed case rowLimit.
    if (query.rowLimit) {
      query.rowlimit = query.rowLimit;
      delete query.rowLimit;
    }
    // Allow mixed case maxResults.
    if (query.maxResults) {
      query.maxresults = query.maxResults;
      delete query.maxResults;
    }
    // Allow mixed case pageToken.
    if (query.pageToken) {
      query.pagetoken = query.pageToken;
      delete query.pageToken;
    }

    this.template = this.template || RestQuery.template;
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
            { ANY:           _.isDefined },
            { NOT_ANY:       _.isDefined },
            { EQUALS:        _.isDefined },
            { NOT_EQUALS:    _.isDefined },
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
        '(?)rowlimit': _.isFinite,
        '(?)maxresults': _.isFinite,
        '(?)pagetoken': _.isFinite,
        '(?)count': function (count) {
          return true;
        },
        '(?)access_token': _.isString
      }
    },

    /**
     * @static
     */
    operators: {
      value: {
        ANY:          'ANY',
        NOT_ANY:      'NOT ANY',
        EQUALS:       '=',
        NOT_EQUALS:   '!=',
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
  function toXtGetQuery(source) {
    var target = {
      // coerce to boolean with our own whitelist of truthiness
      count: _.contains([true, "true", "TRUE", 1, "1"], source.count),
      // Return source.parameters when doing a FreeTextQuery or build up from attributes.
      parameters: source.parameters || _.flatten(
        _.map(source.attributes, function (clause, attr) {
          return _.map(clause, function (operand, operator) {
            return {
              attribute: attr,
              operator: RestQuery.operators[operator],
              value: operand
            };
          });
        })
      ),
      orderBy: _.map(source.orderby, function (direction, attr) {
        return {
          attribute: attr,
          descending: /desc/i.test(direction)
        };
      }),
      rowOffset: (+source.pagetoken || 0) * (+source.maxresults || 100),
      rowLimit: ((+source.maxresults || +source.rowlimit) || 100),
    };
    return _.compactObject(target);
  }

  module.exports = RestQuery;
})();

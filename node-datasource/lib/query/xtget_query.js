/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true,
noarg:true, regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true, moment:true */

(function () {
  'use strict';

  var TargetQuery = require('./target_query'),
    isValidDate = _.isValidDate([ moment.defaultFormat ]);

  /**
   * @constructor
   */
  function XtGetQuery(query) {
    this.template = this.template || XtGetQuery.template;
    TargetQuery.call(this, query);
  }

  Object.defineProperties(XtGetQuery, {

    /**
     * Query object template for xt.get()
     * @static
     */
    template: {
      value: {
        '(?)parameters': function (parameters) {
          return _.all(parameters, function (param) {
            return _.test({
              'attribute': _.isString,
              'operator': _.or(
                '=', '<', '<=', '>', '>=', 'MATCHES', 'BEGINS_WITH'
              ),
              'value': _.isDefined,
              '(?)isCharacteristic': _.isBoolean
            }, param);
          });
        },
        '(?)orderBy': function (orderby) {
          return _.all(orderby, function (param) {
            return _.test({
              'attribute': _.isString,
              '(?)descending': _.isBoolean
            }, param);
          });
        },
        '(?)rowLimit':  _.isFinite,
        '(?)rowOffset': _.isFinite,
        '(?)count': _.isBoolean
      }
    }
  });

  XtGetQuery.prototype = Object.create(TargetQuery.prototype);

  module.exports = XtGetQuery;
})();

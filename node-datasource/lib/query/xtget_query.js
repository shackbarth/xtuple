(function () {
  'use strict';

  var TargetQuery = require('./target_query'),
    isValidDate = _.isValidDate([ moment.defaultFormat ]);

  /**
   * @constructor
   */
  function XtGetQuery (query) {
    TargetQuery.call(this, XtGetQuery.template, query);
  }

  Object.defineProperties(XtGetQuery, {
    /**
     * Query object template for xt.get calls
     */
    template: {
      value: {
        '(?)parameters': function (parameters) {
          return _.all(parameters, function (param) {
            return _.test({
              'attribute': _.isString,
              'operator': _.isString,
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
        '(?)rowOffset': _.isFinite
      }
    }
  });

  /**
   * @extends Query
   */
  XtGetQuery.prototype = _.extend(Object.create(TargetQuery.prototype), {

  });

  module.exports = XtGetQuery;

})();

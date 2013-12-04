(function () {
  'use strict';

  var TargetQuery = require('./target_query'),
    isValidDate = _.isValidDate([ moment.defaultFormat ]);

  /**
   * @constructor
   */
  function XtGetQuery (template, query) {
    TargetQuery.call(this, XtGetQuery.template, query);
  }

  Object.defineProperties(XtGetQuery, {
    template: {
      value: {
        'children: 0+': _.isDefined
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


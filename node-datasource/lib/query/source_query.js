(function () {
  'use strict';

  var Query = require('./query');

  /**
   * @constructor
   */
  function SourceQuery (template, query) {
    Query.call(this, template, query);
  }

  /**
   * @extends Query
   */
  SourceQuery.prototype = _.extend(Object.create(Query.prototype), {
    
    /**
     * @private
     * @abstract
     */
    _toTarget: function () {
      throw new Error('method is abstract');
    },

    /**
     * Translate this source query to a target query of the given class.
     * @public
     * @param {Class} type of target to translate to
     */
    toTarget: function (TargetQuery) {
      var target = this._toTarget(TargetQuery);

      //console.log(targetClass.template);
      console.log(target);
      //console.log('target template: '+ JSON.stringify(targetClass.template));
      //
      //_.test(TargetQuery.template, target);
      var t = new TargetQuery(target);
      console.log(t);
      return t;
    }
  });

  module.exports = SourceQuery;
})();


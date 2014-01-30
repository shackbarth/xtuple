(function () {
  'use strict';

  /**
   * @class XM.StaticCollection
   * A collection whose values do not change.
   */
  XM.StaticCollection = Backbone.Collection.extend({ }, {
    _disabled: [ 'sync', 'fetch', 'trigger', 'shift', 'pop', 'set', 'slice' ],
    _noop: function (f) {
      return function () {
        console.warn('function [' + f + '] disabled on XM.StaticCollection');
      };
    }
  });
  XM.StaticCollection = XM.StaticCollection.extend(
    _.object(XM.StaticCollection._disabled, _.map(
      _.range(XM.StaticCollection._disabled.length),
      XM.StaticCollection._noop
    ))
  );

  /**
   * @class XM.StaticModel
   */
  XM.StaticModel = Backbone.Model.extend(/** @lends XM.StaticModel# */{
    idAttribute: 'key',

    /**
     * TODO xyz #document and possibly #refactor
     * don't remember why this was necessary, but it looks like a hack -tjw
     */
    getStatus: function () {
      return XM.Model.READY_CLEAN;
    },

    /**
     * TODO #document and possibly #refactor @see xyz
     */
    getStatusString: function () {
      return "READY_CLEAN";
    },

    getValue: function (attr) {
      return this.get(attr);
    },

    /**
     * @override
     * Auto-generate labels for enum values
     */
    parse: function (data, options) {
      return {
        key: data.key,
        value: data.value,
        label: ('_' + data.value.toLowerCase().camelize()).loc()
      };
    }
  });

  /**
   * @class XM.EnumMapCollection
   * @extends XM.StaticCollection
   * Convenience class for wrapping an enum in a Backbone Collection
   */
  XM.EnumMapCollection = XM.StaticCollection.extend({
    model: XM.StaticModel,
    constructor: function (attrs, options) {
      Backbone.Collection.call(this, attrs, _.extend({ parse: true }, options));
    },
    parse: function (data) {
      return _.map(data, function (value, key) {
        return { value: value, key: key };
      });
    }
  });

})();

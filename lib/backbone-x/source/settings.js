/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
    @name XM.Settings
    @extends XM.Model
  */
  XM.Settings = XM.Model.extend(/** @lends XM.Settings# */{

    autoFetchId: false,

    parse: function (resp) {
      return resp;
    },

    /**
      Reimplemented to change the signature of the success method
      which is slightly different.
    */
    fetch: function (options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;

      var success = options.success,
        model = this;

      options.success = function (resp, options) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
      };
      return this.sync('read', this, options);
    },


    save: function (key, value, options) {
      options = options ? _.clone(options) : {};
      var that = this,
        success;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        options = value ? _.clone(value) : {};
      } else {
        options = options ? _.clone(options) : {};
      }
      success = options.success;

      options.success = function (resp) {
        XT.session.settings.set(that.attributes);
        if (success) { success(that, resp, options); }
      };

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) { value = options; }
      return XM.Model.prototype.save.call(this, key, value, options);
    },

    /**
      Reimplemented to discard `dataState`.

      @param {Number} Status
    */
    setStatus: function (status, options) {
      XM.Model.prototype.setStatus.apply(this, arguments);
      delete this.attributes.dataState;
    },

    /**
      Reimplemented to invoke `settings` and `commitSettings` functions.
    */
    sync: function (method, model, options) {
      options = options ? _.clone(options) : {};
      var that = this,
        recordType = this.recordType,
        result,
        error = options.error;

      options.error = function (resp) {
        var K = XM.Model;
        that.setStatus(K.ERROR);
        if (error) { error(model, resp, options); }
      };

      // Read
      if (method === 'read' && recordType && options.success) {
        result = this.dispatch(this.recordType, 'settings', this.recordType, options);

      // Write
      } else if (method === 'update') {
        result = this.dispatch(this.recordType, 'commitSettings', this.changeSet(), options);
      }
      return result || false;
    },

    validate: function () {
      return undefined;
    }

  });

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.Settings, /** @lends XM.Settings# */{
    /**
      Reimplemented to always return false.

      @returns {Boolean}
    */
    canCreate: function () {
      return false;
    },

    /**
      Reimplemented to always return false.

      @returns {Boolean}
    */
    canDelete: function () {
      return false;
    },

    /**
      Reimplemented to always return false.

      @returns {Boolean}
    */
    canRead: function () {
      return XM.Settings.canUpdate.call(this);
    },

    /**
      Reimplemented.

      @returns {Boolean}
    */
    canUpdate: function () {
      return XT.session.privileges.get(this.prototype.privileges);
    }

  });


}());

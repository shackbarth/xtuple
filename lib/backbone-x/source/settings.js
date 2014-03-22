/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class
    @name XM.Settings
    @extends XM.Model
  */
  XM.Settings = XM.Model.extend(/** @lends XM.Settings# */ {
    recordType: 'XM.Settings',
    autoFetchId: false,

    /**
     * @override
     */
    fetch: function (_options) {
      var options = _.extend({ }, _options),
        userCallback = options.success,

        //Handle a dispatch response as a Backbone sync response.
        done = function (model, resp, options) {
          model.set(resp, options);
          model.setStatus(XM.Model.READY_CLEAN, options);

          if (_.isFunction(userCallback)) {
            userCallback(model, resp, options);
          }
        },
        fetchOptions = this._fetchHelper(_.extend(options, {
          success: done
        }));

      return fetchOptions && this.sync('read', this, fetchOptions);
    },

    /**
      Practically identical to the backbone method, but we have to change
      the signature of the success function. This is unfortunate.
      XXX decompose using same strategy as the late prototypeFetch function
     */
    prototypeSave: function (key, val, options) {
      var that = this,
        attributes = this.attributes,
        attrs, success, method, xhr;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key === null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
      if (attrs && (!options || !options.wait) && !this.set(attrs, options)) {
        return false;
      }

      options = _.extend({validate: true}, options);

      // Do not persist invalid models.
      if (!this._validate(attrs, options)) {
        return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) {
        options.parse = true;
      }
      success = options.success;
      options.success = function (resp, options) {
        var model = that;
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) {
          serverAttrs = _.extend(attrs || {}, serverAttrs);
        }
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) {
          success(model, resp, options);
        }
      };

      // Finish configuring and sending the Ajax request.
      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') {
        options.attrs = attrs;
      }
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) {
        this.attributes = attributes;
      }

      return xhr;
    },

    /**
      Does the usual stuff and also updates the local settings. Also passes
      in our prototype save function.
     */
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

      options.prototypeSave = this.prototypeSave;

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
        result = this.dispatch(this.dispatchRecordType || this.recordType,
          this.dispatchFetchFunction || 'settings',
          this.dispatchRecordType || this.recordType,
          options);

      // Write
      } else if (method === 'update') {
        result = this.dispatch(this.dispatchRecordType || this.recordType,
          this.dispatchCommitFunction || 'commitSettings',
          [this.generatePatches()],
          options);
      }
      return result || false;
    },

    validate: function () {
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

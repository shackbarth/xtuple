// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class `XM.Model` is an abstract class designed to operate with `XT.DataSource`.
    It should be subclassed for any specific implementation. Subclasses should
    include a `recordType` the data source will use to retrieve the record.

    To create a new model include `isNew` in the options:
    <pre><code>
      // Create a new class
      XM.MyModel = XM.Model.extend({
        recordType: 'XM.MyModel'
      });

      // Instantiate a new model object
      m = new XM.MyModel(null, {isNew: true});
   </code></pre>
    To load an existing record include an id in the attributes:
    <pre><code>
      m = new XM.MyModel({id: 1});
      m.fetch();
    </code></pre>

    @name XM.Model
    @description To create a new model include `isNew` in the options:
    @param {Object} Attributes
    @param {Object} Options
    @extends Backbone.RelationalModel
  */
  XM.SimpleModel = Backbone.Model.extend(/** @lends XM.Model# */{

    /**
      Set to true if you want an id fetched from the server when the `isNew` option
      is passed on a new model.

      @type {Boolean}
    */
    autoFetchId: true,

    /**
      Differentiates models that belong to postbooks instances versus models
      that belong to the global database
    */
    databaseType: 'instance',

    /**
      The last error message reported.
    */
    lastError: null,

    /**
      Specify the name of a data source model here.

      @type {String}
    */
    recordType: null,

    /**
      Model's status. You should never modify this directly.

      @seealso `getStatus`
      @seealse `setStatus`
      @type {Number}
      @default `EMPTY`
    */
    status: null,

    // ..........................................................
    // METHODS
    //

    /**
      Returns only attribute records that have changed.

      @type Hash
    */
    changeSet: function () {
      var attributes = this.toJSON();

      // recursive function that does the work
      var changedOnly = function (attrs) {
        var ret = null,
          i,
          prop,
          val;
        if (attrs && attrs.dataState !== 'read') {
          ret = {};
          for (prop in attrs) {
            if (attrs[prop] instanceof Array) {
              ret[prop] = [];
              // loop through array and only include dirty items
              for (i = 0; i < attrs[prop].length; i++) {
                val = changedOnly(attrs[prop][i]);
                if (val) {ret[prop].push(val); }
              }
            } else {
              ret[prop] = attrs[prop];
            }
          }
        }
        return ret;
      };

      // do the work
      return changedOnly(attributes);
    },

    /**
      Update the status if applicable.
    */
    didChange: function (model, options) {
      model = model || {};
      options = options || {};
      var K = XM.Model,
        status = this.getStatus();
      if (options.force) { return; }

      // Mark dirty if we should
      if (status === K.READY_CLEAN) {
        this.setStatus(K.READY_DIRTY);
      }
    },

    /**
      Called after confirmation that the model was destroyed on the
      data source.
    */
    didDestroy: function () {
      var K = XM.Model;
      this.setStatus(K.DESTROYED_CLEAN);
      this.clear({silent: true});
    },

    /**
      Handle a `sync` response that was an error.
    */
    didError: function (model, resp) {
      model = model || {};
      this.lastError = resp;
      XT.log(resp);
    },

    /**
      Reimplemented to handle state change and parent child relationships. Calling
      `destroy` on a parent will cause the model to commit to the server
      immediately. Calling destroy on a child relation will simply mark it for
      deletion on the next save of the parent.

      @returns {XT.Request|Boolean}
    */
    destroy: function (options) {
      var result,
        K = XM.Model;

      this._wasNew = this.isNew(); // Hack so prototype call will still work
      this.setStatus(K.BUSY_DESTROYING);
      options.wait = true;
      result = Backbone.Model.prototype.destroy.call(this, options);
      delete this._wasNew;
      return result;
    },

    /*
      Forward a dispatch request to the data source. Runs a "dispatchable" database function.
      Include a `success` callback function in options to handle the result.

      @param {String} Name of the class
      @param {String} Function name
      @param {Object} Parameters
      @param {Object} Options
    */
    dispatch: function (name, func, params, options) {
      options = options ? _.clone(options) : {};
      if (!options.databaseType) { options.databaseType = this.databaseType; }
      var dataSource = options.dataSource || XT.dataSource;
      return dataSource.dispatch(name, func, params, options);
    },

    /*
      Reimplemented to handle status changes.

      @param {Object} Options
      @returns {XT.Request} Request
    */
    fetch: function (options) {
      options = options ? _.clone(options) : {};
      var model = this,
        K = XM.Model,
        success = options.success;

      this.setStatus(K.BUSY_FETCHING);
      options.success = function (resp) {
        model.setStatus(K.READY_CLEAN, options);
        if (XT.debugging) {
          XT.log('Fetch successful');
        }
        if (success) { success(model, resp, options); }
      };
      return Backbone.Model.prototype.fetch.call(this, options);
    },

    /**
      Set the id on this record an id from the server. Including the `cascade`
      option will call ids to be fetched recursively for `HasMany` relations.

      @returns {XT.Request} Request
    */
    fetchId: function (options) {
      options = _.defaults(options ? _.clone(options) : {}, {force: true});
      var that = this;
      if (!this.id) {
        options.success = function (resp) {
          options.force = true;
          that.set(that.idAttribute, resp, options);
        };
        this.dispatch('XM.Model', 'fetchId', this.recordType, options);
      }
    },

    /**
      Return the current status.

      @returns {Number}
    */
    getStatus: function () {
      return this.status;
    },

    /**
      Return the current status as as string.

      @returns {String}
    */
    getStatusString: function () {
      var ret = [],
        status = this.getStatus(),
        prop;
      for (prop in XM.Model) {
        if (XM.Model.hasOwnProperty(prop)) {
          if (prop.match(/[A-Z_]$/) && XM.Model[prop] === status) {
            ret.push(prop);
          }
        }
      }
      return ret.join(" ");
    },

    /**
      Called when model is instantiated.
    */
    initialize: function (attributes, options) {
      attributes = attributes || {};
      options = options || {};
      var K = XM.Model,
        status = this.getStatus();

      // Validate
      if (_.isEmpty(this.recordType)) { throw 'No record type defined'; }
      if (status !== K.EMPTY) {
        throw 'Model may only be intialized from a status of EMPTY.';
      }

      // Handle options
      if (options.isNew) {
        this.setStatus(K.READY_NEW);
        if (this.autoFetchId) { this.fetchId(); }
      } else if (options.force) {
        this.setStatus(K.READY_CLEAN);
      }

      // Bind events
      this.on('change', this.didChange);
      this.on('error', this.didError);
      this.on('destroy', this.didDestroy);
    },

    /**
      Reimplemented. A model is new if the status is `READY_NEW`.

      @returns {Boolean}
    */
    isNew: function () {
      var K = XM.Model;
      return this.getStatus() === K.READY_NEW || this._wasNew || false;
    },

    /**
      Returns true if status is `READY_NEW` or `READY_DIRTY`.

      @returns {Boolean}
    */
    isDirty: function () {
      var status = this.getStatus(),
        K = XM.Model;
      return status === K.READY_NEW || status === K.READY_DIRTY;
    },

    /**
      Revert the model to the previous status. Useful for reseting status
      after a failed validation.

      param {Boolean} - cascade
    */
    revertStatus: function (cascade) {
      var K = XM.Model,
        prev = this._prevStatus;
      this.setStatus(this._prevStatus || K.EMPTY);
      this._prevStatus = prev;
    },

    /**
      Reimplemented.

      @retuns {XT.Request} Request
    */
    save: function (key, value, options) {
      options = options ? _.clone(options) : {};
      var attrs = {},
        model = this,
        K = XM.Model,
        success,
        result;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        attrs = key;
        options = value ? _.clone(value) : {};
      } else if (_.isString(key)) {
        attrs[key] = value;
      }

      // Only save if we should.
      if (this.isDirty() || attrs) {
        success = options.success;
        options.wait = true;
        options.validateSave = true;
        options.success = function (resp) {
          model.setStatus(K.READY_CLEAN, options);
          if (XT.debugging) {
            XT.log('Save successful');
          }
          if (success) { success(model, resp, options); }
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) { value = options; }

        // Call the super version
        this.setStatus(K.BUSY_COMMITTING);
        result = Backbone.Model.prototype.save.call(this, key, value, options);
        if (!result) { this.revertStatus(true); }
        return result;
      }

      XT.log('No changes to save');
      return false;
    },

    /**
      Set the status on the model. Triggers `statusChange` event. Option set to
      `cascade` will propagate status recursively to all HasMany children.

      @param {Number} Status
    */
    setStatus: function (status, options) {
      var K = XM.Model,
        setOptions = { force: true };

      // Prevent recursion
      this._prevStatus = this.status;
      this.status = status;

      // Update data state at this level.
      if (status === K.READY_NEW) {
        this.set('dataState', 'create', setOptions);
      } else if (status === K.READY_CLEAN) {
        this.set('dataState', 'read', setOptions);
      } else if (status === K.READY_DIRTY) {
        this.set('dataState', 'update', setOptions);
      } else if (status === K.DESTROYED_DIRTY) {
        this.set('dataState', 'delete', setOptions);
      }

      this.trigger('statusChange', this, status, options);
      //XT.log(this.recordType + ' id: ' +  this.id +
      //         ' changed to ' + this.getStatusString());
      return this;
    },

    /**
      Sync to xTuple data source.
    */
    sync: function (method, model, options) {
      options = options ? _.clone(options) : {};
      if (!options.databaseType) { options.databaseType = this.databaseType; }
      var that = this,
        dataSource = options.dataSource || XT.dataSource,
        id = options.id || model.id,
        recordType = this.recordType,
        result,
        error = options.error;

      options.error = function (resp) {
        var K = XM.Model;
        that.setStatus(K.ERROR);
        if (error) { error(model, resp, options); }
      };

      // Read
      if (method === 'read' && recordType && id && options.success) {
        result = dataSource.retrieveRecord(recordType, id, options);

      // Write
      } else if (method === 'create' || method === 'update' || method === 'delete') {
        result = dataSource.commitRecord(model, options);
      }

      return result || false;
    }

  });

  XM.SimpleModel = XM.SimpleModel.extend({status: XM.Model.EMPTY});

}());

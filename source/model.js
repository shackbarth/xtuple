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
  XM.Model = Backbone.RelationalModel.extend(/** @lends XM.Model# */{

    /**
      Set to true if you want an id fetched from the server when the `isNew` option
      is passed on a new model.

      @type {Boolean}
    */
    autoFetchId: true,

    /**
      Are there any binary fields that we might need to worry about transforming?
      see issue 18661
    */
    binaryField: null,

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
      A hash of attributes originally fetched from the server.
    */
    prime: null,

    /**
      A hash structure that defines data access.

      @type {Hash}
    */
    privileges: null,

    /**
      Indicates whether the model is read only.

      @type {Boolean}
    */
    readOnly: false,

    /**
      An array of attribute names designating attributes that are not editable.
      Use `setReadOnly` to edit this array.

      @seealso `setReadOnly`
      @seealso `isReadOnly`
      @type {Array}
    */
    readOnlyAttributes: null,

    /**
      The attribute that is the display name for the model in any case that we
      want to show just the most obvious field for the user.

      @type {String}
    */
    nameAttribute: "name",

    /**
      Specify the name of a data source model here.

      @type {String}
    */
    recordType: null,

    /**
      An array of required attributes. A `validate` will fail until all the required
      attributes have values.

      @type {Array}
    */
    requiredAttributes: null,

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
      Returns whether the current record can be updated based on privilege
      settings.

      @returns {Boolean}
    */
    canUpdate: function () {
      return this.getClass().canUpdate(this);
    },

    /**
      Returns whether the current record can be deleted based on privilege
      settings.

      @returns {Boolean}
    */
    canDelete: function () {
      return this.getClass().canDelete(this);
    },

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
      When any attributes change, store the original value(s) in `prime`
      and update the status if applicable.
    */
    didChange: function (model, options) {
      model = model || {};
      options = options || {};
      var K = XM.Model,
        status = this.getStatus(),
        attr;
      if (options.force) { return; }

      // Update `prime` with original attributes for tracking
      if (status & K.READY) {
        for (attr in this.changed) {
          if (this.changed.hasOwnProperty(attr) &&
              this.prime[attr] === undefined) {
            this.prime[attr] = this.previous(attr);
          }
        }
      }

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
      Return whether the model is in a valid state to `save`.

      @returns {Boolean}
    */
    isValid: function () {
      var options = {validateSave: true};
      return !this.validate || !this.validate(this.attributes, options);
    },

    /**
      Return the original value of an attribute the last time fetch was called.

      @returns {Object}
    */
    original: function (attr) {
      var parts,
        value,
        i;
      // Search path
      if (attr.indexOf('.') !== -1) {
        parts = attr.split('.');
        value = this;
        for (i = 0; i < parts.length; i++) {
          value = value.original(parts[i]);
          if (value && value instanceof Date) {
            break;
          } else if (value && typeof value === "object") {
            continue;
          } else if (typeof value === "string") {
            break;
          } else {
            value = "";
            break;
          }
        }
        return value;
      }
      return this.prime[attr] || this.get(attr);
    },

    /**
      Return all the original values of the attributes the last time fetch was called.

      @returns {Array}
    */
    originalAttributes: function () {
      return _.defaults(_.clone(this.prime), _.clone(this.attributes));
    },

    /**
      Reimplemented to handle state change and parent child relationships. Calling
      `destroy` on a parent will cause the model to commit to the server
      immediately. Calling destroy on a child relation will simply mark it for
      deletion on the next save of the parent.

      @returns {XT.Request|Boolean}
    */
    destroy: function (options) {
      options = options ? _.clone(options) : {};
      var klass = this.getClass(),
        canDelete = klass.canDelete(this),
        success = options.success,
        model = this,
        result,
        K = XM.Model,
        parent = this.getParent(true),
        children = [],
        findChildren = function (model) {
          _.each(model.relations, function (relation) {
            var i, attr = model.attributes[relation.key];
            if (attr && attr.models &&
                relation.type === Backbone.HasMany) {
              for (i = 0; i < attr.models.length; i += 1) {
                findChildren(attr.models[i]);
              }
              children = _.union(children, attr.models);
            }
          });
        };
      if ((parent && parent.canUpdate(this)) ||
          (!parent && canDelete)) {
        this._wasNew = this.isNew(); // Hack so prototype call will still work
        this.setStatus(K.DESTROYED_DIRTY, {cascade: true});

        // If it's top level commit to the server now.
        if (!parent && canDelete) {
          findChildren(this); // Lord Vader ... rise
          this.setStatus(K.BUSY_DESTROYING, {cascade: true});
          options.wait = true;
          options.success = function (resp) {
            var i;
            // Do not hesitate, show no mercy!
            for (i = 0; i < children.length; i += 1) {
              children[i].didDestroy();
            }
            if (XT.debugging) {
              XT.log('Destroy successful');
            }
            if (success) { success(model, resp, options); }
          };
          result = Backbone.Model.prototype.destroy.call(this, options);
          delete this._wasNew;
          return result;

        }

        // Otherwise just marked for deletion.
        return true;
      }
      XT.log('Insufficient privileges to destroy');
      return false;
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
        success = options.success,
        klass = this.getClass();

      if (klass.canRead()) {
        this.setStatus(K.BUSY_FETCHING, {cascade: true});
        options.cascade = true; // Update status of children
        options.success = function (resp) {
          model.setStatus(K.READY_CLEAN, options);
          if (XT.debugging) {
            XT.log('Fetch successful');
          }
          if (success) { success(model, resp, options); }
        };
        return Backbone.Model.prototype.fetch.call(this, options);
      }
      XT.log('Insufficient privileges to fetch');
      return false;
    },

    /**
      Set the id on this record an id from the server. Including the `cascade`
      option will call ids to be fetched recursively for `HasMany` relations.

      @returns {XT.Request} Request
    */
    fetchId: function (options) {
      options = _.defaults(options ? _.clone(options) : {}, {force: true});
      var that = this, attr;
      if (!this.id) {
        options.success = function (resp) {
          options.force = true;
          that.set(that.idAttribute, resp, options);
        };
        this.dispatch('XM.Model', 'fetchId', this.recordType, options);
      }

      // Cascade through `HasMany` relations if specified.
      if (options && options.cascade) {
        _.each(this.relations, function (relation) {
          attr = that.attributes[relation.key];
          if (attr) {
            if (relation.type === Backbone.HasMany) {
              if (attr.models) {
                _.each(attr.models, function (model) {
                  if (model.fetchId) { model.fetchId(options); }
                });
              }
            }
          }
        });
      }
    },

    /**
     * Retrieve related objects.
     * @param {String} key The relation key to fetch models for.
     * @param {Object} options Options for 'Backbone.Model.fetch' and 'Backbone.sync'.
     * @param {Boolean} update  Whether to force a fetch from the server (updating existing models).
     * @returns {Array} An array of request objects.
     */
    fetchRelated: function (key, options, update) {
      options = options || {};
      var requests = [],
        status = this.getStatus(),
        K = XM.Model,
        rel = this.getRelation(key),
        keyContents = rel && rel.keyContents,
        toFetch = keyContents && _.filter(_.isArray(keyContents) ?
          keyContents : [keyContents], function (item) {
            var id = Backbone.Relational.store.resolveIdForItem(rel.relatedModel, item);
            return id && (update || !Backbone.Relational.store.find(rel.relatedModel, id));
          }, this);

      if (toFetch && toFetch.length) {
        if (options.max && toFetch.length > options.max) {
          toFetch.length = options.max;
        }

        // Create a model for each entry in 'keyContents' that is to be fetched
        var models = _.map(toFetch, function (item) {
          var model;

          if (_.isObject(item)) {
            model = rel.relatedModel.build(item);
          }
          else {
            var attrs = {};
            attrs[rel.relatedModel.prototype.idAttribute] = item;
            model = rel.relatedModel.build(attrs);
          }

          return model;
        }, this);

        requests = _.map(models, function (model) {
          var opts = _.defaults(
            {
              error: function () {
                model.trigger('destroy', model, model.collection, options);
                if (options.error) { options.error.apply(model, arguments); }
              }
            },
            options
          );
          // Context option means server will check privilege access of the parent
          // and the existence of relation on the parent to determine whether user
          // can see this record instead of usual privilege check on the model.
          if (status === K.READY_CLEAN || status === K.READY_DIRTY) {
            opts.context = {
              recordType: this.recordType,
              value: this.id,
              relation: key
            };
          }
          return model.fetch(opts);
        }, this);
      }

      return requests;
    },

    /**
      Return a matching record id for a passed user `key` and `value`. If none
      found, returns zero.

      @param {String} Property to search on, typically a user key
      @param {String} Value to search for
      @param {Object} Options
      @returns {Object} Receiver
    */
    findExisting: function (key, value, options) {
      options = options || {};
      options.databaseType = options.databaseType || this.databaseType;
      return this.getClass().findExisting.call(this, key, value, options);
    },

    /**
      Valid attribute names that can be used on this model based on the
      data source definition, whether or not they already exist yet on the
      current instance.

      @returns {Array}
    */
    getAttributeNames: function () {
      return this.getClass().getAttributeNames.call(this);
    },

    /**
      Returns the current model prototype class.

      @returns {XM.Model}
    */
    getClass: function () {
      return Backbone.Relational.store.getObjectByName(this.recordType);
    },

    /**
      Return the parent model if one exists. If the `getRoot` parameter is
      passed, it will return the top level parent of the model hierarchy.

      @param {Boolean} Get Root
      @returns {XM.Model}
    */
    getParent: function (getRoot) {
      var parent,
        root,
        relation = _.find(this.relations, function (rel) {
          if (rel.reverseRelation && rel.isAutoRelation) {
            return true;
          }
        });
      parent = relation && relation.key ? this.get(relation.key) : false;
      if (parent && getRoot) {
        root = parent.getParent(getRoot);
      }
      return root || parent;
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
      Searches attributes first, if not found then returns either a function call
      or property value that matches the key. It supports search on an attribute path
      through a model hierarchy.
      @param {String} Key
      @returns {Any}
      @example
      // Returns the first name attribute from primary contact model.
      var firstName = m.getValue('primaryContact.firstName');
    */
    getValue: function (key) {
      var parts,
        value,
        i;

      // Search path
      if (key.indexOf('.') !== -1) {
        parts = key.split('.');
        value = this;
        for (i = 0; i < parts.length; i++) {
          value = value.getValue(parts[i]);
          if (value && value instanceof Date) {
            break;
          } else if (value && typeof value === "object") {
            continue;
          } else if (typeof value === "string" ||
                     typeof value === "number") {
            break;
          } else {
            value = "";
            break;
          }
        }
        return value;
      }

      // Search attribute, function, propety
      if (_.has(this.attributes, key)) { return this.attributes[key]; }
      return _.isFunction(this[key]) ? this[key]() : this[key];
    },

    /**
      Called when model is instantiated.
    */
    initialize: function (attributes, options) {
      attributes = attributes || {};
      options = options || {};
      var klass,
        K = XM.Model,
        status = this.getStatus(),
        relations = this.relations || [],
        i;

      // Validate
      if (_.isEmpty(this.recordType)) { throw 'No record type defined'; }
      if (status !== K.EMPTY) {
        throw 'Model may only be intialized from a status of EMPTY.';
      }

      // Set defaults if not provided
      this.prime = {};
      this.privileges = this.privileges || {};
      this.readOnlyAttributes = this.readOnlyAttributes ?
        this.readOnlyAttributes.slice(0) : [];
      this.requiredAttributes = this.requiredAttributes ?
        this.requiredAttributes.slice(0) : [];

      // Handle options
      if (options.isNew) {
        klass = this.getClass();
        if (!klass.canCreate()) {
          throw 'Insufficent privileges to create a record.';
        }
        this.setStatus(K.READY_NEW, {cascade: true});
        if (this.autoFetchId) { this.fetchId({cascade: true}); }
      } else if (options.force) {
        this.setStatus(K.READY_CLEAN);
      }

      // Set attributes that should be required and read only
      if (this.idAttribute) { this.setReadOnly(this.idAttribute); }
      if (this.idAttribute &&
          !_.contains(this.requiredAttributes, this.idAttribute)) {
        this.requiredAttributes.push(this.idAttribute);
      }
      this.setReadOnly('type');

      // Bind events
      this.on('change', this.didChange);
      this.on('error', this.didError);
      this.on('destroy', this.didDestroy);
      for (i = 0; i < relations.length; i++) {
        if (relations[i].type === Backbone.HasMany &&
            relations[i].includeInJSON === true) {
          this.on('add:' + relations[i].key, this.didChange);
        }
      }
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
      Return whether the model is in a read-only state. If an attribute name or
      object is passed, returns whether those attributes are read-only.

      @seealso `setReadOnly`
      @seealso `readOnly`
      @param {String|Object} attribute(s)
      @returns {Boolean}
    */
    isReadOnly: function (value) {
      var attr, result;
      if ((!_.isString(value) && !_.isObject(value)) || this.readOnly) {
        result = this.readOnly;
      } else if (_.isObject(value)) {
        for (attr in value) {
          if (value.hasOwnProperty(attr)) {
            if (_.contains(this.readOnlyAttributes, attr)) { result = true; }
          }
        }
        result = false;
      } else {
        result = _.contains(this.readOnlyAttributes, value);
      }
      return result;
    },

    /**
      Return whether an attribute is required.

      @param {String} attribute
      @returns {Boolean}
    */
    isRequired: function (value) {
      return _.contains(this.requiredAttributes, value);
    },

    /**
      A utility function that triggers an `notify` event. Useful for passing along
      non-critical information to the interface. Bind to `notify` to use.

        var m = new XM.MyModel();
        var raiseAlert = function (model, value, options) {
          alert(value);
        }
        m.on('notify', raiseAlert);

      @param {String} Message
      @param {Object} Options
    */
    notify: function (message, options) {
      this.trigger('notify', this, message, options);
    },

    /**
      Recursively checks the object against the schema and converts date strings to
      date objects.

      @param {Object} Response
    */
    parse: function (resp) {
      var K = XT.Session,
        column,
        parse,
        parseIter = function (iter) {
          iter = parse(iter);
        },
        getColumn = function (type, attr) {
          if (!XT.session.getSchema().get(type)) {
            XT.log(type + " not found in schema. Error imminent!");
          }
          var columns = XT.session.getSchema().get(type).columns;
          return _.find(columns, function (column) {
            return column.name === attr;
          });
        };
      parse = function (obj) {
        var attr;
        for (attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            if (_.isArray(obj[attr])) {
              _.each(obj[attr], parseIter);
            } else if (attr === 'lock') {
              // don't try to parse the lock object
              //obj[attr] = parse(obj[attr]);
            } else if (_.isObject(obj[attr])) {
              obj[attr] = parse(obj[attr]);
            } else {
              column = getColumn(obj.type, attr);
              if (column && column.category &&
                  column.category === K.DB_DATE &&
                  obj[attr] !== null) {
                obj[attr] = new Date(obj[attr]);
              }
            }
          }
        }
        return obj;
      };
      return parse(resp);
    },

    /**
      Revert the model to the previous status. Useful for reseting status
      after a failed validation.

      param {Boolean} - cascade
    */
    revertStatus: function (cascade) {
      var K = XM.Model,
        prev = this._prevStatus,
        that = this,
        attr;
      this.setStatus(this._prevStatus || K.EMPTY);
      this._prevStatus = prev;

      // Cascade changes through relations if specified
      if (cascade) {
        _.each(this.relations, function (relation) {
          attr = that.attributes[relation.key];
          if (attr && attr.models &&
              relation.type === Backbone.HasMany) {
            _.each(attr.models, function (model) {
              if (model.revertStatus) {
                model.revertStatus(cascade);
              }
            });
          }
        });
      }
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

      // Can't save unless root
      if (this.getParent()) {
        XT.log('You must save on the root level model of this relation');
        return false;
      }

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
        options.cascade = true; // Cascade status to children
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
        this.setStatus(K.BUSY_COMMITTING, {cascade: true});
        result = Backbone.Model.prototype.save.call(this, key, value, options);
        if (!result) { this.revertStatus(true); }
        return result;
      }

      XT.log('No changes to save');
      return false;
    },

    /**
      Set the entire model, or a specific model attribute to `readOnly`.<br />
      Examples:<pre><code>
      m.setReadOnly() // sets model to read only
      m.setReadOnly(false) // sets model to be editable
      m.setReadOnly('name') // sets 'name' attribute to read-only
      m.setReadOnly('name', false) // sets 'name' attribute to be editable</code></pre>

      Note: Privilege enforcement supercedes read-only settings.

      @seealso `isReadOnly`
      @seealso `readOnly`
      @param {String|Boolean} Attribute to set, or boolean if setting the model
      @param {Boolean} Boolean - default = true.
    */
    setReadOnly: function (key, value) {
      var changes = {},
        delta;
      // handle attribute
      if (_.isString(key)) {
        value = _.isBoolean(value) ? value : true;
        if (value && !_.contains(this.readOnlyAttributes, key)) {
          this.readOnlyAttributes.push(key);
          changes[key] = true;
        } else if (!value && _.contains(this.readOnlyAttributes, key)) {
          this.readOnlyAttributes = _.without(this.readOnlyAttributes, key);
          changes[key] = true;
        }
      // handle model
      } else {
        key = _.isBoolean(key) ? key : true;
        this.readOnly = key;
        // Attributes that were already read-only will stay that way
        // so only count the attributes that were not affected
        delta = _.difference(this.getAttributeNames(), this.readOnlyAttributes);
        _.each(delta, function (attr) {
          changes[attr] = true;
        });
      }
      // Notify changes
      if (!_.isEmpty(changes)) {
        this.trigger('readOnlyChange', this, {changes: changes, isReadOnly: value});
      }
      return this;
    },

    /**
      Set the status on the model. Triggers `statusChange` event. Option set to
      `cascade` will propagate status recursively to all HasMany children.

      @param {Number} Status
    */
    setStatus: function (status, options) {
      var K = XM.Model,
        attr,
        that = this,
        parent,
        setOptions = { force: true };

      // Prevent recursion
      if (this.isLocked() || this.status === status) { return; }
      this.acquire();
      this._prevStatus = this.status;
      this.status = status;
      parent = this.getParent();

      // Reset original attributes if applicable
      if (status === K.READY_NEW || status === K.READY_CLEAN) {
        this.prime = {};
      }

      // Cascade changes through relations if specified
      if (options && options.cascade) {
        _.each(this.relations, function (relation) {
          attr = that.attributes[relation.key];
          if (attr && attr.models &&
              relation.type === Backbone.HasMany) {
            _.each(attr.models, function (model) {
              if (model.setStatus) {
                model.setStatus(status, options);
              }
            });
          }
        });
      }

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

      // Percolate changes up to parent when applicable
      if (parent && (this.isDirty() ||
          status === K.DESTROYED_DIRTY)) {
        parent.trigger('change', parent, options);
      }
      this.release();
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
    },

    /**
      Determine whether this record has been referenced by another. By default
      this function inspects foreign key relationships on the database, and is
      therefore dependent on foreign key relationships existing where appropriate
      to work correctly.

      @param {Object} Options
      @returns {XT.Request} Request
    */
    used: function (options) {
      options.databaseType = this.databaseType;
      return this.getClass().used(this.id, options);
    },

    /**
      Default validation checks `attributes` for:<br />
        &#42; Data type integrity.<br />
        &#42; Required fields when `validateSave=true` option is passed.<br />
        &#42; Read Only and Privileges (when editing).<br />
      <br />
      Returns `undefined` if the validation succeeded, or some value, usually
      an error message, if it fails.<br />
      <br />
      Use the `force` option to ignore validation. This is useful when
      higher level function calls passing through `set` need to skip
      validation to work properly.<br />
      <br />
      It is recommended customizations be implemented on `validateEdit` or
      `validateSave` to reduce risk of accidentally over-writing or losing
      logic included in the base validate function.

      @seealso `validateEdit`
      @seealso `validateSave`
      @param {Object} Attributes
      @param {Object} Options
    */
    validate: function (attributes, options) {
      attributes = attributes || {};
      options = options || {};
      if (options.force) { return; }
      var that = this, i, result,
        K = XM.Model,
        S = XT.Session,
        keys = _.keys(attributes),
        original = _.pick(this.originalAttributes(), keys),
        status = this.getStatus(),
        attr, value, category, column, params = {},
        type = this.recordType.replace(/\w+\./i, ''),
        columns = XT.session.getSchema().get(type).columns,
        isRel,
        model,

        // Helper functions
        isRelation = function (attr, value, type) {
          var rel;
          rel = _.find(that.relations, function (relation) {
            return relation.key === attr && relation.type === type;
          });
          return rel ? _.isObject(value) : false;
        },
        getColumn = function (attr) {
          return _.find(columns, function (column) {
            return column.name === attr;
          });
        };

      // Don't allow editing of records that are ineligable
      if (status === K.ERROR || status === K.EMPTY || (status & K.DESTROYED)) {
        return XT.Error.clone('xt1009', { params: { status: this.getStatusString() } });
      }

      // Check data type integrity
      for (attr in attributes) {
        if (attributes.hasOwnProperty(attr) &&
            !_.isNull(attributes[attr]) &&
            !_.isUndefined(attributes[attr])) {
          params.attr = ("_" + attr).loc();

          value = attributes[attr];
          column = getColumn(attr);
          category = column ? column.category : false;
          switch (category) {
          case S.DB_BYTEA:
            if (!_.isObject(value) && !_.isString(value)) { // XXX unscientific
              params.type = "_binary".loc();
              return XT.Error.clone('xt1003', { params: params });
            }
            break;
          case S.DB_UNKNOWN:
          case S.DB_STRING:
            if (!_.isString(value) &&
                !isRelation(attr, value, Backbone.HasOne)) {
              params.type = "_string".loc();
              return XT.Error.clone('xt1003', { params: params });
            }
            break;
          case S.DB_NUMBER:
            if (!_.isNumber(value) &&
                !isRelation(attr, value, Backbone.HasOne)) {
              params.type = "_number".loc();
              return XT.Error.clone('xt1003', { params: params });
            }
            break;
          case S.DB_DATE:
            if (!_.isDate(value)) {
              params.type = "_date".loc();
              return XT.Error.clone('xt1003', { params: params });
            }
            break;
          case S.DB_BOOLEAN:
            if (!_.isBoolean(value)) {
              params.type = "_boolean".loc();
              return XT.Error.clone('xt1003', { params: params });
            }
            break;
          case S.DB_ARRAY:
            isRel = isRelation(attr, value, Backbone.HasMany);
            if (!_.isArray(value) && !isRel) {
              params.type = "_array".loc();
              return XT.Error.clone('xt1003', { params: params });
            }
            // Validate children
            if (isRel && value.models) {
              for (i = 0; i < value.models.length; i++) {
                model = value.models[i];
                if (model.get('dataState') !== 'delete') {
                  result = model.validate(model.attributes, options);
                  if (result) { return result; }
                }
              }
            }
            break;
          case S.DB_COMPOUND:
            if (!_.isObject(value) && !_.isNumber(value)) {
              params.type = "_object".loc();
              return XT.Error.clone('xt1003', { params: params });
            }
            break;
          default:
            return XT.Error.clone('xt1002', { params: params });
          }
        }
      }

      // Check required.
      if (options.validateSave) {
        for (i = 0; i < this.requiredAttributes.length; i += 1) {
          value = attributes[this.requiredAttributes[i]];
          if (value === undefined || value === null || value === "") {
            params.attr = ("_" + this.requiredAttributes[i]).loc();
            return XT.Error.clone('xt1004', { params: params });
          }
        }
        result = this.validateSave(attributes, options);
        if (result) { return result; }
      }

      // Check read only and privileges.
      if ((status & K.READY) && !_.isEqual(attributes, original)) {

        if (!this.canUpdate() && status !== K.READY_NEW) {
          return XT.Error.clone('xt1010');
        }
      }

      return this.validateEdit(attributes, options);
    },

    /**
      Called at the end of the `validate` function if the function has not
      returned a result for any other reason. This is the safest place to
      implement custom editing validation. The default implementation returns
      `undefined`.

      @seealso `validate`
      @param {Object} Attributes
      @param {Object} Options
    */
    validateEdit: function (attributes, options) {
      // Implement custom code here on your own class
    },

    /**
      Called by the `validate` function after checking required fields
      if the `validateSave=true` option was passed. Implement custom validation
      before committing to the server here. The default implementation
      returns `undefined`.

      @seealso `validate`
      @param {Object} Attributes
      @param {Object} Options
    */
    validateSave: function (attributes, options) {
      // Implement custom code here on your own class
    }


  });

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.Model, /** @lends XM.Model# */{

    /**
      Use this function to find out whether a user can create records before
      instantiating one.

      @returns {Boolean}
    */
    canCreate: function () {
      return XM.Model.canDo.call(this, 'create');
    },

    /**
      Use this function to find out whether a user can read this record type
      before any have been loaded.

      @returns {Boolean}
    */
    canRead: function (model) {
      return XM.Model.canDo.call(this, 'read', model);
    },

    /**
      Returns whether a user has access to update a record of this type. If a
      record is passed that involves personal privileges, it will validate
      whether that particular record is updatable.

      @returns {Boolean}
    */
    canUpdate: function (model) {
      return XM.Model.canDo.call(this, 'update', model);
    },

    /**
      Returns whether a user has access to delete a record of this type. If a
      record is passed that involves personal privileges, it will validate
      whether that particular record is deletable.

      @returns {Boolean}
    */
    canDelete: function (model) {
      return XM.Model.canDo.call(this, 'delete', model);
    },

    /**
      Check privilege on `action`. If `model` is passed, checks personal
      privileges on the model where applicable.

      @param {String} Action
      @param {XM.Model} Model
    */
    canDo: function (action, model) {
      var privs = this.prototype.privileges,
        sessionPrivs = XT.session.privileges,
        isGrantedAll = false,
        isGrantedPersonal = false,
        username = XT.session.details.username,
        value,
        i,
        props,
        K = XM.Model,
        status = model && model.getStatus ? model.getStatus() : K.READY;

      // Need to be in a valid status to "do" anything
      if (!(status & K.READY)) { return false; }

      // If no privileges, nothing to check.
      if (_.isEmpty(privs)) { return true; }

      // If we have session prvileges perform the check.
      if (sessionPrivs && sessionPrivs.get) {
        // Check global privileges.
        if (privs.all && privs.all[action]) {
          isGrantedAll = this.checkCompoundPrivs(sessionPrivs, privs.all[action]);
        }
        // update privs are always sufficient for viewing as well
        if (!isGrantedAll && privs.all && action === 'read' && privs.all.update) {
          isGrantedAll = this.checkCompoundPrivs(sessionPrivs, privs.all.update);
        }

        // Check personal privileges.
        if (!isGrantedAll && privs.personal && privs.personal[action]) {
          isGrantedPersonal = this.checkCompoundPrivs(sessionPrivs, privs.personal[action]);
        }
        // update privs are always sufficient for viewing as well
        if (!isGrantedPersonal && privs.personal && action === 'read' && privs.personal.update) {
          isGrantedPersonal = this.checkCompoundPrivs(sessionPrivs, privs.personal.update);
        }
      }

      // If only personal privileges, check the personal attribute list to
      // see if we can update.
      if (!isGrantedAll && isGrantedPersonal && model) {
        i = 0;
        props = privs.personal && privs.personal.properties ?
                    privs.personal.properties : [];

        isGrantedPersonal = false;
        while (!isGrantedPersonal && i < props.length) {
          value = model.original(props[i]);
          isGrantedPersonal = value === username;
          i += 1;
        }
      }

      return isGrantedAll || isGrantedPersonal;
    },

    checkCompoundPrivs: function (sessionPrivs, privileges) {
      if (typeof privileges !== 'string') {
        return privileges;
      }
      var match = _.find(privileges.split(" "), function (priv) {
        return sessionPrivs.get(priv);
      });
      return !!match; // return true if match is truthy
    },

    /**
      Return an array of valid attribute names on the model.

      @returns {Array}
    */
    getAttributeNames: function () {
      var recordType = this.recordType || this.prototype.recordType,
        type = recordType.replace(/\w+\./i, '');
      return _.pluck(XT.session.getSchema().get(type).columns, 'name');
    },

    /**
      Returns an object from the relational store matching the `name` provided.

      @param {String} Name
      @returns {Object}
    */
    getObjectByName: function (name) {
      return Backbone.Relational.store.getObjectByName(name);
    },

    /**
      Returns an array of text attribute names on the model.

      @returns {Array}
    */
    getSearchableAttributes: function () {
      var recordType = this.prototype.recordType,
        type = recordType.split('.')[1],
        tbldef = XT.session.getSchema().get(type),
        attrs = [],
        name,
        i;

      for (i = 0; i < tbldef.columns.length; i++) {
        name = tbldef.columns[i].name;
        if (tbldef.columns[i].category === 'S') {
          attrs.push(name);
        }
      }
      return attrs;
    },

    /**
      Return a matching record id for a passed user `key` and `value`. If none
      found, returns zero.

      @param {String} Property to search on, typically a user key
      @param {String} Value to search for
      @param {Object} Options
      @returns {Object} Receiver
    */
    findExisting: function (key, value, options) {
      var recordType = this.recordType || this.prototype.recordType,
        params = [ recordType, key, value, this.id || -1 ],
        dataSource = options.dataSource || XT.dataSource;
      dataSource.dispatch('XM.Model', 'findExisting', params, options);
      XT.log("XM.Model.findExisting for: " + recordType);
      return this;
    },

    /**
      Include `force` option.
    */
    findOrCreate: function (attributes, options) {
      options = options ? _.clone(options) : {};
      options.force = true;
      return Backbone.RelationalModel.findOrCreate.call(this, attributes, options);
    },

    /**
      Determine whether this record has been referenced by another. By default
      this function inspects foreign key relationships on the database, and is
      therefore dependent on foreign key relationships existing where appropriate
      to work correctly.

      @param {Number} Id
      @param {Object} Options
      @returns {XT.Request} Request
    */
    used: function (id, options) {
      return XT.dataSource.dispatch('XM.Model', 'used', [this.prototype.recordType, id], options);
    },

    // ..........................................................
    // CONSTANTS
    //

    /**
      Generic state for records with no local changes.

      Use a logical AND (single `&`) to test record status.

      @static
      @constant
      @type Number
      @default 0x0001
    */
    CLEAN:            0x0001, // 1

    /**
      Generic state for records with local changes.

      Use a logical AND (single `&`) to test record status.

      @static
      @constant
      @type Number
      @default 0x0002
    */
    DIRTY:            0x0002, // 2

    /**
      State for records that are still loaded.

      This is the initial state of a new record. It will not be editable until
      a record is fetch from the store, or it is initialized with the `isNew`
      option.

      @static
      @constant
      @type Number
      @default 0x0100
    */
    EMPTY:            0x0100, // 256

    /**
      State for records in an error state.

      @static
      @constant
      @type Number
      @default 0x1000
    */
    ERROR:            0x1000, // 4096

    /**
      Generic state for records that are loaded and ready for use.

      Use a logical AND (single `&`) to test record status.

      @static
      @constant
      @type Number
      @default 0x0200
    */
    READY:            0x0200, // 512

    /**
      State for records that are loaded and ready for use with no local changes.

      @static
      @constant
      @type Number
      @default 0x0201
    */
    READY_CLEAN:      0x0201, // 513


    /**
      State for records that are loaded and ready for use with local changes.

      @static
      @constant
      @type Number
      @default 0x0202
    */
    READY_DIRTY:      0x0202, // 514


    /**
      State for records that are new - not yet committed to server.

      @static
      @constant
      @type Number
      @default 0x0203
    */
    READY_NEW:        0x0203, // 515


    /**
      Generic state for records that have been destroyed.

      Use a logical AND (single `&`) to test record status.

      @static
      @constant
      @type Number
      @default 0x0400
    */
    DESTROYED:        0x0400, // 1024


    /**
      State for records that have been destroyed and committed to server.

      @static
      @constant
      @type Number
      @default 0x0401
    */
    DESTROYED_CLEAN:  0x0401, // 1025

    /**
      State for records that have been destroyed but not yet committed to
      the server.

      @static
      @constant
      @type Number
      @default 0x0402
    */
    DESTROYED_DIRTY:  0x0402, // 1026

    /**
      Generic state for records that have been submitted to data source.

      Use a logical AND (single `&`) to test record status.

      @static
      @constant
      @type Number
      @default 0x0800
    */
    BUSY:             0x0800, // 2048


    /**
      State for records that are still loading data from the server.

      @static
      @constant
      @type Number
      @default 0x0804
    */
    BUSY_FETCHING:     0x0804, // 2052


    /**
      State for records that have been modified and submitted to server.

      @static
      @constant
      @type Number
      @default 0x0810
    */
    BUSY_COMMITTING:  0x0810, // 2064

    /**
      State for records that have been destroyed and submitted to server.

      @static
      @constant
      @type Number
      @default 0x0840
    */
    BUSY_DESTROYING:  0x0840 // 2112

  });

  XM.Model = XM.Model.extend({status: XM.Model.EMPTY});

  // Overload this function to include the 'force' option
  var func = Backbone.Relation.prototype.setRelated;
  Backbone.Relation.prototype.setRelated = function (related, options) {
    options = options ? _.clone(options) : {};
    options.force = true;
    options.silent = false;

    func.call(this, related, options);
  };

}());

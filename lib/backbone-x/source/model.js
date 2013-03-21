// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, setInterval:true, clearInterval:true */

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
    To load an existing record use the `findOrCreate` method and include an id in the attributes:
    <pre><code>
      m = XM.MyModel.findOrCreate({id: 1});
      m.fetch();
    </code></pre>

    @name XM.Model
    @description To create a new model include `isNew` in the options:
    @param {Object} Attributes
    @param {Object} Options
    @extends XM.ModelMixin
    @extends Backbone.RelationalModel
  */
  XM.Model = Backbone.RelationalModel.extend(XM.ModelMixin);
  XM.Model = XM.Model.extend(/** @lends XM.Model# */{


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
        isNew = this.isNew(),
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
          (!parent && canDelete) ||
           this.getStatus() === K.READY_NEW) {
        this._wasNew = isNew; // Hack so prototype call will still work
        this.setStatus(K.DESTROYED_DIRTY, {cascade: true});

        // If it's top level commit to the server now.
        if ((!parent && canDelete) || isNew) {
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
        options.propagate = true; // Update status of *all* relations
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
      options = _.defaults(options ? _.clone(options) : {});
      var that = this, attr;
      if (!this.id) {
        options.success = function (resp) {
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
      }

      // Set attributes that should be required and read only
      if (this.idAttribute) { this.setReadOnly(this.idAttribute); }
      if (this.idAttribute &&
          !_.contains(this.requiredAttributes, this.idAttribute)) {
        this.requiredAttributes.push(this.idAttribute);
      }
      this.setReadOnly('type');

      // Bind events, but only if we haven't already been here before
      if (!this._didInit) {
        this.on('change', this.didChange);
        this.on('error', this.didError);
        this.on('destroy', this.didDestroy);
        this.on('change:lock', this.lockDidChange);
        for (i = 0; i < relations.length; i++) {
          if (relations[i].type === Backbone.HasMany &&
              relations[i].includeInJSON === true) {
            this.on('add:' + relations[i].key, this.didChange);
          }
        }
        this._didInit = true;
      }
    },
    
    /**
      Return whether the model is in a read-only state. If an attribute name
      is passed, returns whether that attribute is read-only. It is also
      capable of checking the read only status of child objects via a search path string.

      <pre><code>
        // Inquire on the whole model
        var readOnly = this.isReadOnly();

        // Inquire on a single attribute
        var readOnly = this.isReadOnly("name");

        // Inquire using a search path
        var readOnly = this.isReadOnly("contact.firstName");
      </code></pre>

      @seealso `setReadOnly`
      @seealso `readOnlyAttributes`
      @param {String} attribute
      @returns {Boolean}
    */
    isReadOnly: function (value) {
      var result,
        parts,
        parent = this.getParent(true),
        isLockedOut = parent ? !parent.hasLockKey() : !this.hasLockKey();

      // Search path
      if (_.isString(value) && value.indexOf('.') !== -1) {
        parts = value.split('.');
        result = this;
        _.each(parts, function (part) {
          if (_.isBoolean(result)) {
            // do not drill down further if we have an answer already
            // do nothing.
          } else if (result instanceof Backbone.Model && !result.getValue(part)) {
            // do not bother disabling fields that don't exist
            result = false;
          } else if (result instanceof Backbone.Model) {
            // drill down into the search path
            result.getValue(part);
          } else {
            // we're at the end of the search path
            result = result.isReadOnly(part) || !result.hasLockKey();
          }
        });
        return result;
      }

      if ((!_.isString(value) && !_.isObject(value)) || this.readOnly) {
        result = this.readOnly;
      } else {
        result = _.contains(this.readOnlyAttributes, value);
      }
      return result || isLockedOut;
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
      Overload: Don't allow setting when model is in error or destroyed status, or
      updating a `READY_CLEAN` record without update privileges.

      @param {String|Object} Key
      @param {String|Object} Value or Options
      @param {Objecw} Options
    */
    set: function (key, val, options) {
      var K = XM.Model,
        keyIsObject = _.isObject(key),
        status = this.getStatus(),
        err;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (keyIsObject) { options = val; }
      options = options ? options : {};

      switch (status)
      {
      case K.READY_CLEAN:
        // Set error if no update privileges
        if (!this.canUpdate()) { err = XT.Error.clone('xt1010'); }
        break;
      case K.READY_DIRTY:
      case K.READY_NEW:
        break;
      case K.ERROR:
      case K.DESTROYED_CLEAN:
      case K.DESTROYED_DIRTY:
        // Set error if attempting to edit a record that is ineligable
        err = XT.Error.clone('xt1009', { params: { status: status } });
        break;
      default:
        // If we're not in a `READY` state, silence all events
        if (!_.isBoolean(options.silent)) {
          options.silent = true;
        }
      }

      // Raise error, if any
      if (err) {
        this.trigger('invalid', this, err, options);
        return false;
      }

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (keyIsObject) { val = options; }
      return Backbone.RelationalModel.prototype.set.call(this, key, val, options);
    },

    /**
      Set the status on the model. Triggers `statusChange` event. Option set to
      `cascade` will propagate status recursively to all HasMany children.

      @param {Number} Status
      @params {Object} Options
      @params {Boolean} [cascade=false] Cascade changes only through toMany relations
      @params {Boolean} [propagate=false] Propagate changes through both toMany and toOne relations
    */
    setStatus: function (status, options) {
      var K = XM.Model,
        attr,
        that = this,
        parent,
        parentRelation,
        dataState;

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
      if (options && (options.cascade || options.propagate)) {
        _.each(this.relations, function (relation) {
          attr = that.attributes[relation.key];
          if (attr && attr.models &&
              relation.type === Backbone.HasMany) {
            _.each(attr.models, function (model) {
              if (model.setStatus) {
                model.setStatus(status, options);
              }
            });
          } else if (attr && options.propagate &&
              relation.type === Backbone.HasOne) {
            attr.setStatus(status, options);
          }
        });
      }

      // Update data state at this level.
      switch (status)
      {
      case K.READY_NEW:
        dataState = 'create';
        break;
      case K.READY_CLEAN:
        dataState = 'read';
        break;
      case K.READY_DIRTY:
        dataState = 'update';
        break;
      case K.DESTROYED_DIRTY:
        dataState = 'delete';
      }
      if (dataState) { this.attributes.dataState = dataState; }

      // Percolate changes up to parent when applicable
      if (parent && (this.isDirty() ||
          status === K.DESTROYED_DIRTY)) {
        parentRelation = _.find(this.relations, function (relation) {
          return relation.isAutoRelation;
        });
        parent.changed[parentRelation.reverseRelation.key] = true;
        parent.trigger('change', parent, options);
      }
      this.release();
      this.trigger('statusChange', this, status, options);
      return this;
    },
    
    /**
      Reimplemented.

      @retuns {XT.Request} Request
    */
    save: function (key, value, options) {
      options = options ? _.clone(options) : {};
      var attrs = {},
        model = this,
        K = XM.ModelClassMixin,
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
      Default validation checks `attributes` for:<br />
        &#42; Data type integrity.<br />
        &#42; Required fields.<br />
      <br />
      Returns `undefined` if the validation succeeded, or some value, usually
      an error message, if it fails.<br />
      <br />

      @param {Object} Attributes
      @param {Object} Options
    */
    validate: function (attributes, options) {
      attributes = attributes || {};
      options = options || {};
      var that = this,
        i,
        result,
        S = XT.Session,
        attr, value, category, column, params = {},
        type = this.recordType.replace(/\w+\./i, ''),
        columns = XT.session.getSchema().get(type).columns,
        isRel,
        model,

        // Helper functions
        isRelation = function (attr, value, type, options) {
          options = options || {};

          var rel;
          rel = _.find(that.relations, function (relation) {
            return relation.key === attr &&
              relation.type === type &&
              (!options.nestedOnly || relation.isNested);
          });
          return rel ? _.isObject(value) : false;
        },
        getColumn = function (attr) {
          return _.find(columns, function (column) {
            return column.name === attr;
          });
        };

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
                !isRelation(attr, value, Backbone.HasOne) &&
                attr !== 'lock') {
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
            // Validate children if they're nested, but not if they're not
            isRel = isRelation(attr, value, Backbone.HasMany, {nestedOnly: true});
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
      for (i = 0; i < this.requiredAttributes.length; i += 1) {
        value = attributes[this.requiredAttributes[i]];
        if (value === undefined || value === null || value === "") {
          params.attr = ("_" + this.requiredAttributes[i]).loc();
          return XT.Error.clone('xt1004', { params: params });
        }
      }

      return;
    }

  });

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.Model, XM.ModelClassMixin);
  _.extend(XM.Model, /** @lends XM.Model# */{

    /**
      Overload: Need to handle status here
    */
    findOrCreate: function (attributes, options) {
      options = options ? options : {};
      var parsedAttributes = (_.isObject(attributes) && options.parse && this.prototype.parse) ?
				this.prototype.parse(attributes) : attributes;

			// Try to find an instance of 'this' model type in the store
      var model = Backbone.Relational.store.find(this, parsedAttributes);

      // If we found an instance, update it with the data in 'item'; if not, create an instance
      // (unless 'options.create' is false).
      if (_.isObject(attributes)) {
        if (model && options.merge !== false) {
          model.setStatus(XM.Model.BUSY_FETCHING);
          model.set(attributes, options);
        } else if (!model && options.create !== false) {
          model = this.build(attributes, options);
        }
      }

      return model;
    },

    /**
      Overload: assume that anything calling this function is doing so because it
      is building a model for a relation. In that case set the `isFetching` option
      is true which will set it in a `BUSY_FETCHING` state when it is created.
    */
    build: function (attributes, options) {
      options = options ? _.clone(options) : {};
      options.isFetching = options.isFetching !== false ? true : false;
      options.validate = false;
      return Backbone.RelationalModel.build.call(this, attributes, options);
    }

  });

  XM.Model = XM.Model.extend({status: XM.Model.EMPTY});

  /**
    We need to handle the ``isFetching` option at the constructor to make
    *sure* the status of the model will be `BUSY_FETCHING` if it needs to be.
  */
  var ctor = Backbone.RelationalModel.constructor;
  Backbone.RelationalModel.constructor = function (attributes, options) {
    ctor.apply(this, arguments);
    if (options && options.isFetching) { this.status = XM.Model.BUSY_FETCHING; }
  };

}());

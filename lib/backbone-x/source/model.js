// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, setInterval:true,
  clearInterval:true, jsonpatch:true */

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

    autoFetchId: false,

    /**
      A function that binds events to functions. It can and should only be called
      once by initialize. Any attempt to call it a second time will throw an error.
    */
    bindEvents: function () {
      var relations = this.relations || [],
        i;
      // Bind events, but only if we haven't already been here before.
      // We could silently skip, but then that means any overload done
      // buy anyone else has to do that check too. That's too error prone
      // and dangerous because the problems caused by duplicate bindings
      // are not immediatley apparent and insidiously hard to pin down.
      if (this._eventsBound) { throw "Events have already been bound."; }
      this.on('change', this.didChange);
      this.on('error', this.didError);
      this.on('destroy', this.didDestroy);
      for (i = 0; i < relations.length; i++) {
        if (relations[i].type === Backbone.HasMany &&
            relations[i].includeInJSON === true) {
          this.on('add:' + relations[i].key, this.didChange);
          if (!this.isReadOnly()) {
            this.on('add:' + relations[i].key, this.relationAdded);
          }
        }
      }
      this._idx = {};
      this._eventsBound = true;
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
      Reimplemented to handle status changes and automatically obtain
      a pessimistic lock on the record.

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
          var namespace = model.recordType.prefix(),
            schema = XT.session.getSchemas()[namespace],
            type = model.recordType.suffix(),
            stype = schema.get(type),
            params,
            lockOpts = {};

          if (stype.lockable && options.obtainLock !== false) {
            params = [namespace, type, model.id, model.etag];
            lockOpts.success = function (lock) {
              model.lock = lock;
              model.lockDidChange(model, lock);
              model.setStatus(K.READY_CLEAN, options);
              if (success) { success(model, resp, options); }
            };
            lockOpts.isJSON = true;

            model.dispatch("XM.Model", "obtainLock", params, lockOpts);
            if (XT.debugging) {
              XT.log('Fetch successful');
            }
          } else {
            model.setStatus(K.READY_CLEAN, options);
            if (success) { success(model, resp, options); }
          }
        };
        // allow the caller to pass in a different fetch function to call
        return options.prototypeFetch ?
          options.prototypeFetch.call(this, options) :
          Backbone.Model.prototype.fetch.call(this, options);
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
    fetchRelated: function (key, options, refresh) {
      options = options || {};
      var requests = [],
        models,
        created = [],
        status = this.getStatus(),
        K = XM.Model,
        rel = this.getRelation(key),
				keys = rel && (rel.keyIds || [rel.keyId]),
        toFetch = keys && _.select(keys || [], function (id) {
          return (id || id === 0) && (refresh || !Backbone.Relational.store.find(rel.relatedModel, id));
        }, this);

      if (toFetch && toFetch.length) {
        if (options.max && toFetch.length > options.max) {
          toFetch.length = options.max;
        }

        models = _.map(toFetch, function (id) {
          var model = Backbone.Relational.store.find(rel.relatedModel, id),
            attrs;

          if (!model) {
            attrs = {};
            attrs[rel.relatedModel.prototype.idAttribute] = id;
            model = rel.relatedModel.findOrCreate(attrs, options);
            created.push(model);
          }

          return model;
        }, this);

        requests = _.map(models, function (model) {
          var opts = _.defaults(
            {
              error: function () {
                if (_.contains(created, model)) {
                  model.trigger('destroy', model, model.collection, options);
                  if (options.error) { options.error.apply(model, arguments); }
                }
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
      } else {
        if (options.success) { options.success(); }
      }

      return requests;
    },

    /**
      Overload: Delete objects marked as destroyed from arrays and
      convert dates to strings.

      Add support for 'includeNested' option that will
      output JSON with nested toOne objects when specified.
    */
    toJSON: function (options) {
      var includeNested = options && options.includeNested,
        that = this,
        old = {},
        nested,
        json,
        Klass,
        idx,
        idAttr,
        prop,

        // Sort based on the exact order in which items were added.
        // This is an absolute must for `generatePatch` to work correctly
        byIdx = function (a, b) {
          return idx.indexOf(a[idAttr]) - idx.indexOf(b[idAttr]);
        };

      // If include nested, preprocess relations so they will show up nested
      if (includeNested) {
        nested = _.filter(this._relations, function (rel) {
          return rel.options.isNested;
        });
        _.each(nested, function (rel) {
          old[rel.key] = rel.options.includeInJSON;
          rel.options.includeInJSON = true;
        });
      }

      json = Backbone.RelationalModel.prototype.toJSON.apply(this, arguments);

      // Convert dates to strings to avoid conflicts with jsonpatch
      for (prop in json) {
        if (json.hasOwnProperty(prop) && json[prop] instanceof Date) {
          json[prop] = json[prop].toJSON();
        }
      }

      // If this Model has already been fully serialized in this branch once, return to avoid loops
      if (this.isLocked()) {
        return this.id;
      }
      this.acquire();

      // Handle "destroyed" records
      _.each(this.relations, function (relation) {
        var K = XM.ModelClassMixin,
          key = relation.key,
          status,
          attr,
          i;
        if (relation.type === Backbone.HasMany) {
          attr = that.get(key);
          if (attr && attr.length) {
            // Sort by create order
            idx = that._idx[relation.relatedModel.suffix()];
            if (idx) {
              Klass = Backbone.Relational.store.getObjectByName(relation.relatedModel);
              idAttr = Klass.prototype.idAttribute;
              json[key].sort(byIdx);
            }

            for (i = 0; i < attr.models.length; i++) {
              status = attr.models[i].getStatus();
              if (status === K.BUSY_COMMITTING) {
                status = attr.models[i]._prevStatus;
              }

              // If dirty record has changed from server version.
              // Deleting will leave a "hole" in the array picked up
              // by the patch algorithm that signals a change
              if (status === K.DESTROYED_DIRTY) {
                delete json[key][i];

              // If clean the server never knew about it so remove entirely
              } else  if (status === K.DESTROYED_CLEAN) {
                json[key].splice(i, 1);

              // Delete the relation parent data if applicable. Don't need it here.
              } else if (relation.isNested) {
                delete json[key][i][relation.reverseRelation.key];
              }
            }
          }
        }
      });

      this.release();

      // Revert relations to previous settings if applicable
      if (includeNested) {
        _.each(nested, function (rel) {
          rel.options.includeInJSON = old[rel.key];
          delete rel.options.oldIncludeInJSON;
        });
      }

      return json;
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
        idAttribute = this.idAttribute;

      // Set defaults if not provided
      this.privileges = this.privileges || {};
      this.readOnlyAttributes = this.readOnlyAttributes ?
        this.readOnlyAttributes.slice(0) : [];
      this.requiredAttributes = this.requiredAttributes ?
        this.requiredAttributes.slice(0) : [];

      // Validate
      if (_.isEmpty(this.recordType)) { throw 'No record type defined'; }
      if (options.status) {
        this.setStatus(options.status);
      } else if (_.isNull(status)) {
        this.setStatus(K.EMPTY);
        this.bindEvents();
      }

      // Handle options
      if (options.isNew) {
        klass = this.getClass();
        if (!klass.canCreate()) {
          throw 'Insufficent privileges to create a record.';
        }
        this.setStatus(K.READY_NEW, {cascade: true});

        // Key generator (client based)
        if (idAttribute === 'uuid' &&
            !this.get(idAttribute) &&
            !attributes[idAttribute]) {
          this.set(idAttribute, XT.generateUUID());
        }

        // Deprecated key generator (server based)
        if (this.autoFetchId) { this.fetchId(); }
      }

      // Set attributes that should be required and read only
      if (this.idAttribute &&
          !_.contains(this.requiredAttributes, idAttribute)) {
        this.requiredAttributes.push(this.idAttribute);
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
      var parent = this.getParent(true),
        isLockedOut = parent ? !parent.hasLockKey() : !this.hasLockKey(),
        result,
        parts,
        part,
        i;

      // Search path
      if (_.isString(value) && value.indexOf('.') !== -1) {
        parts = value.split('.');
        result = this;
        for (i = 0; i < parts.length; i++) {
          part = parts[i];
          if (result instanceof Backbone.Model && i + 1 < parts.length) {
            result = result.getValue(part);
          } else if (_.isNull(result)) {
            return result;
          } else if (!_.isUndefined(result)) {
            result = result.isReadOnly(part) || !result.hasLockKey();
          }
        }
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
      Recursively checks the object against the schema and converts date strings to
      date objects.

      @param {Object} Response
    */
    parse: function (resp) {
      var K = XT.Session,
        schemas = XT.session.getSchemas(),
        parse;
      parse = function (namespace, typeName, obj) {
        var type = schemas[namespace].get(typeName),
          column,
          rel,
          attr,
          i;
        if (!type) { throw typeName + " not found in schema."; }
        for (attr in obj) {
          if (obj.hasOwnProperty(attr) && obj[attr] !== null) {
            if (_.isObject(obj[attr])) {
              rel = _.findWhere(type.relations, {key: attr});
              typeName = rel ? rel.relatedModel.suffix() : false;
              if (typeName) {
                if (_.isArray(obj[attr])) {
                  for (i = 0; i < obj[attr].length; i++) {
                    obj[attr][i] = parse(namespace, typeName, obj[attr][i]);
                  }
                } else {
                  obj[attr] = parse(namespace, typeName, obj[attr]);
                }
              }
            } else {
              column = _.findWhere(type.columns, {name: attr}) || {};
              if (column.category === K.DB_DATE) {
                obj[attr] = new Date(obj[attr]);
              }
            }
          }
        }
        return obj;
      };
      return parse(this.recordType.prefix(), this.recordType.suffix(), resp);
    },

    relationAdded: function (model, related, options) {
      var type = model.recordType.suffix(),
        id = model.id,
        evt,
        idx,
        replaceId = function (model) {
          idx.splice(idx.indexOf(id), 1, model.id);
          model.off(evt, replaceId);
        };
      if (!this._idx[type]) { this._idx[type] = []; }
      idx = this._idx[type];

      if (id) {
        idx.push(id);
        return;
      }

      // If no model id, then use a placeholder until we have one
      id = XT.generateUUID();
      idx.push(model.id);
      evt = "change:" + model.idAttribute;
      model.on(evt, replaceId);
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
        parentRelation;

      // Prevent recursion
      if (this.isLocked() || this.status === status) { return; }

      // Reset patch cache if applicable
      if (status === K.READY_CLEAN && !this.readOnly) {
        this._cache = this.toJSON();
      }

      this.acquire();
      this._prevStatus = this.status;
      this.status = status;
      parent = this.getParent();

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
        this._wasNew = this.isNew();
        success = options.success;
        options.wait = true;
        options.cascade = true; // Cascade status to children
        options.success = function (resp) {
          var namespace = model.recordType.prefix(),
            schema = XT.session.getSchemas()[namespace],
            type = model.recordType.suffix(),
            stype = schema.get(type),
            params,
            lockOpts = {};

          if (stype.lockable) {
            params = [namespace, type, model.id, model.etag];
            lockOpts.success = function (lock) {
              model.lock = lock;
              model.lockDidChange(model, lock);
              model.setStatus(K.READY_CLEAN, options);
              if (success) { success(model, resp, options); }
            };
            lockOpts.isJSON = true;

            model.dispatch("XM.Model", "obtainLock", params, lockOpts);
            if (XT.debugging) { XT.log('Save successful'); }
          } else {
            model.setStatus(K.READY_CLEAN, options);
            if (success) { success(model, resp, options); }
          }
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) { value = options; }

        // Call the super version
        this.setStatus(K.BUSY_COMMITTING, options);
        // allow the caller to pass in a different save function to call
        result = options.prototypeSave ?
        options.prototypeSave.call(this, key, value, options) :
        Backbone.Model.prototype.save.call(this, key, value, options);
        delete this._wasNew;
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
        attr, value, category, column,
        params = {recordType: this.recordType},
        namespace = this.recordType.prefix(),
        type = this.recordType.suffix(),
        columns = XT.session.getSchemas()[namespace].get(type).columns,
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
            if (!_.isString(value) && !_.isNumber(value) &&
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
            // Validate children if they're nested, but not if they're not
            isRel = isRelation(attr, value, Backbone.HasMany, {nestedOnly: true});
            if (isRel && value.models) {
              for (i = 0; i < value.models.length; i++) {
                model = value.models[i];
                if (!(model.getStatus() & XM.ModelMixin.DESTROYED)) {
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
            // attribute not in schema
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

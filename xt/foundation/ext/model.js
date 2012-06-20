// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/**
  @class
  
  `XT.Model` is an abstract class designed to operate with `XT.DataSource`.
  It should be subclassed for any specific implentation. Subtypes should
  include a `recordType` the data source will use to retreive the record.
  
  To create a new model include `isNew` in the options like so:  
    XM.Contact = XT.Model.extend({recordType: 'XM.Contact'});
    m = new XM.Contact({firstName: 'Randy'}, {isNew: true});
    
  To load an existing record include a guid in the options like so:
    XM.Contact = XT.Model.extend({recordType: 'XM.Contact'});
    m = XM.Contact();
    m.fetch({id: 1});
  
  @extends Backbone.RelationalModel
  @param {Object} attributes
  @param {Object} options
*/
XT.Model = Backbone.RelationalModel.extend(
  /** @scope XT.Model.prototype */ {
  
  /**
  Set to true if you want an id fetched from the server when the `isNew` option
  is passed on a new model.
  
  @type {Boolean}
  */
  autoFetchId: true,
  
  idAttribute: "guid",
  
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
  Indicates whethere the model is read only.
  
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
  Reverts the model to the last set of attributes fetched from the server and
  resets the change log.
  */
  cancel: function() {
    _.extend(this.attributes, this.originalAttributes());
    this.reset();
  },
  
  /**
  Returns whether the current record can be updated based on privilege
  settings.

  @returns {Boolean}
  */
  canUpdate: function() {
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    return klass.canUpdate(this);
  },

  /**
  Returns whether the current record can be deleted based on privilege
  settings.

  @returns {Boolean}
  */
  canDelete: function() {
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    return klass.canDelete(this);
  },
  
  /**
  When any attributes change, store the original value(s) in `prime` and update
  the status if applicable.
  */
  didChange: function() {
    var K = XT.Model;
    var status = this.getStatus();
    _.defaults(this.prime, this.changed);
    if (status === K.READY_CLEAN) {
      this.setStatus(K.READY_DIRTY);
    }
  },
  
  /**
  Reimplemented to handle state change and parent child relationships. Calling
  `destroy` on a parent will cause the model to commit to the server
  immediately. Calling destroy on a child relation will simply mark it for 
  deletion on the next save of the parent.
  
  @returns {XT.Request|Boolean}
  */
  destroy: function(options) {
    options = options ? _.clone(options) : {};
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    var success = options.success;
    var model = this;
    var K = XT.Model;
    var parent = this.getParent(true);
    if (parent && parent.canUpdate(this) ||
        !parent && klass.canDelete(this)) {
      this.setStatus(K.DESTROYED_DIRTY); // Will update the data state
    
      // Loop through and destroy child relations
      _.each(this.relations, function(relation) {
        var attr = relation.isAutoRelation ? model.get(relation.key) : false;
        if (attr) {
          if (relation.type === Backbone.HasOne) {
            attr.destroy();
          } else if (relation.type === Backbone.HasMany) {
            _.each(attr.models, function(child) {
              child.destroy();
            });
          }
        }
      });
    
      // If it's top level commit to the server now.
      if (!parent) {
        if (klass.canDelete(this)) {
          this.setStatus(K.BUSY_DESTROYING);
          options.wait = true;
          options.success = function(resp, status, xhr) {
            model.clear();
            model.setStatus(K.DESTROYED_CLEAN);
            if (success) success(model, resp, options);
          };
          return Backbone.Model.prototype.destroy.call(this, options);
        }
      }
      
      // Otherwise just marked for deletion.
      return true;
    }
    
    enyo.log('Insufficient privileges to destroy');
    return false;
  },
  
  /*
  Reimplemented to handle state change.
  
  @returns {XT.Request} Request
  */
  fetch: function(options) {
    options = options ? _.clone(options) : {};
    var model = this;
    var K = XT.Model;
    var success = options.success;
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    var status = this.getStatus();
    if (klass.canRead()) {
      this.setStatus(K.BUSY_FETCHING);
      options.cascade = true; // Update status of children
      options.success = function(resp, status, xhr) {
        model.setStatus(K.READY_CLEAN, options);
        if (success) success(model, resp, options);
      };
      return Backbone.Model.prototype.fetch.call(this, options);
    }
    enyo.log('Insufficient privileges to fetch');
    return false;
  },
  
  /** 
  Set the id on this record an id from the server.
  
  @returns {XT.Request} Request
  */
  fetchId: function() {
    var that = this;
    var options = {silent: true};
    if (!_.isEmpty(this.id)) return false;
    options.success = function(resp, status, xhr) {
      that.set(that.idAttribute, resp, options);
    };
    XT.dataSource.dispatch('XT.Model', 'fetchId', this.recordType, options);
  },
  
  /**
  Return the parent model if one exists. If the `getRoot` parameter is
  passed, it will return the top level parent of the model hierarchy.
  
  @param {Boolean} Get Root 
  @returns {XT.Model}
  */
  getParent: function(getRoot) {
    var parent;
    var root;
    var relation = _.find(this.relations, function(rel) {
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
  getStatus: function() {
    return this.status;
  },
  
  /**
  Return the current status as as string.
  
  @returns {String}
  */
  getStatusString: function() {
    var ret = [];
    var status = this.getStatus();
    for(var prop in XT.Model) {
      if(prop.match(/[A-Z_]$/) && XT.Model[prop] === status) {
        ret.push(prop);
      }
    }
    return ret.join(" ");
  },
  
  /**
  Searches attributes first, then the model for a value on a property with the
  given key.
  
  @param {String} Key
  @returns {Any}
  */
  getValue: function(key) {
    return _.has(this.attributes, key) ? this.attributes[key] : this[key];
  },
  
  /**
  Called when model is instantiated.
  */
  initialize: function() {
    var options = arguments[1];
    var that = this;
    var klass;
    var K = XT.Model;

    // Validate record type
    if (_.isEmpty(this.recordType)) throw 'No record type defined';
    
    // Set defaults if not provided
    this.prime = {};
    this.privileges = this.privileges || {};
    this.readOnlyAttributes = this.readOnlyAttributes || [];
    this.requiredAttributes = this.requiredAttributes || [];

    // Initialize for new record.
    if (options && options.isNew) {
      klass = Backbone.Relational.store.getObjectByName(this.recordType);
      if (!klass.canCreate()) throw 'Insufficent privileges to create a record.';
      this.attributes.dataState = 'create';
      this.setStatus(K.READY_NEW);
      if (this.autoFetchId) this.fetchId();
    }

    // Id Attribute should be required and read only
    if (this.idAttribute) this.setReadOnly(this.idAttribute);
    if (this.idAttribute && 
        !_.contains(this.requiredAttributes, this.idAttribute)) {
      this.requiredAttributes.push(this.idAttribute);
    }
    
    // Bind on change event
    this.on('change', this.didChange);
  },
  
  /**
  Reimplemented. A model is new if the status is `READY_NEW`.
  
  @returns {Boolean}
  */
  isNew: function() {
    K = XT.Model;
    return this.getStatus === K.READY_NEW;
  },
  
  /**
  Returns true if status is `READY_NEW` or `READY_DIRTY`.
  
  @returns {Boolean}
  */
  isDirty: function() {
    var status = this.getStatus();
    var K = XT.Model;
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
  isReadOnly: function(value) {
    var attr;
    if ((!_.isString(value) && !_.isObject(value)) || this.readOnly) {
      return  this.readOnly;
    } else if (_.isObject(value)) {
      for (attr in value) {
        if (_.contains(this.readOnlyAttributes, attr)) return true;
      }
      return false;
    } 
    return _.contains(this.readOnlyAttributes, value);
  },
  
  original: function(attr) {
    return this.prime[attr] || this.get(attr);
  },
  
  originalAttributes: function() {
    return _.defaults(_.clone(this.prime), _.clone(this.attributes));
  },
  
  /**
  Reset the change log.
  */
  reset: function() {
    this.changed = {};
    this._silent = {};
    this._pending = {};
  },
  
  /**
  Reimplemented. Validate before saving.
  
  @retuns {XT.Request} Request
  */
  save: function(key, value, options) {
    options = options ? _.clone(options) : {};
    var attrs = {};
    var err;
    var model = this;
    var K = XT.Model;
    var success = options.success;
    var result;
    var oldStatus = this.getStatus(status);
    
    // Can't save unless root
    if (this.getParent()) {
      enyo.log('You must save on the root level model of this relation');
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
      options.wait = true;
      options.cascade = true; // Cascade status to children
      options.success = function(resp, status, xhr) {
        model.setStatus(K.READY_CLEAN, options);
        if (success) success(model, resp, options);
      };
      
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) value = options;
      
      // Call the super version
      this.setStatus(K.BUSY_COMMITTING);
      result = Backbone.Model.prototype.save.call(this, key, value, options);
      if (!result) this.setStatus(oldStatus);
      return result;
    }
    
    enyo.log('No changes to save');
    return false;
  },

  /**
  Set the entire model, or a specific model attribute to `readOnly`. Privilege
  enforcement supercedes read-only settings.
  
  Examples:
  
  m.setReadOnly() // sets model to read only
  m.setReadOnly(false) // sets model to be editable
  m.setReadOnly('name') // sets 'name' attribute to read-only
  m.setReadOnly('name', false) // sets 'name' attribute to be editable 
  
  @seealso `isReadOnly`
  @seealso `readOnly`
  @param {String|Boolean} Attribute to set, or boolean if setting the model
  @param {Boolean} Boolean - default = true.
  */
  setReadOnly: function(key, value) {
    // handle attribute
    if (_.isString(key)) {
      value = _.isBoolean(value) ? value : true;
      if (value && !_.contains(this.readOnlyAttributes, key)) {
        this.readOnlyAttributes.push(key);
      } else if (!value && _.contains(this.readOnlyAttributes, key)) {
        this.readOnlyAttributes = _.without(this.readOnlyAttributes, key);
      }
      
    // handle model
    } else {
      key = _.isBoolean(key) ? key : true;
      this.readOnly = key;
    }
    
    return this;
  },
  
  /**
  Set the status on the model. Triggers `statusChange` event. Option set to
  `cascade` will propagate status to children.
  
  @param {Number} Status
  */
  setStatus: function(status, options) {
    var K = XT.Model;
    var attr;
    var that = this;
    var parent;
    
    // Prevent recursion
    if ( this.isLocked() || this.status === status ) return;
		this.acquire();
    this.status = status;
    this.trigger('statusChange', this);
    parent = this.getParent();
    
    // Cascade changes through relations if specified
    if (options && options.cascade) {
      _.each (this.relations, function(relation) {
        attr = that.attributes[relation.key];
        if (attr) {
          if (relation.type === Backbone.HasOne && attr.setStatus) {
            attr.setStatus(status, options);
          } else if (relation.type === Backbone.HasMany) {
            if (attr.models) {
              _.each(attr.models, function(model) {
                if (model.setStatus) {
                 model.setStatus(status, options);
                }
              });
            }
          }
        }
      });
    
    // Percolate changes up to parent when applicable
    } else if ((status & K.DIRTY) && parent && parent.getStatus &&
               parent.getStatus() === K.READY_CLEAN) {
      parent.setStatus(K.READY_DIRTY);
    } 
    
    // Update data state.
    if (status === K.READY_CLEAN) this.set('dataState', 'read');
    else if (status === K.READY_DIRTY) this.set('dataState', 'update');
    else if (status === K.DESTROYED_DIRTY) this.set('dataState', 'delete');
    
    this.release();
    
    enyo.log(this.recordType + ' id: ' +  this.id + 
             ' changed to ' + this.getStatusString());
  },
  
  /**
  Sync to xTuple datasource.
  */
  sync: function(method, model, options) {
    options = options ? _.clone(options) : {};
    var id = options.id || model.id;
    var recordType = this.recordType;

    // Read
    if (method === 'read' && recordType && id && options.success) {
      return XT.dataSource.retrieveRecord(recordType, id, options);

    // Write
    } else if (method === 'create' || method === 'update' || method === 'delete') {
      return XT.dataSource.commitRecord(model, options);
    }
    return false;
  },
  
  /**
  Default validation checks `attributes` for required attributes.
  Reimplement your own custom validation code here, but make sure
  to call back to the superclass at the top of your function using:
  
  return XT.Model.prototype.validate.call(this, attributes, options); 
  
  @param {Object} Attributes
  @param {Object} Options
  */
  validate: function(attributes, options) {
    attributes = attributes || {};
    var K = XT.Model;
    var keys = _.keys(attributes);
    var original = _.pick(this.originalAttributes(), keys);
    var status = this.getStatus();
    var attr;
    var err;
    
    // Check required.
    if (status === K.BUSY_COMMITTING) {
      for (i = 0; i < this.requiredAttributes.length; i++) {
        if (attributes[this.requiredAttributes[i]] === undefined) {
          err = "'" + this.requiredAttributes[i] + "' is required.";
        }
      }
    }
    
    // Validate
    if (((status & K.READY) || status === K.EMPTY) && 
        !_.isEqual(attributes, original)) {
      for (attr in attributes) {
        if (attributes[attr] !== this.original(attr) &&
            this.isReadOnly(attr)) {
          err = 'Can not update read only attribute(s).';
        } 
      }
      
      if (!this.canUpdate()) {
        err = 'Insufficient privileges to update attribute(s)';
      }
    }
    
    if (err) enyo.log(err);
    return err;
  }

});

// ..........................................................
// CLASS METHODS
//

enyo.mixin( /** @scope XT.Model */ XT.Model, {

  /**
    Use this function to find out whether a user can create records before 
    instantiating one.

    @returns {Boolean}
  */
  canCreate: function() {
    return XT.Model.canDo.call(this, 'create');
  },

  /**
    Use this function to find out whether a user can read this record type
    before any have been loaded.

    @returns {Boolean}
  */
  canRead: function() {
    var privs = this.prototype.privileges;
    var sessionPrivs = XT.session.privileges;
    var isGranted = false;

    // If no privileges, nothing to check. 
    if (_.isEmpty(privs)) return true;

    if (sessionPrivs && sessionPrivs.get) {
      // Check global read privilege.
      isGranted = privs.all && privs.all.read ? 
                  sessionPrivs.get(privs.all.read) : false;

      // Check global update privilege.
      if (!isGranted) {
        isGranted = privs.all && privs.all.update ? 
                    sessionPrivs.get(privs.all.update) : false;
      }

      // Check personal view privilege.
      if (!isGranted) {
        isGranted = privs.personal && privs.personal.read ? 
                    sessionPrivs.get(privs.personal.read) : false;
      }

      // Check personal update privilege.
      if (!isGranted) {
        isGranted = privs.personal && privs.personal.update ? 
                    sessionPrivs.get(privs.personal.update) : false;
      }
    }

    return isGranted;
  },

  /**
  Returns whether a user has access to update a record of this type. If a
  record is passed that involves personal privileges, it will validate
  whether that particular record is updatable.

  @returns {Boolean}
  */
  canUpdate: function(model) {
    return XT.Model.canDo.call(this, 'update', model);
  },

  /**
  Returns whether a user has access to delete a record of this type. If a
  record is passed that involves personal privileges, it will validate
  whether that particular record is deletable.

  @returns {Boolean}
  */
  canDelete: function(model) {
    return XT.Model.canDo.call(this, 'delete', model);
  },

  /** 
  Check privilege on `action`. If `model` is passed, checks personal
  privileges on the model where applicable.
  
  @param {String} Action
  @param {XT.Model} Model
  */
  canDo: function(action, model) {
    var privs = this.prototype.privileges;
    var sessionPrivs = XT.session.privileges;
    var isGrantedAll = false;
    var isGrantedPersonal = false;
    var userName = XT.session.details.username;

    // If no privileges, nothing to check.  
    if (_.isEmpty(privs)) return true;
    
    // If we have session prvileges perform the check.
    if (sessionPrivs && sessionPrivs.get) {
      // Check global privileges.
      if (privs.all && privs.all[action]) {
        isGrantedAll = sessionPrivs.get(privs.all[action]);
      }

      // Check personal privileges.
      if (!isGrantedAll && privs.personal && privs.personal[action]) {
        isGrantedPersonal = sessionPrivs.get(privs.personal[action]);
      }
    }

    // If only personal privileges, check the personal attribute list to 
    // see if we can update.
    if (!isGrantedAll && isGrantedPersonal && model) {
      var i = 0;
      var username = XT.session.details.username;
      var props = privs.personal && privs.personal.properties ? 
                  privs.personal.properties : [];

      isGrantedPersonal = false;
      while (!isGrantedPersonal && i < props.length) {
        isGrantedPersonal = model.original(props[i].get('username')) === username;
        i++;
      }
    }

    return isGrantedAll || isGrantedPersonal;
  },

  // ..........................................................
  // CONSTANTS
  //
  
  /**
    Generic state for records with no local changes.

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0001
  */
  CLEAN:            0x0001, // 1

  /**
    Generic state for records with local changes.

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0002
  */
  DIRTY:            0x0002, // 2

  /**
    State for records that are still loaded.

    A record instance should never be in this state.  You will only run into
    it when working with the low-level data hash API on `SC.Store`. Use a
    logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0100
  */
  EMPTY:            0x0100, // 256

  /**
    State for records in an error state.

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x1000
  */
  ERROR:            0x1000, // 4096

  /**
    Generic state for records that are loaded and ready for use

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0200
  */
  READY:            0x0200, // 512

  /**
    State for records that are loaded and ready for use with no local changes

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0201
  */
  READY_CLEAN:      0x0201, // 513


  /**
    State for records that are loaded and ready for use with local changes

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0202
  */
  READY_DIRTY:      0x0202, // 514


  /**
    State for records that are new - not yet committed to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0203
  */
  READY_NEW:        0x0203, // 515


  /**
    Generic state for records that have been destroyed

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0400
  */
  DESTROYED:        0x0400, // 1024


  /**
    State for records that have been destroyed and committed to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0401
  */
  DESTROYED_CLEAN:  0x0401, // 1025
  
  /**
    State for records that have been destroyed but not yet committed to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0402
  */
  DESTROYED_DIRTY:  0x0402, // 1026

  /**
    Generic state for records that have been submitted to data source

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0800
  */
  BUSY:             0x0800, // 2048


  /**
    State for records that are still loading data from the server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0804
  */
  BUSY_FETCHING:     0x0804, // 2052


  /**
    State for records that have been modified and submitted to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0810
  */
  BUSY_COMMITTING:  0x0810, // 2064

  /**
    State for records that have been destroyed and submitted to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0840
  */
  BUSY_DESTROYING:  0x0840 // 2112
  
});

XT.Model = XT.Model.extend({status: XT.Model.EMPTY});
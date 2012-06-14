
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
    m = new XM.Contact({guid: 1});
    m.fetch();
    
    OR
  
    XM.Contact = XT.Model.extend({recordType: 'XM.Contact'});
    m = XM.Contact();
    m.fetch({id: 1});
  
  @extends Backbone.RelationalModel
  @param {Object} attributes
  @param {Object} options
*/
XT.Model = Backbone.RelationalModel.extend(
  /** @scope XT.Model.prototype */ {

  idAttribute: "guid",
  
  /**
  Set to true if you want an id fetched from the server when the `isNew` option
  is passed on a new model.
  
  @type {Boolean}
  */
  autoFetchId: true,
  
  /**
  Specify the name of a data source model here.
  
  @type {String}
  */
  recordType: null,
  
  /**
  A hash structure that defines data access.

  @property
  @type {Hash}
  */
  privileges: {},
  
  /**
  An array of required attributes. A validate on the entire model will fail
  until all the required attributes have values.
  
  @type {Array}
  */
  required: [],
  
  /**
  An array of attribute names designating attributes that are not editable.
  Use `setReadOnly` to edit this array. 
  
  @seealso `setReadOnly`
  @seealso `isReadOnly`
  @type {Array}
  */
  readOnly: [],
  
  // ..........................................................
  // METHODS
  //
  
  /**
    Returns whether the current record can be updated based on privilege
    settings.

    @returns {Boolean}
  */
  canUpdate: function() {
    var obj = Backbone.Relational.store.getObjectByName(this.recordType);
    return obj.canUpdate(this);
  },

  /**
    Returns whether the current record can be deleted based on privilege
    settings.

    @returns {Boolean}
  */
  canDelete: function() {
    var obj = Backbone.Relational.store.getObjectByName(this.recordType);
    return obj.canDelete(this);
  },
  
  /**
  Set the entire model, or a specific model attribute to readOnly. Privilege
  enforcement supercedes read-only settings.
  
  Examples:
  
  model.setReadOnly() // sets model to read only
  model.setReadOnly(false) // sets model to be editable
  model.setReadOnly('name') // sets 'name' attribute to read-only
  model.setReadOnly('name', false) // sets 'name' attribute to be editable 
  
  @param {String|Boolean} Attribute to set, or boolean if setting the model
  @param {Boolean} boolean - default = true.
  */
  setReadOnly: function(key, value) {
    // handle attribute
    if (_.isString(key)) {
      value = _.isBoolean(value) ? value : true;
      if (value && !_.contains(this.readOnly, key)) {
        this.readOnly.push(key);
      } else if (!value && _.contains(this.readOnly, key)) {
        this.readOnly = _.without(this.readOnly, key);
      }
      return;
    }
    
    // handle model
    key = _.isBoolean(key) ? key : true;
    this._readOnly = key;
  },
  
  /**
  Return whether the model is in a read-only state. If an attribute name
  is passed, returns whether that attribute is read only.

  @param {String} attribute
  */
  isReadOnly: function(attr) {
    if (!_.isString(attr) || this._readOnly || !this.canUpdate()) {
      return this._readOnly || !this.canUpdate();
    }
    return _.contains(this.readOnly, attr);
  },

  initialize: function() {
    var options = arguments[1];
   
    // set data source
    this._dataSource = XT.dataSource;
    
    // initialize for new record
    if (options && options.isNew) {
      this.attributes.dataState = 'created';
      if (this.autoFetchId) this._fetchId();
    }
    
    // set id to read only
    if (this.idAttribute && !_.contains(this.readOnly, this.idAttribute)) {
      this.readOnly.push(this.idAttribute);
    }
    
    // set id as required
    if (this.idAttribute && !_.contains(this.required, this.idAttribute)) {
      this.required.push(this.idAttribute);
    }
    
    // set up state change handler
    this.on('change', this._changed);
  },
  
  /**
  Reimplemented. A model is new if the dataState is `created`.
  */
  isNew: function() {
    return this.get('dataState') === 'created';
  },
  
  /**
  Returns true when dataState is `created` or `updated`.
  */
  isDirty: function() {
    var dataState = this.get('dataState');
    return dataState === 'created' || dataState === 'updated';
  },
  
  /**
  Reimplemented to handle state change.
  */
  fetch: function(options) {
    options = options ? _.clone(options) : {};
    var that = this;
    var success = options.success;
    
    // flip sync flag back on success
    options.success = function(resp, status, xhr) {
      that._sync = false;
      that._attrCache = _.clone(that.attributes);
      if (success) success(model, resp, options);
    };
  
    return Backbone.Model.prototype.fetch.call(this, options);
  },
  
  /**
  Reimplemented to handle state change.
  */
  save: function(key, value, options) {
    // Handle both `("key", value)` and `({key: value})` -style calls.
    if (_.isObject(key) || key === null || key === undefined) options = value;
    options = options ? _.clone(options) : {};

    var that = this;
    var success = options.success;

    // flip sync flag back on success
    options.success = function(resp, status, xhr) {
      that._sync = false;
      that._attrCache = _.clone(that.attributes);
      if (success) success(model, resp, options);
    };
    
    // Handle both `("key", value)` and `({key: value})` -style calls.
    if (_.isObject(key) || key === null || key === undefined) value = options;
  
    return Backbone.Model.prototype.save.call(this, key, value, options);
  },
  
  /**
  Reimplemented.
  */
  destroy: function(options) {
    options = options ? _.clone(options) : {};
    var that = this;
    var success = options.success;
    
    // clear on success
    options.success = function(resp, status, xhr) {
      that.clear({silent: true});
      that._attrCache = null;
      if (success) success(model, resp, options);
    };

    this.set('dataState', 'deleted');
    return Backbone.Model.prototype.destroy.call(this, options);
  },
  
  /**
  Overload: sync to xtuple datasource.
  */
  sync: function(method, model, options) {
    var recordType = model.recordType;
    var id = options.id || this.id;
    var success = options.success;
    
    if (options === undefined) options = {};
    this._sync = true;
    
    // read
    if (method === 'read' && recordType && id && success) {
      return this._dataSource.retrieveRecord(recordType, id, options);
      
    // write
    } else if (method === 'create' || method === 'update' || method === 'delete') {
      var ret = this._dataSource.commitRecord(model, options);
      this.set('dataState', 'busy');
      return ret;
    }
    
    return false;
  },
  
  /**
  Validate:
   * State
   * All required fields present if no attributes specified.
   * Read only attributes are not being edited
  */
  validate: function(attributes, options) {
    var attrs = attributes || this.attributes;
    var i;
    
    // check state
    if (this.get('dataState') === 'busy' && !this._sync) {
      return "Record is busy";
    } else if (this.get('dataState') === 'deleted') {
      return "Can not alter deleted record";
    }
    
    // check for editing on read-only
    if (attributes) {
      if (this.isReadOnly()) {
        return "Record is in a read only state.";
      }
      
      for (i = 0; i < this.readOnly.length; i++) {
        var attr = this.readOnly[i];
        if (attributes[attr] !== this.previous(attr)) {
          return "Can not edit read only attribute " + attr + ".";
        }
      }
    
    // check required
    } else {
      for (i = 0; i < this.required.length; i++) {
        if (!this.has(this.required[i])) {
          return "'" + this.required[i] + "' is required.";
        }
      }
    }
  },
  
  // ..........................................................
  // PRIVATE
  //
 
  /** @private */
  _attrCache: null,
  
  /** @private */
  _dataSource: null,
  
  /** @private */
  _readOnly: false,
  
  /** @private */
  _sync: false,
  
  /** @private */
  _changed: function() {
    if (this.get('dataState') === 'read' && !this._sync) {
      this.set('dataState', 'updated');
    }
  },
  
  /** @private */
  _fetchId: function() {
    var that = this;
    var options = {};
    
    // callback
    options.success = function(resp, status, xhr) {
      var attr = that.idAttribute;
      
      // set the id
      that.setReadOnly(attr, false);
      that.set(attr, resp);
      that.setReadOnly(attr, true);
    };
    
    // fetch id
    this._dataSource.dispatch('XT.Record', 'fetchId', this.recordType, options);
  }
  
});

// Class Methods
enyo.mixin( /** @scope XT.Model */ XT.Model, {

  /**
    Use this function to find out whether a user can create records before instantiating one.

    @returns {Boolean}
  */
  canCreate: function() {
    var privileges = this.prototype.privileges,
        sessionPrivs = XT.session.getPrivileges(),
        isGranted = false;

    if (sessionPrivs) {
      // check global
      isGranted = privileges.all && privileges.all.create && 
                  sessionPrivs.get(privileges.all.create) === true;
                  
      // check personal
      if (!isGranted) {
        isGranted = privileges.personal && privileges.personal.create && 
                    sessionPrivs.get(privileges.personal.create) === true;
      }
    }
    
    return isGranted;
  },

  /**
    Use this function to find out whether a user can read this record type
    before any have been loaded.

    @returns {Boolean}
  */
  canRead: function() {
    var privileges = this.prototype.privileges,
        sessionPrivs = XT.session.privileges,
        isGranted = false;

    if (sessionPrivs) {
      // check global read privilege
      isGranted = privileges.all && privileges.all.read && 
                  sessionPrivs.get(privileges.all.read) === true;
                  
      // check global update privilege
      if (!isGranted) {
        isGranted = privileges.all && privileges.all.update && 
                    sessionPrivs.get(privileges.all.update) === true;
      }
      
      // check personal view privilege
      if (!isGranted) {
        isGranted = privileges.personal && privileges.personal.read && 
                    sessionPrivs.get(privileges.personal.read) === true;
      }
      
      // check personal update privilege
      if (!isGranted) {
        isGranted = privileges.personal && privileges.personal.update && 
                    sessionPrivs.get(privileges.personal.update) === true;
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
  canUpdate: function(record) {
    return XT.Model._canDo.call(this, 'update', record);
  },

  /**
    Returns whether a user has access to delete a record of this type. If a
    record is passed that involves personal privileges, it will validate
    whether that particular record is deletable.

    @returns {Boolean}
  */
  canDelete: function(record) {
    return XT.Model._canDo.call(this, 'delete', record);
  },

  /** @private */
  _canDo: function(action, record) {
    var privileges = this.prototype.privileges,
        sessionPrivs = XT.session.privileges,
        isGrantedAll = false,
        isGrantedPersonal = false,
        userName = XT.session.details.username;

    if (sessionPrivs) {
      // check global privileges
      if (privileges.all && privileges.all[action]) {
        isGrantedAll = sessionPrivs.get(privileges.all[action]) === true;
      }

      // check personal privileges
      if (!isGrantedAll && privileges.personal && privileges.personal[action]) {
        isGrantedPersonal = sessionPrivs.get(privileges.personal[action]) === true;
      }
    }

    // If only personal privileges, check the original attribute cache against
    // the personal attribute list to see if we can update
    if (!isGrantedAll && isGrantedPersonal) {
      var i = 0;
      var username = XT.session.details.username;
      var props = privileges.personal && privileges.personal.properties ? 
                  privileges.personal.properties : [];

      isGrantedPersonal = false;
      if (record && record._attrCache) {
        while (!isGrantedPersonal && i < props.length) {
          isGrantedPersonal = m._attrCache[props[i]].get('username') === username;
          i++;
        }
      }
    }

    return isGrantedAll || isGrantedPersonal;
  }
  
});


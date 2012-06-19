
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
  
  /**
  Set to true if you want an id fetched from the server when the `isNew` option
  is passed on a new model.
  
  @type {Boolean}
  */
  autoFetchId: true,
  
  idAttribute: "guid",
  
  /**
  A hash structure that defines data access.

  @type {Hash}
  */
  privileges: {},
  
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
  readOnlyAttributes: [],
  
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
  requiredAttributes: [],
  
  // ..........................................................
  // METHODS
  //
  
  /**
  Reverts the model to the last state before last `change` was called.
  */
  cancel: function() {
    this.attributes = this.clone(_previousAttributes);
    this.changed = {};
    this._silent = {};
    this._pending = {};
  },
  
  /**
    Returns whether the current record can be updated based on privilege
    settings.

    @returns {Boolean}
  */
  canUpdate: function() {
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    return klass.canUpdate.call(this, this);
  },

  /**
    Returns whether the current record can be deleted based on privilege
    settings.

    @returns {Boolean}
  */
  canDelete: function() {
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    return klass.canDelete.call(this, this);
  },
  
  /**
  Reimplemented.
  */
  destroy: function(options) {
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    if (kclass.canDelete(this)) {
      options = options ? _.clone(options) : {};
      options.wait = true;
      this.attributes.dataState = 'delete';
      return Backbone.Model.prototype.destroy.call(this, options);
    }
    console.log('Insufficient privileges to destroy');
    return false;
  },
  
  /*
  Reimplemented. Fetch must not be `silent`.
  
  @returns {XT.Request} Request
  */
  fetch: function(options) {
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    options = _.extend({}, options, {silent: false, sync: true});
    if (klass.canRead()) {
      return Backbone.Model.prototype.fetch.call(this, options);
    }
    console.log('Insufficient privileges to fetch');
    return false;
  },
  
  /** 
  Set the id on this record an id from the server.
  
  @returns {XT.Request} Request
  */
  fetchId: function() {
    var that = this;
    var options = {sync: true};
    if (!_.isEmpty(this.id)) return false;

    // Callback
    options.success = function(resp, status, xhr) {
      that.set(that.idAttribute, resp, options);
    };

    // Dispatch
    XT.dataSource.dispatch('XT.Model', 'fetchId', this.recordType, options);
  },
  
  /**
  Called when model is instantiated.
  */
  initialize: function() {
    var options = arguments[1];
    var that = this;

    // Validate record type
    if (_.isEmpty(this.recordType)) throw 'No record type defined';

    // Initialize for new record.
    if (options && options.isNew) {
      this.attributes.dataState = 'create';
      if (this.autoFetchId) this.fetchId();
    }

    // Id Attribute should be required and read only
    if (this.idAttribute) this.readOnlyAttributes.push(this.idAttribute);
    if (this.idAttribute) this.requiredAttributes.push(this.idAttribute);

    // Set up destroy handler
    this.on('destroy', function() {
      that.clear({silent: true});
    });
  },
  
  /**
  Reimplemented. A model is new if the dataState is `create`.
  
  @returns {Boolean}
  */
  isNew: function() {
    return this.get('dataState') === 'create';
  },
  
  /**
  Returns true if dataState is `"create"` or `"update"`.
  
  @returns {Boolean}
  */
  isDirty: function() {
    var dataState = this.get('dataState');
    return dataState === 'create' || dataState === 'update';
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
  
  /**
  Reimplemented. Validate before saving.
  
  @retuns {XT.Request} Request
  */
  save: function(key, value, options) {
    var attrs = {};
    var err;
    
    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (_.isObject(key) || _.isEmpty(key)) {
      attrs = key;
      options = value;
    } else if (_.isString(key)) {
      attrs[key] = value;
    }
    
    // Only save if we can and should.
    err = this.validate(_.extend(this.attributes, attrs));
    if ((this.isDirty() || attrs) && !err) {
      options = options ? _.clone(options) : {};
      options.wait = true;
      options.sync = true;
      
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) value = options;
      
      return Backbone.Model.prototype.save.call(this, key, value, options);
    }
    
    console.log(err || 'No changes to save');
    return false;
  },
  
  /**
  Reimplemented. All sets are `silent` so that changes are accumulated until `save`.
  Calling `set` triggers `willChange` event on each attribute.
  
  @returns {Object} Receiver
  */
  set: function(key, value, options) {
    var result;
    var attr;
    var attrs = {};
    
    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (_.isObject(key)) {
      attrs = key;
      options = value;
    } else if (_.isString(key)) {
      attrs[key] = value;
    }
    
    // Set silently unless otherwise specified
    options = options ? _.clone(options) : {};
    options.silent = _.isEmpty(options.silent) ? true : options.silent;
    
    // Validate
    if (!options.sync && (this.isReadOnly(attrs) || !this.canUpdate())) {
      return false;
    }
    
    // Trigger `willChange` event on each attribute.
    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        this.trigger('willChange:' + attr, this, options);
      }
    }
    
    // Call super `set`.
    result = Backbone.RelationalModel.prototype.set.call(this, key, value, options);
    
    // Update dataState
    if (result && !options.sync && this.get('dataState') === 'read') {
      this.set('dataState', 'update', options);
    }
    return result;
  },

  /**
  Set the entire model, or a specific model attribute to readOnly. Privilege
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
  Sync to xTuple datasource.
  */
  sync: function(method, model, options) {
    options = options ? _.clone(options) : {};
    var id = options.id || model.id;
    var success = options.success;
    var recordType = this.recordType;

    // Read
    if (method === 'read' && recordType && id && success) {
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
    for (i = 0; i < this.requiredAttributes.length; i++) {
      if (attributes[this.requiredAttributes[i]] === undefined) {
        return "'" + this.requiredAttributes[i] + "' is required.";
      }
    }
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
    var privs = this.privileges;
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
    var privs = this.privileges;
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
        isGrantedPersonal = model.previous(props[i].get('username')) === username;
        i++;
      }
    }

    return isGrantedAll || isGrantedPersonal;
  }
  
});


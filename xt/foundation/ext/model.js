
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
  
  /** 
  Indicates whether the model is busy waiting for a response.
  
  @type {Boolean} 
  */
  busy: false,
  
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
  An array of required attributes. A validate on the entire model will fail
  until all the required attributes have values.
  
  @type {Array}
  */
  requiredAttributes: [],
  
  // ..........................................................
  // METHODS
  //
  
  /** 
  Update status when any attributes change.
  */
  attributeChanged: function() {
    if (this.get('dataState') === 'read') {
      this.set('dataState', 'update');
    }
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
  Reimplemented.
  */
  clear: function(options) {
    options = options ? _.clone(options) : {};
    options.checkReadOnly = true;
    options.checkPrivileges = true;
    return Backbone.RelationalModel.prototype.clear.call(this, options);
  },
  
  /**
  Reimplemented.
  */
  destroy: function(options) {
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    
    if (kclass.canDelete(this)) {
      options = options ? _.clone(options) : {};
      options.wait = true;
      model.attributes.dataState = 'delete';
      return Backbone.RelationalModel.prototype.destroy.call(this, options);
    }
    console.log('Insufficient privileges to destroy');
    return false;
  },
  
  fetch: function(options) {
    var klass = Backbone.Relational.store.getObjectByName(this.recordType);
    
    if (klass.canRead()) {
       return Backbone.Model.prototype.fetch.call(this, options);
    }
    console.log('Insufficient privileges to fetch');
    return false;
  },
  
  /** 
  Set the id on this record an id from the server.
  */
  fetchId: function() {
    var that = this;
    var options = {};
    
    if (!_.isEmpty(this.id)) return false;

    // Callback
    options.success = function(resp, status, xhr) {
      that.set(that.idAttribute, resp);
    };

    // Dispatch
    XT.dataSource.dispatch('XT.Model', 'fetchId', this.recordType, options);
  },
  
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

    // Set up state change handler
    this.on('change', this.attributeChanged);

    // Set up destroy handler
    this.on('destroy', function() {
      that.clear({silent: true});
    });
  },
  
  /**
  Returns true when dataState is `create` or `update`.
  */
  isDirty: function() {
    var dataState = this.get('dataState');
    return dataState === 'create' || dataState === 'update';
  },
  
  /**
  Reimplemented. A model is new if the dataState is `create`.
  */
  isNew: function() {
    return this.get('dataState') === 'create';
  },
  
  /**
  Return whether the model is in a read-only state. If an attribute name
  is passed, returns whether that attribute is read-only.

  @seealso `setReadOnly`
  @seealso `readOnly`
  @param {String} attribute
  */
  isReadOnly: function(attr) {
    if (!_.isString(attr) || this.readOnly) {
      return  model.readOnly;
    }
    return _.contains(this.readOnly, attr);
  },
  
  /**
  Reimplemented to check for required attributes.
  */
  isValid: function() {
    var options = {};
    options.checkRequired = true;
    
    return this.validate(model.attributes, options);
  },
  
  /**
  Reimplemented.
  */
  save: function(key, value, options) {
    if (this.isDirty()) {
      options = options ? _.clone(options) : {};
      options.checkRequired = true;
      return Backbone.Model.prototype.save.call(this, key, value, options);
    }
    
    console.log('No changes to save');
    return false;
  },
  
  /**
  Reimplemented.
  */
  set: function(key, value, options) {
    options = options ? _.clone(options) : {};
    options.checkReadOnly = true;
    options.checkPrivileges = true;
    return Backbone.Model.prototype.set.call(this, key, value, options);
  },

  /**
  Set the entire model, or a specific model attribute to readOnly. Privilege
  enforcement supercedes read-only settings.
  
  Examples:
  
  model.setReadOnly() // sets model to read only
  model.setReadOnly(false) // sets model to be editable
  model.setReadOnly('name') // sets 'name' attribute to read-only
  model.setReadOnly('name', false) // sets 'name' attribute to be editable 
  
  @seealso `isReadOnly`
  @seealso `readOnly`
  @param {String|Boolean} Attribute to set, or boolean if setting the model
  @param {Boolean} boolean - default = true.
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
  Overload: sync to xtuple datasource.
  */
  sync: function(method, model, options) {
    options = options ? _.clone(options) : {};
    var id = options.id || model.id;
    var success = options.success;
    var recordType = this.recordType;

    model.busy = true;

    // Cache attributes, flag sync completed.
    options.success = function(resp, status, xhr) {
      model.busy = false;
      if (success) success(resp, status, xhr);
    };

    // Read
    if (method === 'read' && recordType && id && success) {
      return XT.dataSource.retrieveRecord(recordType, id, options);

    // Write
    } else if (method === 'create' || method === 'update' || method === 'delete') {
      var ret = XT.dataSource.commitRecord(model, options);
      model.set('dataState', 'busy');
      return ret;
    }

    return false;
  },
  
  /**
  Reimplemented.
  */
  unset: function(attr, options) {
    options = options ? _.clone(options) : {};
    options.checkReadOnly = true;
    options.checkPrivileges = true;
    return Backbone.Model.prototype.unset.call(this, attr, options);
  },
  
  /**
  Default validation checks required fields and read-only.
  Reimplement your own custom validation code here, but make sure
  to call back to the superclass at the top of your function using:
  
  return XT.Model.prototype.validate.call(this, attributes, options); 
  
  @param {Object} attributes
  @param {Object} options
  */
  validate: function(attributes, options) {
    var attr;
    var err;
    options = options || {};
    
    // Check if we're waiting on the server.
    if (this.busy) return 'Busy waiting for server response';

    // Check required.
    if (options.checkRequired) {
      for (i = 0; i < this.requiredAttributes.length; i++) {
        if (_.isEmpty(attributes[this.requiredAttributes[i]])) {
          return "'" + this.required[i] + "' is required.";
        }
      }
    }

    // Check read-only.
    if (options.checkReadOnly) {
      err = this.readOnly ? "Record is in a read only state." :
                "Can not change read only attribute {attr}.";
      for (attr in attributes) {
        if (_.contains(this.readOnlyAttributes, attr) && 
            !_.isEqual(attributes[attr], this.previous(attr))) {
          return err.replace(/{attr}/, attr);
        }
      }
    }
    
    // Check privileges.
    if (options.checkPrivileges && !this.canUpdate()) {
      return "Insufficient privileges to update";
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
    var privs = this.privileges,
        sessionPrivs = XT.session.privileges,
        isGrantedAll = false,
        isGrantedPersonal = false,
        userName = XT.session.details.username;

    // If no privileges, nothing to check    
    if (_.isEmpty(privs)) return true;

    if (sessionPrivs && sessionPrivs.get) {
      // Check global privileges
      if (privs.all && privs.all[action]) {
        isGrantedAll = sessionPrivs.get(privs.all[action]);
      }

      // Check personal privileges
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


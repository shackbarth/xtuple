
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
  */
  autoFetchId: true,
  
  /**
  Specify the name of a data source model here.
  */
  recordType: null,
  
  /**
  An array of required attributes. A validate on the entire model will fail
  until all the required attributes have values.
  */
  required: [],
  
  /**
  An array of attributes that are not editable.
  */
  readOnly: [],
  
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
    if (!_.isString(attr) || this._readOnly) return this._readOnly;
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
    return this.get('dataState') === 'created' || this.get('dataState') === 'updated';
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
        return "Record is in read only mode.";
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
      that.readOnly = _.without(that.readOnly, attr);
      that.set(attr, resp);
      that.readOnly.push(attr);
    };
    
    // fetch id
    this._dataSource.dispatch('XT.Record', 'fetchId', this.recordType, options);
  }
  
});


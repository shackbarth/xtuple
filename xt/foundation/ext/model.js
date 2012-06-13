
/**
  @class
  
  `XT.Model` is an abstract class designed to operate with `XT.DataSource`.
  It should be subclassed for any specific implentation. Subtypes should
  include a `recordType` the data source will use to retreive the record.
  
  To create a new model include 'create' in the options like so:  
    XM.Contact = XT.Model.extend({recordType: 'XM.Contact'});
    m = new XM.Contact({firstName: 'Randy'}, {create: true});
    
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
  Set to true if you want an id fetched from the server when the `insert` option
  is passed on a new model
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

  initialize: function() {
    var options = arguments[1];
   
    // set data source
    this._dataSource = XT.dataSource;
    
    // initialize for created record
    if (options && options.create) {
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
  },
  
  /**
  Reimplemented. A model is new if the dataState is "created".
  */
  isNew: function() {
    return this.get('dataState') === 'created';
  },
  
  /**
  Returns true when dataState is 'created' or 'updated'.
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
    
    // turn off state handling
    this.off('change', this._changed);
    
    // add call back to turn state handling back on after fetch
    options.success = function(resp, status, xhr) {
      that.on('change', that._changed);
      if (success) success(model, resp, options);
    };
  
    return Backbone.Model.prototype.fetch.call(this, options);
  },
  
  /**
  Reimplemented.
  */
  set: function( key, value, options ) {
    if (_.isObject(key) && value.sync) this.set('dataState', 'read');
    return Backbone.RelationalModel.prototype.set.call(this, key, value, options);
  },
  
  /**
  Reimplemented.
  */
  destroy: function(options) {
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
    options.sync = true;
    
    // read
    if (method === 'read' && recordType && id && success) {
      return this._dataSource.retrieveRecord(recordType, id, options);
      
    // write
    } else if (method == 'create' || method == 'update' || method === 'delete') {
      return this._dataSource.commitRecord(model, options);
    }
    
    return false;
  },
  
  /**
  Validate all required fields if no attributes specified.
  */
  validate: function(attributes, options) {
    var attrs = attributes || this.attributes;
    var i;
    
    // check state
    if (this.get('dataState') === 'busy' && !options.sync) {
      return "Record is busy";
    } else if (this.get('dataState') === 'deleted') {
      return "Can not alter deleted record";
    }
    
    // check for editing on read-only
    if (attributes) {
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
  _changed: function() {
    this.set('dataState', 'updated');
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


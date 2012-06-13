
/**
  @class
  
  `XT.Model` is an abstract class designed to operate with `XT.DataSource`.
  It should be subclass for any specific implentation. Subtypes should
  include a `recordType` the data source will use retreive the record.
  
  To create a new model include 'insert' in the options like so:  
    XM.Contact = XT.Model.extend({recordType: 'XM.Contact'});
    m = new XM.Contact({insert: true});
    
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
  Specify the name of a data source model here.
  */
  recordType: null,

  initialize: function() {
    var options = arguments[1];
    
    // initialize for inserted record
    if (options && options.insert) {
      this.attributes.dataState = 'inserted';
      this.fetchId();
    }
    
    this._dataSource = XT.dataSource;
  },
  
  /**
  Change dataState to 'updated'.
  */
  attributeChanged: function() {
    if (this.get('dataState') === 'read') {
      this.set('dataState', 'updated');
    }
  },
  
  /**
  Reimplemented. A model is new if the dataState is "inserted".
  */
  isNew: function() {
    return this.get('dataState') === 'inserted';
  },
  
  /**
  Returns true when dataState is 'inserted' or 'updated'.
  */
  isDirty: function() {
    return this.get('dataState') === 'inserted' || this.get('dataState') === 'updated';
  },

  /**
  Reimplemented to handle state change.
  */
  fetch: function(options) {
    // turn off state handling
    this.off('change', this.attributeChanged);
    this.set('dataState', 'busy fetching');
    
    // add call back to turn state handling back on after fetch
    if (options === undefined) options = {};
    var that = this;
    var success = options.success;
    options.sync = true;
    options.success = function(resp, status, xhr) {
      that.on('change', that.attributeChanged);
      if (success) success(model, resp, options);
    };
  
    return Backbone.Model.prototype.fetch.call(this, options);
  },
  
  /**
  Fetch a new guid from the server.
  */
  fetchId: function() {
    var that = this;
    var options = {};
    var success = options.success;
    
    // fetch id
    options.success = function(resp, status, xhr) {
      this.set('guid', resp);
    }; 
    this._dataSource.dispatch('XT.Record', 'fetchId', this.recordType, options);
  },
  
  /**
  Reimplemented.
  */
  set: function( key, value, options ) {
    if (_.isObject(key) && value.fetched) this.set('dataState', 'read');
    return Backbone.RelationalModel.prototype.set.call(this, key, value, options);
  },
  
  /**
  Reimplemented.
  */
  save: function(key, value, options) {
    this.set('dataState', 'busy committing');
    if (options === undefined) options = {};
    var success = options.success;
    options.success = function(resp, status, xhr) {
      that.set('dataState', 'read');
      if (success) success(model, resp, options);
    };
    return Backbone.Model.prototype.save.call(this, options);
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
    // check state
    if (this.get('dataState') === 'busy' && !options.fetched) {
      return 'Record is busy';
    } else if (this.get('dataState') === 'deleted') {
      return 'Can not alter deleted record';
    }
    
    if (!attributes) {  // all
      // check required
      var required = this.required || [];
      var i;
    
      for (i = 0; i < required.length; i++) {
        if (!this.has(required[i])) {
          return "'" + required[i] + " is required.";
        }
      }
    }
  },
  
  /** @private */
  _dataSource: null,
  
});



/**
  @class
  
  To create a new model include 'insert' in the options like so:  
    m = XT.Model({recordType: XM.Contact}, {insert: true});
    
  To load an existing record include a guid in the options like so:
    m = XT.Model({recordType: XM.Contact, guid: 1});
    m.fetch();
    
    OR
  
    m = XT.Model({recordType: XM.Contact});
    m.fetch({id: 1});
  
  @extends Backbone.RelationalModel
*/
XT.Model = Backbone.RelationalModel.extend(
  /** @scope XT.Model.prototype */ {

  idAttribute: "guid",
  
  /**
  Specify the name of a data source model here.
  */
  recordType: null,
  
  initialize: function() {
    // initialize state for inserted record
    if (arguments[1] && arguments[1].insert) {
      this.attributes.dataState = 'inserted';
    }
  },
  
  /*
  Change state.
  */
  attributeChanged: function() {
    if (this.get('dataState') === 'read') {
      this.set('dataState', 'updated');
    }
  },
  
  /* 
  A model is new if the dataState is "inserted".
  */
  isNew: function() {
    return this.get('dataState') === 'inserted';
  },

  /*
  Handle state change
  */
  fetch: function(options) {
    // turn off state handling
    this.off('change', this.attributeChanged);
    
    // add call back to turn state handling back on after fetch
    if (options === undefined) options = {};
    var that = this;
    var success = options.success;
    options.success = function(resp, status, xhr) {
      that.on('change', that.attributeChanged);
      if (success) success(model, resp, options);
    };
  
    return Backbone.Model.prototype.fetch.call(this, options);
  },
  
  destroy: function(options) {
    this.set('dataState', 'deleted');
    return Backbone.Model.prototype.destroy.call(this, options);
  },
  
  /*
  Sync to xtuple datasource.
  */
  sync: function(method, model, options) {
    var recordType = model.recordType;
    var id = options.id || this.id;
    var data = new XT.Data();
    var success = options.success;
    var error = options.error;
    
    if (method === 'read' && recordType && id && success) {
      return data.retrieveRecord(recordType, id, success, error);
    }
    
    return false;
  },
  
  /*
  Validate all required fields if no attributes specified.
  */
  validate: function(attributes, options) {
    if (this.get('dataState') === 'deleted') {
      return 'Can not alter deleted record';
    }
    
    if (!attributes) { // all
      // check required
      var required = this.required || [];
      var i;
    
      for (i = 0; i < required.length; i++) {
        if (!this.has(required[i])) {
          return "'" + required[i] + " is required.";
        }
      }
    }
  }
  
});


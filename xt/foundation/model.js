
/**
*/
XT.Model = Backbone.RelationalModel.extend(
  /** @scope XT.Model.prototype */ {

  idAttribute: "guid",

  initialize: function() {
    this.on('change', this.attributeChanged);
  },
  
  /*
  Change state.
  */
  attributeChanged: function() {
    this.set('dataState', 'updated');
  },

  /*
  Handle state change
  */
  fetch: function(options) {
    // turn off state handling
    this.off('change', this.attributeChanged);
    this.set('dataState', 'busy');
    
    // add call back to turn state handling back on
    if (options === undefined) options = {};
    var that = this;
    var success = options.success;
    options.success = function(resp, status, xhr) {
      that.on('change', that.attributeChanged);
      if (success) success(model, resp, options);
    };
  
    return Backbone.Model.prototype.fetch.call(this, options);
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


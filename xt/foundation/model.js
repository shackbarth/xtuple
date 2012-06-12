
/**
*/
XT.Model = Backbone.RelationalModel.extend(
  /** @scope XT.Model.prototype */ {

  idAttribute: "guid",

  /*
  Reset changed after fetch.
  */
  fetch: function(options) {
    if (options === undefined) options = {};
    var model = this;
    var success = options.success;
    options.success = function(resp, status, xhr) {
      model.resetChanged();
      if (success) success(model, resp, options);
    };
  
    return Backbone.Model.prototype.fetch.call(this, options);
  },

  /*
  Sync to xtuple datasource.
  */
  sync: function(method, model, options) {
    var recordType = model.recordType;
    var id = options.id || this.get('id');
    var data = new XT.Data();
    var success = options.success;
    var error = options.error;
    
    if (method === 'read' && recordType && id && success) {
      return data.retrieveRecord(recordType, id, success, error);
    }
    
    return false;
  },
  
  /*
  Map idAttribute
  */
  get: function(key, value, options) {
    if (key === 'id' && this.idAttribute) key = this.idAttribute;
    
    return Backbone.Model.prototype.get.call(this, key, value, options);
  },
  
  /*
  Validate all required fields if no attributes specified.
  */
  validate: function(attributes, options) {
    if (!attributes) { // all
      var required = this.required || [];
      var i;
    
      for (i = 0; i < required.length; i++) {
        if (!this.has(required[i])) {
          return "'" + required[i] + " is required.";
        }
      }
    }
  },
  
  /*
  Reset model so that it reports no changes.
  */
  resetChanged: function() {
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);
  }
  
});
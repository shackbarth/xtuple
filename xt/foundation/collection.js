
/**
*/
XT.Collection = Backbone.Collection.extend(
  /** @scope XT.Collection.prototype */ {

  /*
  sync to xtuple datasource.
  */
  sync: function(method, model, options) {
    var query = {};
    var data = new XT.Data();
    var success = options.success;
    var error = options.error;
    
    query.recordType = model.model.prototype.recordType;
    
    if (method === 'read' && query.recordType && success) {
      return data.fetch(query, success, error);
    }
    
    return false;
  }
  
});
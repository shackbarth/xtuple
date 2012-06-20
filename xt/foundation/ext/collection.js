
/**
  @class
  
  @extends Backbone.Collection
*/
XT.Collection = Backbone.Collection.extend(
  /** @scope XT.Collection.prototype */ {

  /**
  Handle status change.
  */
  add: function(models, options) {
    var result = Backbone.Collection.prototype.add.call(this, models, options);
    var i;
    var K = XT.Model;
    for (i = 0; i < result.models.length; i++) {
      result.models[i].setStatus(K.READY_CLEAN);
    }
    return result;
  },
  
  /**
  Sync to xTuple datasource.
  */
  sync: function(method, model, options) {
    options = options ? _.clone(options) : {};
    options.query = options.query || {};
    options.query.recordType = model.model.prototype.recordType;
    
    if (method === 'read' && options.query.recordType && options.success) {
      return XT.dataSource.fetch(options);
    }
    
    return false;
  }
  
});
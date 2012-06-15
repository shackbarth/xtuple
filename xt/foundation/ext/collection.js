
/**
  @class
  
  @extends Backbone.Collection
*/
XT.Collection = Backbone.Collection.extend(
  /** @scope XT.Collection.prototype */ {

  initialize: function() {
    this._dataSource =  XT.dataSource;
  },

  /**
  Overload: sync to xtuple datasource.
  */
  sync: function(method, model, options) {
    options = options ? _.clone(options) : {};
    options.query = options.query || {};
    options.query.recordType = model.model.prototype.recordType;
    
    if (method === 'read' && options.query.recordType && options.success) {
      return this._dataSource.fetch(options);
    }
    
    return false;
  },
  
  /** @private */
  _dataSource: null
  
});
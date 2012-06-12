
/**
  @class
  
  @extends Backbone.Collection
*/
XT.Collection = Backbone.Collection.extend(
  /** @scope XT.Collection.prototype */ {

  initialize: function() {
    var options = arguments[1];

    // if a data source is passed use it, otherwise try default
    this._dataSource = options && options.dataSource ? 
                       options.dataSource : XT.dataSource;
  },

  /**
  Overload: sync to xtuple datasource.
  */
  sync: function(method, model, options) {
    var query = {};
    
    query.recordType = model.model.prototype.recordType;
    if (method === 'read' && query.recordType && options.success) {
      return this._dataSource.fetch(query, options);
    }
    
    return false;
  },
  
  /** @private */
  _dataSource: null
  
});
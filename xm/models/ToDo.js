
/**
  @class
  
  @extends XT.Model
*/
XM.ToDoInfo = XT.Model.extend(
  /** @scope XM.ToDoInfo.prototype */ {

  recordType: 'XM.ToDoInfo',
  
  relations: [{
    type: Backbone.HasOne,
    key: 'contact',
    relatedModel: 'XM.ContactInfo'
  },{
    type: Backbone.HasOne,
    key: 'assignedTo',
    relatedModel: 'XM.UserAccountInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.ToDoInfoCollection = XT.Collection.extend(
  /** @scope XM.ToDoInfoCollection.prototype */ {

  model: XM.ToDoInfo
  
});
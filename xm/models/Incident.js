
/**
  @class
  
  @extends XT.Model
*/
XM.IncidentInfo = XT.Model.extend(
  /** @scope XM.IncidentInfo.prototype */ {

  recordType: 'XM.IncidentInfo',
  
  relations: [{
    type: Backbone.HasOne,
    key: 'account',
    relatedModel: 'XM.AccountInfo'
  },{
    type: Backbone.HasOne,
    key: 'contact',
    relatedModel: 'XM.ContactInfo'
  },{
    type: Backbone.HasOne,
    key: 'owner',
    relatedModel: 'XM.UserAccountInfo'
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
XM.IncidentInfoCollection = XT.Collection.extend(
  /** @scope XM.IncidentInfoCollection.prototype */ {

  model: XM.IncidentInfo
  
});

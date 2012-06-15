
/**
  @class
  
  @extends XT.Model
*/
XM.OpportunityInfo = XT.Model.extend(
  /** @scope XM.OpportunityInfo.prototype */ {

  recordType: 'XM.OpportunityInfo',
  
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
    key: 'assignedTo',
    relatedModel: 'XM.UserAccountInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.OpportunityInfoCollection = XT.Collection.extend(
  /** @scope XM.OpportunityInfoCollection.prototype */ {

  model: XM.OpportunityInfo
  
});

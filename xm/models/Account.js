
/**
  @class
  
  @extends XT.Model
*/
XM.AccountInfo = XT.Model.extend(
  /** @scope XM.AccountInfo.prototype */ {

  recordType: 'XM.AccountInfo',
  
  relations: [{
    type: Backbone.HasOne,
    key: 'primaryContact',
    relatedModel: 'XM.ContactInfo'
  },{
    type: Backbone.HasOne,
    key: 'owner',
    relatedModel: 'XM.UserAccountInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.AccountInfoCollection = XT.Collection.extend(
  /** @scope XM.AccountInfoCollection.prototype */ {

  model: XM.AccountInfo
  
});

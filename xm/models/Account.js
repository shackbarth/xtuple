
/**
  @class
  
  @extends XT.Model
*/
XM.AccountContactInfo = XT.Model.extend(
  /** @scope XM.AccountContactInfo.prototype */ {

  recordType: 'XM.AccountContactInfo',
  
  relations: [{
    type: Backbone.HasOne,
    key: 'address',
    relatedModel: 'XM.AddressInfo'
  },{
    type: Backbone.HasOne,
    key: 'owner',
    relatedModel: 'XM.UserAccountInfo'
  }]
  
});

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
    relatedModel: 'XM.AccountContactInfo'
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

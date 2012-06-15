
/**
  @class
  
  @extends XT.Model
*/
XM.ContactInfo = XT.Model.extend(
  /** @scope XM.ContactInfo.prototype */ {

  recordType: 'XM.ContactInfo',
  
  relations: [{
    type: Backbone.HasOne,
    key: 'address',
    relatedModel: 'XM.AddressInfo'
  },{
    type: Backbone.HasOne,
    key: 'account',
    relatedModel: 'XM.AccountInfo'
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
XM.ContactInfoCollection = XT.Collection.extend(
  /** @scope XM.ContactInfoCollection.prototype */ {

  model: XM.ContactInfo
  
});

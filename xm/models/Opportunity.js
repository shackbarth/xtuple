
/**
  @class
  
  @extends XT.Model
*/
XM.OpportunityType = XT.Model.extend(
  /** @scope XM.OpportunityType.prototype */ {

  recordType: 'XM.OpportunityType'
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.OpportunityStage = XT.Model.extend(
  /** @scope XM.OpportunityStage.prototype */ {

  recordType: 'XM.OpportunityStage'
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.OpportunitySource = XT.Model.extend(
  /** @scope XM.OpportunitySource.prototype */ {

  recordType: 'XM.OpportunitySource'
  
});

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
  },{
    type: Backbone.HasOne,
    key: 'priority',
    relatedModel: 'XM.Priority',
    includeInJSON: 'guid'
  },{
    type: Backbone.HasOne,
    key: 'opportunityStage',
    relatedModel: 'XM.OpportunityStage',
    includeInJSON: 'guid'
  },{
    type: Backbone.HasOne,
    key: 'opportunityType',
    relatedModel: 'XM.OpportunityType',
    includeInJSON: 'guid'
  }]
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.OpportunityTypeCollection = XT.Collection.extend(
  /** @scope XM.OpportunityTypeCollection.prototype */ {

  model: XM.OpportunityType
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.OpportunityStageCollection = XT.Collection.extend(
  /** @scope XM.OpportunityStageCollection.prototype */ {

  model: XM.OpportunityStage
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.OpportunitySourceCollection = XT.Collection.extend(
  /** @scope XM.OpportunitySourceCollection.prototype */ {

  model: XM.OpportunitySource
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.OpportunityInfoCollection = XT.Collection.extend(
  /** @scope XM.OpportunityInfoCollection.prototype */ {

  model: XM.OpportunityInfo
  
});

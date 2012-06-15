
/**
  @class
  
  @extends XT.Model
*/
XM.IncidentCategory = XT.Model.extend(
  /** @scope XM.IncidentCategory.prototype */ {

  recordType: 'XM.IncidentCategory'
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.IncidentSeverity = XT.Model.extend(
  /** @scope XM.IncidentSeverity.prototype */ {

  recordType: 'XM.IncidentSeverity'
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.IncidentResolution = XT.Model.extend(
  /** @scope XM.IncidentResolution.prototype */ {

  recordType: 'XM.IncidentResolution'
  
});


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
  },{
    type: Backbone.HasOne,
    key: 'priority',
    relatedModel: 'XM.Priority',
    includeInJSON: 'guid'
  },{
    type: Backbone.HasOne,
    key: 'category',
    relatedModel: 'XM.IncidentCategory',
    includeInJSON: 'guid'
  }]
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.IncidentCategoryCollection = XT.Collection.extend(
  /** @scope XM.IncidentCategoryCollection.prototype */ {

  model: XM.IncidentCategory
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.IncidentSeverityCollection = XT.Collection.extend(
  /** @scope XM.IncidentSeverityCollection.prototype */ {

  model: XM.IncidentSeverity
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.IncidentResolutionCollection = XT.Collection.extend(
  /** @scope XM.IncidentResolutionCollection.prototype */ {

  model: XM.IncidentResolution
  
});

/**
  @class
  
  @extends XT.Collection
*/
XM.IncidentInfoCollection = XT.Collection.extend(
  /** @scope XM.IncidentInfoCollection.prototype */ {

  model: XM.IncidentInfo
  
});



/**
  @class
  
  @extends XT.Model
*/
XM.ProjectIncident = XT.Model.extend(
  /** @scope XM.ProjectIncident.prototype */ {

  recordType: 'XM.ProjectIncident',
  
  isDocumentAssignment: true,
 
  relations: [{
    type: Backbone.HasOne,
    key: 'incident',
    relatedModel: 'XM.IncidentInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectOpportunity = XT.Model.extend(
  /** @scope XM.ProjectOpportunity.prototype */ {

  recordType: 'XM.ProjectOpportunity',
 
  isDocumentAssignment: true,
 
  relations: [{
    type: Backbone.HasOne,
    key: 'opportunity',
    relatedModel: 'XM.OpportunityInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectToDo = XT.Model.extend(
  /** @scope XM.ProjectToDo.prototype */ {

  recordType: 'XM.ProjectToDo',
 
  isDocumentAssignment: true,
  
  relations: [{
    type: Backbone.HasOne,
    key: 'toDo',
    relatedModel: 'XM.ToDoInfo'
  }]
  
});


XM.Project.prototype.relations.push(
  {
    type: Backbone.HasMany,
    key: 'incidents',
    relatedModel: 'XM.ProjectIncident',
    reverseRelation: {
      key: 'project'
    }
  },
  {
    type: Backbone.HasMany,
    key: 'opportunities',
    relatedModel: 'XM.ProjectOpportunity',
    reverseRelation: {
      key: 'project'
    }
  },
  {
    type: Backbone.HasMany,
    key: 'toDos',
    relatedModel: 'XM.ProjectToDo',
    reverseRelation: {
      key: 'project'
    }
  }
);



/**
*/
XM.Project = XT.Model.extend(
  /** @scope XM.Project.prototype */ {

  recordType: 'XM.Project',
  
  defaults: {
    "projectStatus":  "C"
  },
  
  required: [
    "number",
    "projectStatus",
    "name",
    "dueDate"
  ],

  relations: [{
    type: Backbone.HasMany,
    key: 'tasks',
    relatedModel: 'XM.ProjectTask',
    reverseRelation: {
      key: 'project'
    }
  },
  {
    type: Backbone.HasMany,
    key: 'comments',
    relatedModel: 'XM.ProjectComment',
    reverseRelation: {
      key: 'project'
    }
  }]
  
});

/**
*/
XM.ProjectTask = XT.Model.extend(
  /** @scope XM.ProjectTask.prototype */ {

  recordType: 'XM.ProjectTask',
  
  defaults: {
    "projectTaskStatus":  "C"
  },
  
  required: [
    "number",
    "projectTaskStatus",
    "name",
    "dueDate"
  ]
  
});

/**
*/
XM.ProjectComment = XT.Model.extend(
  /** @scope XM.ProjectComment.prototype */ {

  recordType: 'XM.ProjectComment',
  
});

/**
*/
XM.ProjectInfo = XT.Model.extend(
  /** @scope XM.ProjectInfo.prototype */ {

  recordType: 'XM.ProjectInfo'
  
});

// Collections

/*
*/
XM.ProjectCollection = XT.Collection.extend(
  /** @scope XM.ProjectCollection.prototype */ {

  model: XM.Project
  
});

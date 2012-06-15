
/**
*/
XM.Priority = XT.Model.extend(
  /** @scope XM.Priority.prototype */ {

  recordType: 'XM.Priority',
  
  defaults: {
    order: 0
  },
  
  required: [
    "name"
  ]
  
});

/**
*/
XM.PriorityCollection = XT.Collection.extend(
  /** @scope XM.PriorityCollection.prototype */ {

  model: XM.Priority
  
});


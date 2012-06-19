
/**
*/
XM.Priority = XT.Model.extend(
  /** @scope XM.Priority.prototype */ {

  recordType: 'XM.Priority',
  
  privileges: {
    "all": {
      "create": "MaintainIncidentPriorities",
      "read": true,
      "update": "MaintainIncidentPriorities",
      "delete": "MaintainIncidentPriorities"
    }
  },
  
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


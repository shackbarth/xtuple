/**
  @namespace
  
  Shared task totaling logic.
*/
XM.ProjectMixin = {
  
  initialize: function() {
    XT.Model.prototype.initialize.call(this);
    
    // add event bindings
    this.on('add:tasks remove:tasks', this.tasksChanged);
  },
  
  /**
  Recaclulate task hours and expense totals.
  */
  tasksChanged: function() {
    var budgetedHoursTotal = 0.0;
    var actualHoursTotal = 0.0;
    var budgetedExpensesTotal = 0.0;
    var actualExpensesTotal = 0.0;
    
    // total up task data
    _.each(this.get('tasks').models, function(task) {
      budgetedHoursTotal += task.get('budgetedHours');
      actualHoursTotal += task.get('actualHours');
      budgetedExpensesTotal += task.get('budgetedExpenses');
      actualExpensesTotal += task.get('actualExpenses');
    });
    
    // update the project
    this.set("budgetedHoursTotal", budgetedHoursTotal);
    this.set("actualHoursTotal", actualHoursTotal);
    this.set("budgetedExpensesTotal", budgetedExpensesTotal);
    this.set("actualExpensesTotal", actualExpensesTotal);
  }
  
};

/**
  @class
  
  @extends XT.Model
*/
XM.Project = XT.Model.extend(
  /** @scope XM.Project.prototype */ {

  recordType: 'XM.Project',
  
  privileges: {
    "all": {
      "create": "MaintainAllProjects",
      "read": "ViewAllProjects",
      "update": "MaintainAllProjects",
      "delete": "MaintainAllProjects"
    },
    "personal": {
      "create": "MaintainPersonalProjects",
      "read": "ViewPersonalProjects",
      "update": "MaintainPersonalProjects",
      "delete": "MaintainPersonalProjects",
      "properties": [
        "owner",
        "assignedTo"
      ]
    }
  },
  
  defaults: {
    "status":  "C",
    "budgetedHoursTotal": 0,
    "actualHoursTotal": 0,
    "budgetedExpensesTotal": 0,
    "actualExpensesTotal": 0
  },
  
  required: [
    "number",
    "status",
    "name",
    "dueDate"
  ],

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
    type: Backbone.HasMany,
    key: 'tasks',
    relatedModel: 'XM.ProjectTask',
    reverseRelation: {
      key: 'project'
    }
  },{
    type: Backbone.HasMany,
    key: 'comments',
    relatedModel: 'XM.ProjectComment',
    reverseRelation: {
      key: 'project'
    }
  },{
    type: Backbone.HasMany,
    key: 'accounts',
    relatedModel: 'XM.ProjectAccount',
    reverseRelation: {
      key: 'project'
    }
  },{
    type: Backbone.HasMany,
    key: 'contacts',
    relatedModel: 'XM.ProjectContact',
    reverseRelation: {
      key: 'project'
    }
  },{
    type: Backbone.HasMany,
    key: 'items',
    relatedModel: 'XM.ProjectItem',
    reverseRelation: {
      key: 'project'
    }
  },{
    type: Backbone.HasMany,
    key: 'files',
    relatedModel: 'XM.ProjectFile',
    reverseRelation: {
      key: 'project'
    }
  },{
    type: Backbone.HasMany,
    key: 'images',
    relatedModel: 'XM.ProjectImage',
    reverseRelation: {
      key: 'project'
    }
  },{
    type: Backbone.HasMany,
    key: 'urls',
    relatedModel: 'XM.ProjectUrl',
    reverseRelation: {
      key: 'project'
    }
  },{
    type: Backbone.HasMany,
    key: 'projects',
    relatedModel: 'XM.ProjectProject',
    reverseRelation: {
      key: 'project'
    }
  },{
    type: Backbone.HasMany,
    key: 'recurrences',
    relatedModel: 'XM.ProjectRecurrence',
    reverseRelation: {
      key: 'project'
    }
  }]
  
});

_.extend(XM.Project.prototype, XM.ProjectMixin);

/**
  @class
  
  @extends XT.Model
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
  ],
  
  relations: [{
    type: Backbone.HasOne,
    key: 'owner',
    relatedModel: 'XM.UserAccountInfo'
  },{
    type: Backbone.HasOne,
    key: 'assignedTo',
    relatedModel: 'XM.UserAccountInfo'
  },{
    type: Backbone.HasMany,
    key: 'comments',
    relatedModel: 'XM.ProjectTaskComment',
    reverseRelation: {
      key: 'project'
    }
  }],
  
  // ..........................................................
  // METHODS
  //
  
  initialize: function() {
    var evt = 'change:budgetedHours change:actualHours ' +
              'change:budgetedExpenses change:actualExpense';
    this.on(evt, this.valuesChanged);
  },
  
  /**
  Update project totals when values change.
  */
  valuesChanged: function() {
    var attr;
    var eligible = [
      'budgetedHours', 
      'actualHours', 
      'budgetedExpenses', 
      'actualExpense'
    ];
    
    // loop through each changed attribute and recalculate eligible values
    for (attr in this.changed) {
      if (_.contains(eligible, attr)) {
        var project = this.get('project');
        var delta = this.get(attr) - this.previous(attr);
        var total = project.get(attr + 'Total');
        
        project.set(attr + 'Total', total + delta);
      }
    }
  }
  
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectComment = XT.Model.extend(
  /** @scope XM.ProjectComment.prototype */ {

  recordType: 'XM.ProjectComment',
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectAccount = XT.Model.extend(
  /** @scope XM.ProjectAccount.prototype */ {

  recordType: 'XM.ProjectAccount',

  isDocumentAssignment: true,

  relations: [{
    type: Backbone.HasOne,
    key: 'account',
    relatedModel: 'XM.AccountInfo'
  }]

});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectContact = XT.Model.extend(
  /** @scope XM.ProjectContact.prototype */ {

  recordType: 'XM.ProjectContact',

  isDocumentAssignment: true,
  
  relations: [{
    type: Backbone.HasOne,
    key: 'contact',
    relatedModel: 'XM.ContactInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectItem = XT.Model.extend(
  /** @scope XM.ProjectItem.prototype */ {

  recordType: 'XM.ProjectItem',

  isDocumentAssignment: true,

  relations: [{
    type: Backbone.HasOne,
    key: 'item',
    relatedModel: 'XM.ItemInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectFile = XT.Model.extend(
  /** @scope XM.ProjectFile.prototype */ {

  recordType: 'XM.ProjectFile',

  isDocumentAssignment: true,
  
  relations: [{
    type: Backbone.HasOne,
    key: 'file',
    relatedModel: 'XM.FileInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectImage = XT.Model.extend(
  /** @scope XM.ProjectImage.prototype */ {

  recordType: 'XM.ProjectImage',

  isDocumentAssignment: true,
  
  relations: [{
    type: Backbone.HasOne,
    key: 'image',
    relatedModel: 'XM.ImageInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectUrl = XT.Model.extend(
  /** @scope XM.ProjectUrl.prototype */ {

  recordType: 'XM.ProjectUrl',

  isDocumentAssignment: true,
  
  relations: [{
    type: Backbone.HasOne,
    key: 'url',
    relatedModel: 'XM.Url'
  }]
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectProject = XT.Model.extend(
  /** @scope XM.ProjectProject.prototype */ {

  recordType: 'XM.ProjectProject',

  isDocumentAssignment: true,
  
  relations: [{
    type: Backbone.HasOne,
    key: 'project',
    relatedModel: 'XM.ProjectInfo'
  }]
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectRecurrence = XT.Model.extend(
  /** @scope XM.ProjectRecurrence.prototype */ {

  recordType: 'XM.ProjectRecurrence'
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectTaskComment = XT.Model.extend(
  /** @scope XM.ProjectTaskComment.prototype */ {

  recordType: 'XM.ProjectTaskComment',
  
});

/**
  @class
  
  @extends XT.Model
*/
XM.ProjectInfo = XT.Model.extend(
  /** @scope XM.ProjectInfo.prototype */ {

  recordType: 'XM.ProjectInfo',
  
  relations: [{
    type: Backbone.HasOne,
    key: 'account',
    relatedModel: 'XM.AccountInfo'
  },{
    type: Backbone.HasOne,
    key: 'owner',
    relatedModel: 'XM.UserAccountInfo'
  },{
    type: Backbone.HasOne,
    key: 'assignedTo',
    relatedModel: 'XM.UserAccountInfo'
  },{
    type: Backbone.HasMany,
    key: 'tasks',
    relatedModel: 'XM.ProjectTask',
    reverseRelation: {
      key: 'project'
    }
  }]
  
});

_.extend(XM.ProjectInfo.prototype, XM.ProjectMixin);

/**
  @class
  
  @extends XT.Collection
*/
XM.ProjectInfoCollection = XT.Collection.extend(
  /** @scope XM.ProjectInfoCollection.prototype */ {

  model: XM.ProjectInfo
  
});

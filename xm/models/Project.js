XM.ProjectStatusMixin = 
 /** @scope XM.ProjectStatus */ {
  
  projectStatusString: '',
  
  // ..........................................................
  // METHODS
  //
  
  initMixin: function() {
    this.on('change:status', this.setProjectStatusString); // directly changed
    this.on('statusChange', this.setProjectStatusString); // sync change
    this.setProjectStatusString();
  },
  
  /**
  Return the status attribute as a localized string.
  
  @returns {String}
  */
  setProjectStatusString: function() {
    var status = this.get('status');
    var str = 'Unknown'.loc();
    if (status === 'P') str = 'Concept'.loc();
    else if (status === 'O') str = 'In-Process'.loc();
    else if (status === 'C') str = 'Closed'.loc();
    this.projectStatusString = str;
  }
  
};

/**
  @class
  
  A base class shared by `XM.Project`,`XM.ProjectTask` and potentially other
  project related classes.
*/
XM.ProjectBase = XT.Model.extend(
  /** @scope XM.ProjectBase.prototype */ {
  
  defaults: function() {
    var result = { status: "P" };
    result.owner = result.assignedTo = XM.currentUser;
    return result;
  },
  
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
  
  requiredAttributes: [
    "number",
    "status",
    "name",
    "dueDate"
  ],
  
  // ..........................................................
  // METHODS
  //
  
  initialize: function() {
    XT.Model.prototype.initialize.call(this);
    this.on('change:number', this.numberChanged);
    this.on('statusChange', this.statusChanged);
    this.setProjectStatusString();
    if (this.initMixin) this.initMixin();
  },
  
  statusChanged: function() {
    var K = XT.Model;
    if (this.getStatus() === K.READY_CLEAN) {
      this.setReadOnly('number');
    } 
  },
  
  numberChanged: function() {
    var number = this.get('number');
    var upper = number.toUpperCase();
    if (number !== upper) {
      this.set('number', upper);
    }
  }
  
});

/**
  @class
  
  @extends XM.ProjectBase
  @extends XM.ProjectStatusMixin
*/
XM.Project = XM.ProjectBase.extend(
  /** @scope XM.Project.prototype */ {

  recordType: 'XM.Project',

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
  }],
  
  budgetedHoursTotal: 0.0,
  actualHoursTotal: 0.0,
  balanceHoursTotal: 0.0,
  budgetedExpensesTotal: 0.0,
  actualExpensesTotal: 0.0,
  balanceExpensesTotal: 0.0,
  
  // ..........................................................
  // METHODS
  //
  
  initialize: function() {
    XM.ProjectBase.prototype.initialize.call(this);
    this.on('add:tasks remove:tasks', this.tasksChanged);
  },
  
  /**
  Recaclulate task hours and expense totals.
  */
  tasksChanged: function() {
    var that = this;
    this.budgetedHoursTotal = 0.0;
    this.actualHoursTotal = 0.0;
    this.budgetedExpensesTotal = 0.0;
    this.actualExpensesTotal = 0.0;
    
    // total up task data
    // TODO: Use XT.Math object to handle rounding correctly
    _.each(this.get('tasks').models, function(task) {
      that.budgetedHoursTotal += task.get('budgetedHours');
      that.actualHoursTotal += task.get('actualHours');
      that.budgetedExpensesTotal += task.get('budgetedExpenses');
      that.actualExpensesTotal += task.get('actualExpenses');
    });
    
    this.actualHoursBalance = this.budgetedHoursTotal - 
                              this.actualHoursTotal;
    this.balanceExpensesTotal = this.budgetedExpensesTotal - 
                                this.actualExpensesTotal;
  }
  
});

XM.Project = XM.Project.extend(XM.ProjectStatusMixin);

/**
  @class
  
  @extends XM.ProjectBase
  @extends XM.ProjectStatusMixin
*/
XM.ProjectTask = XM.ProjectBase.extend(
  /** @scope XM.ProjectTask.prototype */ {

  recordType: 'XM.ProjectTask',
  
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
      key: 'projectTask'
    }
  }],
  
  // ..........................................................
  // METHODS
  //
  
  initialize: function() {
   XM.ProjectBase.prototype.initialize.call(this);
   var evt = 'change:budgetedHours change:actualHours ' +
             'change:budgetedExpenses change:actualExpenses';
    this.on(evt, this.valuesChanged);
  },
  
  /**
  Update project totals when values change.
  */
  valuesChanged: function() {
    this.get('project').tasksChanged();
  }

});

XM.ProjectTask = XM.ProjectTask.extend(XM.ProjectStatusMixin);

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
  @extends XM.ProjectStatusMixin
*/
XM.ProjectInfo = XT.Model.extend(
  /** @scope XM.ProjectInfo.prototype */ {

  recordType: 'XM.ProjectInfo',
  
  readOnly: true,
  
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
  }]
  
});

XM.ProjectInfo = XM.ProjectInfo.extend(XM.ProjectStatusMixin);

/**
  @class
  
  @extends XT.Collection
*/
XM.ProjectInfoCollection = XT.Collection.extend(
  /** @scope XM.ProjectInfoCollection.prototype */ {

  model: XM.ProjectInfo
  
});

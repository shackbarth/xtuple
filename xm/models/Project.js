/**
  @class
  
  A base class shared by project models that share common project status
  functionality.
  
  @extends XT.Model
*/
XM.ProjectStatus = XT.Model.extend(
  /** @scope XM.ProjectStatus.prototype */ {
  
  projectStatusString: '',
  
  // ..........................................................
  // METHODS
  //
  
  initMixin: function() {
    this.on('change:status', this.projectStatusChanged); // directly changed
    this.on('statusChange', this.projectStatusChanged); // sync change
    this.projectStatusChanged();
  },
  
  /**
  Update the project status string to a localized value.
  
  @returns {String}
  */
  projectStatusChanged: function() {
    var K = XM.Project;
    var status = this.get('status');
    var str = 'Unknown'.loc();
    if (status === K.CONCEPT) str = '_concept'.loc();
    else if (status === K.IN_PROCESS) str = '_inProcess'.loc();
    else if (status === K.COMPLETED) str = '_completed'.loc();
    this.projectStatusString = str;
  }
  
});

/**
  @class
  
  A base class shared by `XM.Project`,`XM.ProjectTask` and potentially other
  project related classes.
  
  @extends XM.ProjectStatus
*/
XM.ProjectBase = XM.ProjectStatus.extend(
  /** @scope XM.ProjectBase.prototype */ {
  
  defaults: function() {
    var K = XM.Project;
    var result = { status: K.CONCEPT };
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
    XM.ProjectStatus.prototype.initialize.apply(this, arguments);
    this.on('change:number', this.numberChanged);
    this.on('change:status', this.projectStatusChanged);
    this.on('statusChange', this.statusChanged);
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
  },
  
  projectStatusChanged: function() {
    XM.ProjectStatus.prototype.projectStatusChanged.call(this);
    var status = this.get('status');
    var date;
    var K = XM.Project;
    if (this.isDirty()) {
      date = new Date().toISOString();
      if (status === K.IN_PROCESS && !this.get('assignDate')) {
        this.set('assignDate', date);
      } else if (status === K.COMPLETED && !this.get('completeDate')) {
        this.set('completeDate', date);
      }
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
  
  /**
  Return a copy of this project with a given number and date offset.
  
  @param {String} Project number
  @param {Offset} Days to offset due date(s).
  @returns {XM.Project}
  */
  copy: function(number, offset) {
    return XM.Project.copy(this, number, offset);
  },
  
  
  initialize: function() {
    XM.ProjectBase.prototype.initialize.apply(this, arguments);
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

// ..........................................................
// CLASS METHODS
//

_.extend(XM.Project,
  /** @scope XM.Project */ {
    
  /**
  Return a copy of this project with a given number and date offset.

  @param {XM.Project} Project
  @param {String} Project number
  @param {Number} Due date offset
  @return {XM.Project} copy of the project
  */
  copy: function(project, number, offset) {
    if ((project instanceof XM.Project) === false) {
      console.log("Passed object must be an instance of 'XM.Project'");
      return false;
    }
    if (number === undefined) {
      console.log("Number is required");
      return false;
    }
    var obj;
    var prop;
    var i;
    var dueDate = new Date(project.get('dueDate').valueOf());
    var idAttribute = XM.Project.prototype.idAttribute;
    var keys;
    offset = offset || 0;
    dueDate.setDate(dueDate.getDate() + offset);     
         
    // Deep copy the project and fix up
    obj = project.parse(JSON.parse(JSON.stringify(project.toJSON())));
    _.extend(obj, {
      number: number,
      dueDate: dueDate
    });
    delete obj[idAttribute];
    delete obj.status;
    delete obj.comments;
    delete obj.recurrences;
    
    // Fix up tasks
    idAttribute = XM.ProjectTask.prototype.idAttribute;
    if (obj.tasks) {
      _.each(obj.tasks, function(task) {
        delete task[idAttribute];
        delete task.status;
        delete task.comments;
        delete task.alarms;
        dueDate = new Date(task.dueDate.valueOf());
        dueDate.setDate(dueDate.getDate() + offset);
      });
    }
    
    // Fix up remaining arrays
    for (prop in obj) {
      if (prop !== 'tasks' && _.isArray(obj[prop])) {
        idAttribute = project.get(prop).model.prototype.idAttribute;
        for (i = 0; i < obj[prop].length; i++) {
          delete obj[prop][i][idAttribute];
        }
      }
    }
    
    return new XM.Project(obj, {isNew: true});
  },


// ..........................................................
// CONSTANTS
//

  /**
  Concept status for project.

  @static
  @constant
  @type String
  @default P
  */
  CONCEPT: 'P',

  /**
  In-Process status for project.

  @static
  @constant
  @type String
  @default O
  */
  IN_PROCESS: 'O',

  /**
  Completed status for project.
  @static
  @constant
  @type String
  @default C
  */
  COMPLETED: 'C'
  
});


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
  
  @extends XM.ProjectStatus
*/
XM.ProjectInfo = XM.ProjectStatus.extend(
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


/**
  @class
  
  @extends XT.Collection
*/
XM.ProjectInfoCollection = XT.Collection.extend(
  /** @scope XM.ProjectInfoCollection.prototype */ {

  model: XM.ProjectInfo
  
});

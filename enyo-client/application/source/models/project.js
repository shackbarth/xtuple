/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @namespace

    A mixin shared by project models that share common project status
    functionality.
  */
  XM.ProjectStatus = {
    /** @scope XM.ProjectStatus */

    /**
    Returns project status as a localized string.

    @returns {String}
    */
    getProjectStatusString: function () {
      var K = XM.Project,
        status = this.get('status');
      if (status === K.CONCEPT) {
        return '_concept'.loc();
      }
      if (status === K.IN_PROCESS) {
        return '_inProcess'.loc();
      }
      if (status === K.COMPLETED) {
        return '_completed'.loc();
      }
    },

    isActive: function () {
      var K = XM.Project,
        status = this.get('status');
      return (status !== K.COMPLETED);
    }

  };

  /**
    @class

    A base class shared by `XM.Project`,`XM.ProjectTask` and potentially other
    project related classes.

    @extends XM.Document
    @extends XM.ProjectStatus
  */
  XM.ProjectBase = XM.Document.extend({
    /** @scope XM.ProjectBase.prototype */

    defaults: function () {
      var K = XM.Project,
        result = { status: K.CONCEPT };
      return result;
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

    bindEvents: function () {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on('change:status', this.projectStatusDidChange);
      this.statusDidChange();
    },

    statusDidChange: function () {
      var K = XM.Model,
        isReadOnly = this.getStatus() !== K.READY_NEW;
      this.setReadOnly('number', isReadOnly);
    },

    /**
    Reimplemented to handle automatic date setting.
    */
    projectStatusDidChange: function () {
      var status = this.get('status'),
        date,
        K = XM.Project;
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

  // Add in project status mixin
  XM.ProjectBase = XM.ProjectBase.extend(XM.ProjectStatus);

  /**
    @class

    @extends XM.ProjectBase
    @extends XM.ProjectStatusMixin
  */
  XM.Project = XM.ProjectBase.extend({
    /** @scope XM.Project.prototype */

    recordType: 'XM.Project',

    defaults: function () {
      var result = XM.ProjectBase.prototype.defaults.call(this);
      result.owner = result.assignedTo = XM.currentUser;
      return result;
    },

    budgetedHoursTotal: 0.0,
    actualHoursTotal: 0.0,
    balanceHoursTotal: 0.0,
    budgetedExpensesTotal: 0.0,
    actualExpensesTotal: 0.0,
    balanceExpensesTotal: 0.0,

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.ProjectBase.prototype.bindEvents.apply(this, arguments);
      this.on('add:tasks remove:tasks', this.tasksDidChange);
    },

    /**
    Return a copy of this project with a given number and date offset.
    Accepted options are:
      number: Project number
      offset: Due date offset

    @param {Object} Options
    @returns {XM.Project}
    */
    copy: function (options) {
      return XM.Project.copy(this, options);
    },

    /**
    Recaclulate task hours and expense totals.
    */
    tasksDidChange: function () {
      var that = this,
        changed;
      this.budgetedHoursTotal = 0.0;
      this.actualHoursTotal = 0.0;
      this.budgetedExpensesTotal = 0.0;
      this.actualExpensesTotal = 0.0;

      // Total up task data
      _.each(this.get('tasks').models, function (task) {
        that.budgetedHoursTotal = XT.math.add(that.budgetedHoursTotal,
          task.get('budgetedHours'), XT.QTY_SCALE);
        that.actualHoursTotal = XT.math.add(that.actualHoursTotal,
          task.get('actualHours'), XT.QTY_SCALE);
        that.budgetedExpensesTotal = XT.math.add(that.budgetedExpensesTotal,
          task.get('budgetedExpenses'), XT.MONEY_SCALE);
        that.actualExpensesTotal = XT.math.add(that.actualExpensesTotal,
          task.get('actualExpenses'), XT.MONEY_SCALE);
      });
      this.balanceHoursTotal = XT.math.subtract(this.budgetedHoursTotal,
        this.actualHoursTotal, XT.QTY_SCALE);
      this.balanceExpensesTotal = XT.math.subtract(this.budgetedExpensesTotal,
        this.actualExpensesTotal, XT.QTY_SCALE);

      // Notify change
      changed = {
        budgetedHoursTotal: this.budgetedHoursTotal,
        actualHoursTotal: this.actualHoursTotal,
        budgetedExpensesTotal: this.budgetedExpensesTotal,
        actualExpensesTotal: this.actualExpensesTotal,
        balanceHoursTotal: this.balanceHoursTotal,
        balanceExpensesTotal: this.balanceExpensesTotal
      };
      this.trigger("change", this, changed);
    }

  });

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.Project, {
    /** @scope XM.Project */

    /**
    Return a copy of this project with a given number and date offset.
    Accepted options are:
      number: Project number
      offset: Due date offset

    @param {XM.Project} Project
    @param {Object} Options
    @return {XM.Project} copy of the project
    */
    copy: function (project, options) {
      var number = options.number,
        offset = options.offset;
      if ((project instanceof XM.Project) === false) {
        console.log("Passed object must be an instance of 'XM.Project'");
        return false;
      }
      if (number === undefined) {
        console.log("Number is required");
        return false;
      }
      var obj,
        prop,
        i,
        dueDate = new Date(project.get('dueDate').valueOf()),
        idAttribute = XM.Project.prototype.idAttribute,
        result;
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
        _.each(obj.tasks, function (task) {
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
        if (obj.hasOwnProperty(prop)  && prop !== 'tasks' &&
            _.isArray(obj[prop])) {
          idAttribute = project.get(prop).model.prototype.idAttribute;
          for (i = 0; i < obj[prop].length; i += 1) {
            delete obj[prop][i][idAttribute];
          }
        }
      }

      result = new XM.Project(obj, {isNew: true});
      result.documentKeyDidChange();
      return result;
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
  XM.ProjectTask = XM.ProjectBase.extend({
    /** @scope XM.ProjectTask.prototype */

    recordType: 'XM.ProjectTask',

    enforceUpperKey: false,

    /**
      Add required project field to the existing requiredAttributes
      fields array inherited from ProjectBase.
     */
    initialize: function (attributes, options) {
      XM.ProjectBase.prototype.initialize.apply(this, arguments);
      this.requiredAttributes.push("project");
    },

    defaults: function () {
      var result = XM.ProjectBase.prototype.defaults.call(this);
      _.extend(result, {
        actualExpenses: 0,
        actualHours: 0,
        budgetedExpenses: 0,
        budgetedHours: 0
      });
      return result;
    },

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.ProjectBase.prototype.bindEvents.apply(this, arguments);
      var event = 'change:budgetedHours change:actualHours ' +
                  'change:budgetedExpenses change:actualExpenses';
      this.on(event, this.valuesDidChange);
      this.on('change:project', this.projectDidChange);
    },

    /**
      Set defaults from project.
    */
    projectDidChange: function () {
      var project = this.get('project'),
        K = XM.Model,
        status = this.getStatus();
      if (project && status === K.READY_NEW) {
        this.set('owner', this.get('owner') || project.get('owner'));
        this.set('assignedTo', this.get('owner') || project.get('assignedTo'));
        this.set('startDate', this.get('startDate') || project.get('startDate'));
        this.set('assignDate', this.get('assignDate') || project.get('assignDate'));
        this.set('dueDate', this.get('dueDate') || project.get('dueDate'));
        this.set('completeDate', this.get('completeDate') || project.get('completeDate'));
      }
    },

    /**
      Update project totals when values change.
    */
    valuesDidChange: function () {
      var project = this.get('project');
      if (project && project.tasksDidChange) {
        project.tasksDidChange();
      }
    }

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.ProjectComment = XM.Comment.extend({
    /** @scope XM.ProjectComment.prototype */

    recordType: 'XM.ProjectComment',

    sourceName: 'J'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectAccount = XM.Model.extend({
    /** @scope XM.ProjectAccount.prototype */

    recordType: 'XM.ProjectAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectContact = XM.Model.extend({
    /** @scope XM.ProjectContact.prototype */

    recordType: 'XM.ProjectContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectItem = XM.Model.extend({
    /** @scope XM.ProjectItem.prototype */

    recordType: 'XM.ProjectItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectFile = XM.Model.extend({
    /** @scope XM.ProjectFile.prototype */

    recordType: 'XM.ProjectFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectUrl = XM.Model.extend({
    /** @scope XM.ProjectUrl.prototype */

    recordType: 'XM.ProjectUrl'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectProject = XM.Model.extend({
    /** @scope XM.ProjectProject.prototype */

    recordType: 'XM.ProjectProject',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectRecurrence = XM.Model.extend({
    /** @scope XM.ProjectRecurrence.prototype */

    recordType: 'XM.ProjectRecurrence'

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.ProjectTaskComment = XM.Comment.extend({
    /** @scope XM.ProjectTaskComment.prototype */

    recordType: 'XM.ProjectTaskComment',

    sourceName: 'TA'

  });

  /**
    @class

    @extends XM.Alarm
  */
  XM.ProjectTaskAlarm = XM.Alarm.extend({
    /** @scope XM.ProjectTaskAlarm.prototype */

    recordType: 'XM.ProjectTaskAlarm'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ProjectRelation = XM.Info.extend({
    /** @scope XM.ProjectRelation.prototype */

    recordType: 'XM.ProjectRelation',

    editableModel: 'XM.Project'

  });

  XM.ProjectRelation = XM.ProjectRelation.extend(XM.ProjectStatus);

  /**
    @class

    @extends XM.Info
  */
  XM.ProjectTaskRelation = XM.Info.extend({
    /** @scope XM.Task.prototype */

    recordType: 'XM.ProjectTaskRelation',

    editableModel: 'XM.ProjectTask'

  });

  /**
    @class

    @extends XM.Info
    @extends XM.ProjectStatus
  */
  XM.ProjectListItem = XM.Info.extend({
    /** @scope XM.ProjectListItem.prototype */

    recordType: 'XM.ProjectListItem',

    editableModel: 'XM.Project'

  });

  XM.ProjectListItem = XM.ProjectListItem.extend(XM.ProjectStatus);


  /**
    @class

    @extends XM.ProjectTask
  */
  XM.Task = XM.ProjectTask.extend({
    /** @scope XM.Task.prototype */

    recordType: 'XM.Task',

    statusDidChange: function () {
      XM.ProjectTask.prototype.statusDidChange.apply(this, arguments);
      if (this.getStatus() === XM.Model.READY_CLEAN) {
        this.setReadOnly("project");
      }
    }

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.TaskComment = XM.Comment.extend({
    /** @scope XM.ProjectTaskComment.prototype */

    recordType: 'XM.TaskComment',

    sourceName: 'TA'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.TaskRelation = XM.Info.extend({
    /** @scope XM.ProjectTaskListItem.prototype */

    recordType: 'XM.TaskRelation',

    editableModel: 'XM.Task'

  });

  /**
    @class

    @extends XM.Info
    @extends XM.ProjectStatus
  */
  XM.TaskListItem = XM.Info.extend({
    /** @scope XM.ProjectTaskListItem.prototype */

    recordType: 'XM.TaskListItem',

    editableModel: 'XM.Task'

  });

  XM.TaskListItem = XM.TaskListItem.extend(XM.ProjectStatus);


  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.ProjectListItemCollection = XM.Collection.extend({
    /** @scope XM.ProjectListItemCollection.prototype */

    model: XM.ProjectListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ProjectRelationCollection = XM.Collection.extend({
    /** @scope XM.ProjectRelationCollection.prototype */

    model: XM.ProjectRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.TaskListItemCollection = XM.Collection.extend({
    /** @scope XM.ProjectTaskListItemCollection.prototype */

    model: XM.TaskListItem

  });

}());

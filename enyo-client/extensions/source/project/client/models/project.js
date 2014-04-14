/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.project.initProjectModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.ProjectEmailProfile = XM.Document.extend(
      /** @scope XM.ProjectEmailProfile.prototype */ {

      recordType: "XM.ProjectEmailProfile",

      documentKey: "name"

    });

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
          result = {
            status: K.CONCEPT,
            priority: XT.session.settings.get("DefaultPriority"),
            percentComplete: 0
          };
        return result;
      },

      // ..........................................................
      // METHODS
      //

      bindEvents: function () {
        XM.Document.prototype.bindEvents.apply(this, arguments);
        this.on("change:status", this.projectStatusDidChange);
        this.on("change:percentComplete", this.percentCompleteDidChange);
        this.statusDidChange();
      },

      statusDidChange: function () {
        var K = XM.Model,
          isReadOnly = this.getStatus() !== K.READY_NEW;
        this.setReadOnly("number", isReadOnly);
      },

      /**
        Reimplemented to handle automatic date setting.
      */
      percentCompleteDidChange: function () {
        var percentComplete = this.get("percentComplete");
        if (percentComplete >= 1) {
          this.set("status", XM.Project.COMPLETED);
        }
      },

      /**
      Reimplemented to handle automatic date setting.
      */
      projectStatusDidChange: function () {
        var status = this.get("status"),
          date = new Date(),
          K = XM.Project;
        if (status === K.IN_PROCESS && !this.get("assignDate")) {
          this.set("assignDate", date);
        } else if (status === K.COMPLETED) {
          if (!this.get("completeDate")) {
            this.set("completeDate", date);
          }
          this.off("change:percentComplete", this.percentCompleteDidChange);
          this.set("percentComplete", 1);
          this.on("change:percentComplete", this.percentCompleteDidChange);
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

      recordType: "XM.Project",

      defaults: function () {
        var result = XM.ProjectBase.prototype.defaults.call(this);

        result.owner = result.assignedTo = XM.currentUser;
        return _.extend(result, {
          assignedTo: XM.currentUser,
          owner: XM.currentUser,
          budgetedHoursTotal: 0.0,
          actualHoursTotal: 0.0,
          balanceHoursTotal: 0.0,
          budgetedExpensesTotal: 0.0,
          actualExpensesTotal: 0.0,
          balanceExpensesTotal: 0.0
        });
      },

      readOnlyAttributes: [
        "actualExpensesTotal",
        "actualHoursTotal",
        "balanceExpensesTotal",
        "balanceHoursTotal",
        "budgetedExpensesTotal",
        "budgetedHoursTotal"
      ],

      // ..........................................................
      // METHODS
      //

      bindEvents: function () {
        XM.ProjectBase.prototype.bindEvents.apply(this, arguments);
        this.on("add:tasks remove:tasks", this.tasksDidChange);
        this.on("change:projectType", this.projectTypeDidChange);
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

      projectTypeDidChange: function () {
        this.inheritWorkflowSource(this.get("projectType"), "XM.ProjectCharacteristic",
          "XM.ProjectWorkflow");
      },

      /**
      Recaclulate task hours and expense totals.
      */
      tasksDidChange: function () {
        var that = this,
          changed,
          budgetedHoursTotal = 0.0,
          actualHoursTotal = 0.0,
          budgetedExpensesTotal = 0.0,
          actualExpensesTotal = 0.0,
          balanceHoursTotal,
          balanceExpensesTotal;

        // Total up task data
        _.each(this.get("tasks").models, function (task) {
          budgetedHoursTotal = XT.math.add(budgetedHoursTotal,
            task.get("budgetedHours"), XT.QTY_SCALE);
          actualHoursTotal = XT.math.add(actualHoursTotal,
            task.get("actualHours"), XT.QTY_SCALE);
          budgetedExpensesTotal = XT.math.add(budgetedExpensesTotal,
            task.get("budgetedExpenses"), XT.MONEY_SCALE);
          actualExpensesTotal = XT.math.add(actualExpensesTotal,
            task.get("actualExpenses"), XT.MONEY_SCALE);
        });
        balanceHoursTotal = XT.math.subtract(budgetedHoursTotal,
          actualHoursTotal, XT.QTY_SCALE);
        balanceExpensesTotal = XT.math.subtract(budgetedExpensesTotal,
          actualExpensesTotal, XT.QTY_SCALE);

        this.set({
          budgetedHoursTotal: budgetedHoursTotal,
          actualHoursTotal: actualHoursTotal,
          budgetedExpensesTotal: budgetedExpensesTotal,
          actualExpensesTotal: actualExpensesTotal,
          balanceHoursTotal: balanceHoursTotal,
          balanceExpensesTotal: balanceExpensesTotal
        });
      }

    });

    // Add support for sending email
    XM.Project = XM.Project.extend(XM.EmailSendMixin);
    XM.Project = XM.Project.extend({
      emailDocumentName: "_project".loc(),
      emailProfileAttribute: "projectType.emailProfile",
      emailStatusMethod: "getProjectStatusString",
      /**
        Build "to" addresses for dirty tasks  as well
      */
      buildToString: function (toAddresses) {
        var tasks = this.get("tasks"),
          K = XM.EmailSendMixin,
          that = this;

        // Add project task users to email
        _.each(tasks.models, function (task) {
          if (task.isDirty()) {
            toAddresses = K.buildToString.call(task, toAddresses);
          }
        });

        return K.buildToString.call(this, toAddresses);
      }
    });
    _.extend(XM.Project.prototype, XM.WorkflowMixin);

    // ..........................................................
    // CLASS METHODS
    //

    _.extend(XM.Project, XM.ProjectStatusMixin, {
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
          dueDate = new Date(project.get("dueDate").valueOf()),
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
          if (obj.hasOwnProperty(prop)  && prop !== "tasks" &&
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
      }

    });

    XM.ProjectRelation.prototype.editableModel = "XM.Project";

    /**
      @class

      @extends XM.ProjectBase
    */
    XM.ProjectTask = XM.ProjectBase.extend({
      /** @scope XM.ProjectTask.prototype */

      recordType: "XM.ProjectTask",

      enforceUpperKey: false,

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
        var event = "change:budgetedHours change:actualHours " +
                    "change:budgetedExpenses change:actualExpenses";
        this.on(event, this.valuesDidChange);
        this.on("change:project", this.projectDidChange);
      },

      getProjectTaskStatusString: function () {
        return XM.ProjectStatus.getProjectStatusString.call(this);
      },

      /**
        Set defaults from project.
      */
      projectDidChange: function () {
        var project = this.get("project"),
          K = XM.Model,
          status = this.getStatus();
        if (project && status === K.READY_NEW) {
          this.set("owner", this.get("owner") || project.get("owner"));
          this.set("assignedTo", this.get("owner") || project.get("assignedTo"));
          this.set("startDate", this.get("startDate") || project.get("startDate"));
          this.set("assignDate", this.get("assignDate") || project.get("assignDate"));
          this.set("dueDate", this.get("dueDate") || project.get("dueDate"));
          this.set("completeDate", this.get("completeDate") || project.get("completeDate"));
        }
      },

      /**
        Update project totals when values change.
      */
      valuesDidChange: function () {
        var project = this.get("project");
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

      recordType: "XM.ProjectComment",

      sourceName: "J"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectAccount = XM.Model.extend({
      /** @scope XM.ProjectAccount.prototype */

      recordType: "XM.ProjectAccount",

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectContact = XM.Model.extend({
      /** @scope XM.ProjectContact.prototype */

      recordType: "XM.ProjectContact",

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectItem = XM.Model.extend({
      /** @scope XM.ProjectItem.prototype */

      recordType: "XM.ProjectItem",

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectFile = XM.Model.extend({
      /** @scope XM.ProjectFile.prototype */

      recordType: "XM.ProjectFile",

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectUrl = XM.Model.extend({
      /** @scope XM.ProjectUrl.prototype */

      recordType: "XM.ProjectUrl"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectProject = XM.Model.extend({
      /** @scope XM.ProjectProject.prototype */

      recordType: "XM.ProjectProject",

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectCustomer = XM.Model.extend(
      /** @scope XM.ProjectCustomer.prototype */ {

      recordType: "XM.ProjectCustomer",

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectRecurrence = XM.Model.extend({
      /** @scope XM.ProjectRecurrence.prototype */

      recordType: "XM.ProjectRecurrence"

    });

    /**
      @class

      @extends XM.Comment
    */
    XM.ProjectTaskComment = XM.Comment.extend({
      /** @scope XM.ProjectTaskComment.prototype */

      recordType: "XM.ProjectTaskComment",

      sourceName: "TA"

    });

    /**
      @class

      @extends XM.Alarm
    */
    XM.ProjectTaskAlarm = XM.Alarm.extend({
      /** @scope XM.ProjectTaskAlarm.prototype */

      recordType: "XM.ProjectTaskAlarm"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ProjectTaskRelation = XM.Info.extend({
      /** @scope XM.ProjctTaskRelation.prototype */

      recordType: "XM.ProjectTaskRelation",

      editableModel: "XM.ProjectTask"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.TaskRelation = XM.Info.extend({
      /** @scope XM.ProjectTaskListItem.prototype */

      recordType: "XM.TaskRelation",

      editableModel: "XM.Task"

    });

      /**
      @class

      @extends XM.Info
    */
    XM.TaskProjectRelation = XM.Info.extend({
      /** @scope XM.TaskProjectRelation.prototype */

      recordType: "XM.TaskProjectRelation"

    });

    /**
      @class

      @extends XM.Workflow
    */
    XM.ProjectWorkflow = XM.Workflow.extend(
      /** @scope XM.ProjectWorkflow.prototype */ {

      recordType: "XM.ProjectWorkflow",

      getProjectWorkflowStatusString: function () {
        return XM.ProjectWorkflow.prototype.getWorkflowStatusString.call(this);
      }

    });

    /**
      @class

      @extends XM.Workflow
    */
    XM.ProjectWorkflowRelation = XM.Info.extend(
      /** @scope XM.ProjectWorkflow.prototype */ {

      recordType: "XM.ProjectWorkflowRelation",

      editableModel: "XM.ProjectWorkflow"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectIncident = XM.Model.extend(
      /** @scope XM.ProjectIncident.prototype */ {

      recordType: "XM.ProjectIncident",

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectOpportunity = XM.Model.extend(
      /** @scope XM.ProjectOpportunity.prototype */ {

      recordType: "XM.ProjectOpportunity",

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectToDo = XM.Model.extend(
      /** @scope XM.ProjectToDo.prototype */ {

      recordType: "XM.ProjectToDo",

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.ProjectCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.ProjectCharacteristic.prototype */ {

      recordType: "XM.ProjectCharacteristic",

      which: "isProjects"

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.ProjectTaskCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.ProjectTaskCharacteristic.prototype */ {

      recordType: "XM.ProjectTaskCharacteristic",

      which: "isTasks"

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.TaskCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.TaskCharacteristic.prototype */ {

      recordType: "XM.TaskCharacteristic",

      which: "isTasks"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.Resource = XM.Model.extend(
      /** @scope XM.Resource.prototype */ {

      recordType: "XM.Resource"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TaskResource = XM.Document.extend(
      /** @scope XM.TaskResource.prototype */ {

      recordType: "XM.TaskResource",

      idAttribute: "uuid",

      documentKey: "uuid",

      defaults: {
        percent: 1
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TaskResourceAnalysis = XM.Model.extend(
      /** @scope XM.TaskResourceAnalysis.prototype */ {

      recordType: "XM.TaskResourceAnalysis",

      idAttribute: "id"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.ProjectEmailProfileCollection = XM.Collection.extend({
      /** @scope XM.ProjectEmailProfileCollection.prototype */

      model: XM.ProjectEmailProfile

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.ResourceCollection = XM.Collection.extend({
      /** @scope XM.ResourceCollection.prototype */

      model: XM.Resource

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.TaskResourceCollection = XM.Collection.extend({
      /** @scope XM.TaskResourceCollection.prototype */

      model: XM.TaskResource

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.TaskResourceAnalysisCollection = XM.Collection.extend({
      /** @scope XM.TaskResourceAnalysisCollection.prototype */

      model: XM.TaskResourceAnalysis

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.TaskListItemCollection = XM.Collection.extend({
      /** @scope XM.ProjectTaskListItemCollection.prototype */

      model: XM.TaskListItem

    });

  };

}());

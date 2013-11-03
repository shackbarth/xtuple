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

      recordType: 'XM.ProjectEmailProfile',

      documentKey: 'name'

    });

    /**
      @class

      @extends XM.Document
    */
    XM.ProjectType = XM.Document.extend(
      /** @scope XM.ProjectType.prototype */ {

      recordType: 'XM.ProjectType',

      documentKey: 'code',

      enforceUpperKey: false,

      defaults: {
        isActive: true
      }

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.ProjectTypeCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.ProjectTypeCharacteristic.prototype */ {

      recordType: 'XM.ProjectTypeCharacteristic'

    });

    /**
      @class

      @extends XM.WorkflowSource
    */
    XM.ProjectTypeWorkflow = XM.WorkflowSource.extend(
      /** @scope XM.ProjectTypeWorkflow.prototype */ {

      recordType: 'XM.ProjectTypeWorkflow'

    });

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

        switch (status)
        {
        case K.CONCEPT:
          return '_concept'.loc();
        case K.REVIEW:
          return '_review'.loc();
        case K.REVISION:
          return '_revision'.loc();
        case K.APPROVED:
          return '_approved'.loc();
        case K.IN_PROCESS:
          return '_inProcess'.loc();
        case K.COMPLETED:
          return '_completed'.loc();
        case K.REJECTED:
          return '_rejected'.loc();
        }
      },

      isActive: function () {
        var K = XM.Project,
          status = this.get('status');
        return (status !== K.COMPLETED && status !== K.REJECTED);
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
        this.on('change:status', this.projectStatusDidChange);
        this.on('change:percentComplete', this.percentCompleteDidChange);
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
      percentCompleteDidChange: function () {
        var percentComplete = this.get('percentComplete');
        if (percentComplete >= 1) {
          this.set("status", XM.Project.COMPLETED);
        }
      },

      /**
      Reimplemented to handle automatic date setting.
      */
      projectStatusDidChange: function () {
        var status = this.get('status'),
          date = new Date(),
          K = XM.Project;
        if (status === K.IN_PROCESS && !this.get('assignDate')) {
          this.set('assignDate', date);
        } else if (status === K.COMPLETED) {
          if (!this.get('completeDate')) {
            this.set('completeDate', date);
          }
          this.off('change:percentComplete', this.percentCompleteDidChange);
          this.set("percentComplete", 1);
          this.on('change:percentComplete', this.percentCompleteDidChange);
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
        this.on('change:projectType', this.projectTypeDidChange);
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
        var projectType = this.get("projectType"),
          charProfile = projectType ? projectType.get("characteristics") : false,
          wfProfile = projectType ? projectType.get("workflow") : false,
          chars = this.get("characteristics"),
          workflow = this.get("workflow"),
          that = this,

          // Copies characteristics from project type to project
          copyCharProfile = function () {
            chars.reset();
            _.each(charProfile.models, function (model) {
              var assignment = new XM.ProjectCharacteristic(null, {isNew: true});
              assignment.set("characteristic", model.get("characteristic"));
              assignment.set("value", model.get("value"));
              chars.add(assignment);
            });
          },

          // Copies workflow from project type to project
          copyWfProfile = function () {
            var map = {};
            workflow.reset();
            _.each(wfProfile.models, function (model) {
              var item = new XM.ProjectWorkflow(null, {isNew: true}),
                id = XT.generateUUID(),
                dueOffset = model.get("dueOffset"),
                startOffset = model.get("startOffset"),
                dueDate,
                startDate;

              map[model.id] = id;

              if (model.get("dueSet")) {
                dueDate = XT.date.today();
                dueDate.setDate(dueDate.getDate() + model.get("dueOffset"));
              }

              if (model.get("startSet")) {
                startDate = XT.date.today();
                startDate.setDate(startDate.getDate() + model.get("startOffset"));
              }

              item.set({
                uuid: id,
                name: model.get("name"),
                description : model.get("description"),
                priority: model.get("priority"),
                startDate: startDate,
                dueDate: dueDate,
                owner: model.get("owner"),
                assignedTo: model.get("assignedTo"),
                sequence: model.get("sequence"),
                notes: model.get("notes"),
                completedParentStatus : model.get("completedParentStatus"),
                deferredParentStatus : model.get("deferredParentStatus"),
                completedSuccessors: model.get("completedSuccessors"),
                deferredSuccessors: model.get("deferredSuccessors")
              });
              workflow.add(item);
            });

            // Reiterate through new collection and fix successor mappings
            _.each(_.keys(map), function (uuid) {
              _.each(workflow.models, function (model) {
                var successors = model.get("completedSuccessors");
                if (_.isString(successors)) {
                  model.set("completedSuccessors", successors.replace(uuid, map[uuid]));
                }
                successors = model.get("deferredSuccessors");
                if (_.isString(successors)) {
                  model.set("deferredSuccessors", successors.replace(uuid, map[uuid]));
                }
              });
            });
          },
          handleWfProfile = function () {
            // Handle copying workflow
            if (wfProfile && wfProfile.length) {
              if (!workflow.length) {
                copyWfProfile();
              } else {
                that.notify("_copyWorkflow?".loc(), {
                  type: XM.Model.QUESTION,
                  callback: function (response) {
                    if (response.answer) {
                      copyWfProfile();
                    }
                  }
                });
              }
            }
          };

        // Handle copying characteristics
        if (charProfile && charProfile.length) {
          if (!chars.length) {
            copyCharProfile();
          } else {
            this.notify("_copyCharacteristics?".loc(), {
              type: XM.Model.QUESTION,
              callback: function (response) {
                if (response.answer) {
                  copyCharProfile();
                }
                handleWfProfile();
              }
            });
            return;
          }
        }
        handleWfProfile();
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
          if (task.isDirty) {
            toAddresses = K.buildToString.call(task, toAddresses);
          }
        });
        
        return K.buildToString.call(this, toAddresses);
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
        Review status for project.

        @static
        @constant
        @type String
        @default R
      */
      REVIEW: 'R',

      /**
        Revision status for project.

        @static
        @constant
        @type String
        @default V
      */
      REVISION: 'V',

      /**
        Approved status for project.

        @static
        @constant
        @type String
        @default A
      */
      APPROVED: 'A',

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
      COMPLETED: 'C',

      /**
        Rejected status for project.
        @static
        @constant
        @type String
        @default J
      */
      REJECTED: 'J'

    });

    /**
      @class

      @extends XM.ProjectBase
    */
    XM.ProjectTask = XM.ProjectBase.extend({
      /** @scope XM.ProjectTask.prototype */

      recordType: 'XM.ProjectTask',

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
        var event = 'change:budgetedHours change:actualHours ' +
                    'change:budgetedExpenses change:actualExpenses';
        this.on(event, this.valuesDidChange);
        this.on('change:project', this.projectDidChange);
      },

      getProjectTaskStatusString: function () {
        return XM.ProjectStatus.getProjectStatusString.call(this);
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
    XM.ProjectCustomer = XM.Model.extend(
      /** @scope XM.ProjectCustomer.prototype */ {

      recordType: 'XM.ProjectCustomer',

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
    */
    XM.TaskProjectRelation = XM.Info.extend({
      /** @scope XM.TaskProjectRelation.prototype */

      recordType: 'XM.TaskProjectRelation'

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

    /**
      @class

      @extends XM.Workflow
    */
    XM.ProjectWorkflow = XM.Workflow.extend(
      /** @scope XM.ProjectWorkflow.prototype */ {

      recordType: 'XM.ProjectWorkflow',

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

      recordType: 'XM.ProjectWorkflowRelation',

      editableModel: 'XM.ProjectWorkflow'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectIncident = XM.Model.extend(
      /** @scope XM.ProjectIncident.prototype */ {

      recordType: 'XM.ProjectIncident',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectOpportunity = XM.Model.extend(
      /** @scope XM.ProjectOpportunity.prototype */ {

      recordType: 'XM.ProjectOpportunity',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectToDo = XM.Model.extend(
      /** @scope XM.ProjectToDo.prototype */ {

      recordType: 'XM.ProjectToDo',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.ProjectCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.ProjectCharacteristic.prototype */ {

      recordType: 'XM.ProjectCharacteristic'

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.ProjectListItemCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.ProjectListItemCharacteristic.prototype */ {

      recordType: 'XM.ProjectListItemCharacteristic'

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.ProjectTaskCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.ProjectTaskCharacteristic.prototype */ {

      recordType: 'XM.ProjectTaskCharacteristic'

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.TaskCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.TaskCharacteristic.prototype */ {

      recordType: 'XM.TaskCharacteristic'

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.TaskListItemCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.TaskListItemCharacteristic.prototype */ {

      recordType: 'XM.TaskListItemCharacteristic'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.Resource = XM.Model.extend(
      /** @scope XM.Resource.prototype */ {

      recordType: 'XM.Resource'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TaskResource = XM.Document.extend(
      /** @scope XM.TaskResource.prototype */ {

      recordType: 'XM.TaskResource',

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

      recordType: 'XM.TaskResourceAnalysis',

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
    XM.ProjectTypeCollection = XM.Collection.extend({
      /** @scope XM.ProjectTypeCollection.prototype */

      model: XM.ProjectType

    });

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

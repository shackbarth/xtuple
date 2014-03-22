/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    An abstract class for handling workflow models.

    @extends XM.Model
  */
  XM.Workflow = XM.Model.extend(
    /** @lends XM.Workflow# */{

    // By default, the completedParentStatus and deferredParentStatus
    // values should drive a change to the status of the parent, but
    // we allow it to drive a change to any other attribute of the parent
    // if this field is overwritten by a submodel
    parentStatusAttribute: 'status',

    defaults: function () {
      return {
        owner: XM.currentUser,
        assignedTo: XM.currentUser,
        status: XM.Workflow.PENDING,
        priority: XT.session.settings.get("DefaultPriority"),
        sequence: 0
      };
    },

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:completeDate', this.completeDateDidChange);
      this.on('change:status', this.workflowStatusDidChange);
    },

    completeDateDidChange: function (model, value, options) {
      var completeDate = this.get("completeDate"),
        K = XM.Workflow;

      // If complete date set, mark completed
      if (completeDate) {
        this.set("status", K.COMPLETED);
      }
    },

    /**
    Returns workflow status as a localized string.

    @returns {String}
    */
    getWorkflowStatusString: function () {
      var K = XM.Workflow,
        status = this.get('status');

      switch (status)
      {
      case K.PENDING:
        return '_pending'.loc();
      case K.IN_PROCESS:
        return '_inProcess'.loc();
      case K.COMPLETED:
        return '_completed'.loc();
      case K.DEFERRED:
        return '_deferred'.loc();
      }
    },

    isActive: function () {
      var status = this.get("status"),
        K = XM.Workflow;
      return status === K.PENDING || status === K.IN_PROCESS;
    },

    workflowStatusDidChange: function (model, value, options) {
      var status = this.get("status"),
        K = XM.Workflow,
        parent,
        parentStatus,
        workflow,
        parentStatusAttribute,
        successors;

      if (status === K.IN_PROCESS) {
        if (!this.get("startDate")) {
          this.set("startDate", XT.date.today());
        }

      // If marked completed
      } else if (status === K.COMPLETED) {

        // Update complete date if applicable
        if (!this.get("completeDate")) {
          this.set("completeDate", XT.date.today());
        }

        parent = this.get("parent");
        workflow = parent.get("workflow");

        // Update parent status if applicable
        parentStatus = this.get("completedParentStatus");
        parentStatusAttribute = workflow.model.prototype.parentStatusAttribute;
        if (parentStatus) {
          parent.set(parentStatusAttribute, parentStatus);
        }

        // Update successor statuses if applicable
        successors = this.get("completedSuccessors") ?
          this.get("completedSuccessors").split(",") :
          [];
        _.each(successors, function (successor) {
          var item = workflow.get(successor),
            status = item && item.get("status");

          if (status === K.PENDING) {
            item.set("status", K.IN_PROCESS);
          }
        });
      } else if (status === K.DEFERRED) {

        parent = this.get("parent");
        workflow = parent.get("workflow");

        // Update parent status if applicable
        parentStatus = this.get("deferredParentStatus");
        parentStatusAttribute = workflow.model.prototype.parentStatusAttribute;
        if (parentStatus) {
          parent.set(parentStatusAttribute, parentStatus);
        }

        // Update successor statuses if applicable
        successors = this.get("deferredSuccessors") ?
          this.get("deferredSuccessors").split(",") :
          [];
        _.each(successors, function (successor) {
          var item = workflow.get(successor),
            status = item.get("status");

          if (status === K.PENDING) {
            item.set("status", K.IN_PROCESS);
          }
        });
      }
    }

  });

  // Workflow status mixin
  XM.Workflow = XM.Workflow.extend(XM.WorkflowStatus);

  _.extend(XM.Workflow,
    /** @lends XM.Workflow# */{

    /**
      Pending status for workflow.

      @static
      @constant
      @type String
      @default P
    */
    PENDING: 'P',

    /**
      Deffered status for workflow.

      @static
      @constant
      @type String
      @default D
    */
    DEFERRED: 'D',

    /**
      In-progress status for workflow.
      @static
      @constant
      @type String
      @default I
    */
    IN_PROCESS: 'I',

    /**
      Completed status for workflow.
      @static
      @constant
      @type String
      @default C
    */
    COMPLETED: 'C'

  });

  /**
    @class

    An abstract class for handling workflow templates.

    @extends XM.Model
  */
  XM.WorkflowSource = XM.Model.extend(
    /** @lends XM.WorkflowSource# */ {

    defaults: function () {
      return {
        status: XM.Workflow.PENDING,
        startSet: false,
        startOffset: 0,
        dueSet: false,
        dueOffset: 0,
        priority: XT.session.settings.get("DefaultPriority"),
        sequence: 0
      };
    },

    readOnlyAttributes: [
      "dueOffset",
      "startOffset"
    ],

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:dueSet', this.dueSetDidChange);
      this.on('change:startSet', this.startSetDidChange);
      this.on('statusChange', this.statusDidChange);
    },

    dueSetDidChange: function () {
      this.setReadOnly("dueOffset", !this.get("dueSet"));
    },

    statusDidChange: function () {
      if (this.getStatus() === XM.Model.READY_CLEAN) {
        this.dueSetDidChange();
        this.startSetDidChange();
      }
    },

    startSetDidChange: function () {
      this.setReadOnly("startOffset", !this.get("startSet"));
    }

  });

  /**
    This mixin is to be used on objects that have workflow model arrays.
  */
  XM.WorkflowMixin = {
    /**
      A helper function to copy workflow templates from a source to the destination object.
    */
    inheritWorkflowSource: function (sourceModel, characteristicClass, workflowClass) {
      var charProfile = sourceModel && characteristicClass ? sourceModel.get("characteristics") : false,
        wfProfile = sourceModel && workflowClass ? sourceModel.get("workflow") : false,
        chars = this.get("characteristics"),
        workflow = this.get("workflow"),
        that = this,
        CharacteristicClass = XT.getObjectByName(characteristicClass),
        WorkflowClass = XT.getObjectByName(workflowClass),

        // Copies characteristics from source to destination
        copyCharProfile = function () {
          chars.reset();
          _.each(charProfile.models, function (model) {
            var assignment = new CharacteristicClass(null, {isNew: true});
            assignment.set("characteristic", model.get("characteristic"));
            assignment.set("value", model.get("value"));
            chars.add(assignment);
          });
        },

        // Copies workflow from source to destination
        copyWfProfile = function () {
          var map = {};
          workflow.reset();
          _.each(wfProfile.models, function (model) {
            var item = new WorkflowClass(null, {isNew: true}),
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
              description: model.get("description"),
              status: model.get("status"),
              workflowType: model.get("workflowType"),
              priority: model.get("priority"),
              startDate: startDate,
              dueDate: dueDate,
              owner: model.get("owner") || item.get("owner"),
              assignedTo: model.get("assignedTo") || item.get("assignedTo"),
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
    }
  };

}());

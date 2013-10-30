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
  XM.Workflow = XM.Model.extend({
    /** @scope XM.Workflow.prototype */


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
      this.on('change:status', this.statusDidChange);
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

    statusDidChange: function (model, value, options) {
      var status = this.get("status"),
        K = XM.Workflow,
        parent,
        parentStatus,
        workflow,
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

        // Update parent status if applicable
        parent = this.get("parent");
        parentStatus = parent.get("parentStatus");
        if (parentStatus) {
          parent.set("status", parentStatus);
        }

        // Update successor statuses if applicable
        workflow = parent.get("workflow");
        successors = (this.get("successors") || "").split(",");
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

  _.extend(XM.Workflow, {
     /** @scope XM.Workflow */

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

}());

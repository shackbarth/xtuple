/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";


  /** @namespace

    A mixin for activity classes that modifies `could` functions to refer to 
    the original class.
  */
  XM.ActivityMixin = {
    // ..........................................................
    // METHODS
    //
    /**
      Returns whether the current record could be created on the editableModel
      based on privilege settings.

      @returns {Boolean}
    */
    couldCreate: function () {
      return false;
    },

    /**
      Returns whether the current record could be read on the editableModel
      based on privilege settings.

      @returns {Boolean}
    */
    couldRead: function () {
      var Klass = XM[this.get("activityType")];
      return Klass.canRead(this);
    },

    /**
      Returns whether the current record could be updated on the editableModel
      based on privilege settings.

      @returns {Boolean}
    */
    couldUpdate: function () {
      var Klass = XM[this.get("activityType")];
      return Klass.canUpdate(this);
    },

    /**
      Returns whether the current record could be deleted on the editableModel
      based on privilege settings.

      @returns {Boolean}
    */
    couldDelete: function () {
      var Klass = XM[this.get("activityType")];
      return Klass.canDelete(this);
    },

    /**
      Returns whether the current record could be destroyed on the editableModel
      based on privilege settings and whether it's used. Requires a callback to the
      server.

      @returns Receiver
    */
    couldDestroy: function (callback) {
      // TODO: Sort this out
      /*
      var Klass = XM[this.get("activityType")];
      Klass.canDestroy(this, callback);
      */
      callback(false);
      return this;
    }
  };

  /** @class

    A combined list of activities that may include to dos, incidents,
    projects, tasks and workflow items.

    @extends XM.Info
  */

  XM.ActivityListItem = XM.Info.extend({
    /** @scope XM.ActivityListItem.prototype */

    recordType: "XM.ActivityListItem",

    getActivityStatusString: function () {
      var type = this.get("activityType"),
        Klass = XM[type],
        functionName = "get" + type + "StatusString",
        fn = Klass.prototype[functionName];
      return fn ? fn.call(this) : this.get("status");
    },

    canReassign: function (callback) {
      var hasPriv,
        privs = XT.session.privileges,
        activityType = this.get("activityType"),
        permissionsMap = {
          Incident: 'MaintainAllIncidents',
          Opportunity: 'MaintainAllOpportunities',
          Project: 'MaintainAllProjects',
          ProjectTask: "MaintainAllProjects",
          ProjectWorkflow: "MaintainAllWorkflows",
          PurchaseOrder: "MaintainPurchaseOrders",
          PurchaseOrderWorkflow: "MaintainAllWorkflows",
          SalesOrder: "MaintainSalesOrders",
          SalesOrderWorkflow: "MaintainAllWorkflows",
          ToDo: "ReassignToDoItems",
          TransferOrder: "MaintainTransferOrders",
          TransferOrderWorkflow: "MaintainAllWorkflows",
          WorkOrder: "MaintainWorkOrders",
          WorkOrderWorkflow: "MaintainAllWorkflows"
        };
 
      hasPriv = privs.get(permissionsMap[activityType]);
      
      if (callback) {
        callback(hasPriv);
      } else {return hasPriv; }
    }

  });

  XM.ActivityListItem = XM.ActivityListItem.extend(XM.ActivityMixin);

  /** @class

    A relation of combined activities that may include to dos, incidents,
    projects, tasks and workflow items.

    @extends XM.Info
  */

  XM.ActivityRelation = XM.Info.extend({
    /** @scope XM.ActivityRelation.prototype */

    recordType: "XM.ActivityRelation"

  });

  XM.ActivityRelation = XM.ActivityRelation.extend(XM.ActivityMixin);

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.ActivityListItemCollection = XM.Collection.extend({
    /** @scope XM.ActivityListItemCollection.prototype */

    model: XM.ActivityListItem

  });


}());

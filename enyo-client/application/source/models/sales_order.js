/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {

  "use strict";

  var CREDIT_OK = 0;
  var CREDIT_WARN = 1;
  var CREDIT_HOLD = 2;
  var _checkCredit = function () {
    var creditStatus = this.getValue("customer.creditStatus"),
      K = XM.Customer,
      privs = XT.session.privileges;

    if (this.isNew() && creditStatus !== K.CREDIT_GOOD) {
      if (creditStatus === K.CREDIT_WARN &&
        !privs.get("CreateSOForWarnCustomer")) {
        return CREDIT_WARN;
      } else if (creditStatus === K.CREDIT_HOLD &&
        !privs.get("CreateSOForHoldCustomer")) {
        return CREDIT_HOLD;
      }
    }
    return CREDIT_OK;
  };

  /**
    @class

    @extends XM.SalesOrderBase
  */
  XM.SalesOrder = XM.SalesOrderBase.extend(
    /** @lends XM.SalesOrder.prototype */{

    recordType: 'XM.SalesOrder',

    nameAttribute: 'number',

    numberPolicySetting: 'CONumberGeneration',

    documentDateKey: "orderDate",


    bindEvents: function () {
      XM.SalesOrderBase.prototype.bindEvents.apply(this, arguments);
      var pricePolicy = XT.session.settings.get("soPriceEffective");
      // TODO: reimplement in inventory
      //this.on('change:packDate', this.packDateDidChange);
      this.on('change:holdType', this.holdTypeDidChange);
    },

    /**
      Add default for wasQuote.
     */
    defaults: function () {
      var defaults = XM.SalesOrderBase.prototype.defaults.apply(this, arguments);

      defaults.wasQuote = false;

      return defaults;
    },

    customerDidChange: function () {
      XM.SalesOrderBase.prototype.customerDidChange.apply(this, arguments);
      var creditStatus = _checkCredit.call(this),
        warn = XM.Model.WARNING;
      if (creditStatus === CREDIT_WARN) {
        this.notify("_creditWarn".loc(), { type: warn });
      } else if (creditStatus === CREDIT_HOLD) {
        this.notify("_creditHold".loc(), { type: warn });
      }
    },

    holdTypeDidChange: function () {
      if (!this.get("holdType")) {
        _.each(this.get("workflow").where(
            {workflowType: XM.SalesOrderWorkflow.TYPE_CREDIT_CHECK}),
            function (workflow) {

          workflow.set({status: XM.Workflow.COMPLETED});
        });
      }
      // TODO: reimplement in inventory
      //this.updateWorkflowItemPackDate();
    },

    /*
    TODO: reimplement in inventory
    packDateDidChange: function () {
      this.updateWorkflowItemPackDate();
    },
    */

    saleTypeDidChange: function () {
      this.inheritWorkflowSource(this.get("saleType"), "XM.SalesOrderCharacteristic",
        "XM.SalesOrderWorkflow");
      // TODO: reimplement in inventory
      //this.updateWorkflowItemPackDate();
      //this.updateWorkflowItemShipDate();
    },

    /*
    TODO: reimplement in inventory
    updateWorkflowItemPackDate: function () {
      var that = this;

      _.each(this.get("workflow").where(
          {workflowType: XM.SalesOrderWorkflow.TYPE_PACK}),
          function (workflow) {
        workflow.set({dueDate: that.get("packDate")});
      });
    },

    updateWorkflowItemShipDate: function () {
      var that = this;

      _.each(this.get("workflow").where(
          {workflowType: XM.SalesOrderWorkflow.TYPE_SHIP}),
          function (workflow) {
        workflow.set({dueDate: that.get("scheduleDate")});
      });
    },
    */

    validate: function () {
      var creditStatus = _checkCredit.call(this);
      if (creditStatus === CREDIT_WARN) {
        return XT.Error.clone('xt2022');
      } else if (creditStatus === CREDIT_HOLD) {
        return XT.Error.clone('xt2023');
      }

      return XM.SalesOrderBase.prototype.validate.apply(this, arguments);
    }
  });
  _.extend(XM.SalesOrder.prototype, XM.WorkflowMixin);

  // ..........................................................
  // CLASS METHODS
  //
  _.extend(XM.SalesOrder, /** @lends XM.SalesOrderBase# */{
    /**
      Pass a quote id and receive a sales order in the success callback.

      @param {String} Quote number
      @param {Object} Options
      @param {Function} [options.success] Success callback
      @param {Function} [options.error] Error callback
    */
    convertFromQuote: function (id, options) {
      var success = options.success,
        proto = this.prototype;
      options.success = function (data) {
        data = proto.parse(data);
        success(data);
      };
      proto.dispatch("XM.SalesOrder", "convertFromQuote", [id], options);
    },

    used: function (id, options) {
      return XM.ModelMixin.dispatch('XM.SalesOrder', 'used',
        [id], options);
    }
  });

  /**
    @class

    @extends XM.SalesOrderLineBase
  */
  XM.SalesOrderLine = XM.SalesOrderLineBase.extend(/** @lends XM.SalesOrderLine.prototype */{

    recordType: 'XM.SalesOrderLine',

    parentKey: 'salesOrder',

    lineCharacteristicRecordType: "XM.SalesOrderLineCharacteristic",

    /**
      Add defaults for firm, and subnumber.
     */
    defaults: function () {
      var defaults = XM.SalesOrderLineBase.prototype.defaults.apply(this, arguments);

      defaults.firm = false;
      defaults.subnumber = 0;

      return defaults;
    }
  });


  /**
    @class

    @extends XM.Comment
  */
  XM.SalesOrderComment = XM.Comment.extend(/** @lends XM.SalesOrderComment.prototype */{

    recordType: 'XM.SalesOrderComment',

    sourceName: 'S'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderAccount = XM.Model.extend(/** @lends XM.SalesOrderAccount.prototype */{

    recordType: 'XM.SalesOrderAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderContact = XM.Model.extend(/** @lends XM.SalesOrderContact.prototype */{

    recordType: 'XM.SalesOrderContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderFile = XM.Model.extend(/** @lends XM.SalesOrderFile.prototype */{

    recordType: 'XM.SalesOrderFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderItem = XM.Model.extend(/** @lends XM.SalesOrderItem.prototype */{

    recordType: 'XM.SalesOrderItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.SalesOrderCharacteristic = XM.CharacteristicAssignment.extend(/** @lends XM.SalesOrderCharacteristic.prototype */{

    recordType: 'XM.SalesOrderCharacteristic'

  });

  /**
    @class

    @extends XM.Workflow
  */
  XM.SalesOrderWorkflow = XM.Workflow.extend(
    /** @scope XM.SalesOrderWorkflow.prototype */ {

    recordType: 'XM.SalesOrderWorkflow'

  });
  _.extend(XM.SalesOrderWorkflow, /** @lends XM.SalesOrderLine# */{

    TYPE_OTHER: "O",

    TYPE_CREDIT_CHECK: "C",

    //  TODO: reimplement in inventory
    //TYPE_PACK: "P",

    //TYPE_SHIP: "S"

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.SalesOrderLineCharacteristic = XM.CharacteristicAssignment.extend(/** @lends XM.SalesOrderLineCharacteristic.prototype */{

    recordType: 'XM.SalesOrderLineCharacteristic',

    readOnlyAttributes: [
      "price"
    ]

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.SalesOrderLineComment = XM.Comment.extend(/** @lends XM.SalesOrderLineComment.prototype */{

    recordType: 'XM.SalesOrderLineComment',

    sourceName: 'SI'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.SalesOrderListItem = XM.Info.extend(/** @lends XM.SalesOrderListItem.prototype */{

    recordType: 'XM.SalesOrderListItem',

    editableModel: 'XM.SalesOrder'

  });

  XM.SalesOrderListItem = XM.SalesOrderListItem.extend(XM.SalesOrderBaseMixin);

  /**
    @class

    @extends XM.Info
  */
  XM.SalesOrderRelation = XM.Info.extend(/** @lends XM.SalesOrderRelation.prototype */{

    recordType: 'XM.SalesOrderRelation',

    editableModel: 'XM.SalesOrder',

    descriptionKey: "number"

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderUrl = XM.Model.extend(/** @lends XM.SalesOrderUrl.prototype */{

    recordType: 'XM.SalesOrderUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderProject = XM.Model.extend(/** @lends XM.SalesOrderProject.prototype */{

    recordType: 'XM.SalesOrderProject',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderIncident = XM.Model.extend(/** @lends XM.SalesOrderIncident.prototype */{

    recordType: 'XM.SalesOrderIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderOpportunity = XM.Model.extend(/** @lends XM.SalesOrderOpportunity.prototype */{

    recordType: 'XM.SalesOrderOpportunity',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderCustomer = XM.Model.extend(/** @lends XM.SalesOrderCustomer.prototype */{

    recordType: 'XM.SalesOrderCustomer',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesOrderToDo = XM.Model.extend(/* @lends XM.SalesOrderToDo */{

    recordType: 'XM.SalesOrderToDo',

    isDocumentAssignment: true

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.SalesOrderListItemCollection = XM.Collection.extend(/** @lends XM.SalesOrderListItemCollection.prototype */{

    model: XM.SalesOrderListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SalesOrderRelationCollection = XM.Collection.extend(/** @lends XM.SalesOrderRelationCollection.prototype */{

    model: XM.SalesOrderRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SalesOrderLineCollection = XM.Collection.extend(/** @lends XM.SalesOrderLineCollection.prototype */{

    model: XM.SalesOrderLine

  });

}());

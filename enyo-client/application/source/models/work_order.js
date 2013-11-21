/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  /**
    @class

    @extends XM.Model
  */
  XM.WorkOrder = XM.Model.extend({
    /** @lends XM.WorkOrder.prototype */

    recordType: 'XM.WorkOrder',

    /**
    Returns Work Order status as a localized string.

    @returns {String}
    */
    getWorkOrderStatusString: function () {
      var K = XM.WorkOrder,
        status = this.get('status');
      if (status === K.RELEASED) {
        return '_released'.loc();
      }
      if (status === K.EXPLODED) {
        return '_exploded'.loc();
      }
      if (status === K.INPROCESS) {
        return '_in-process'.loc();
      }
      if (status === K.OPEN) {
        return '_open'.loc();
      }
      if (status === K.CLOSED) {
        return '_closed'.loc();
      }
    },

    /**
      Calculate the balance remaining to issue.

      @returns {Number}
    */
    postBalance: function () {
      var qtyOrdered = this.get("qtyOrdered"),
        qtyReceived = this.get("qtyReceived"),
        toPost = XT.math.subtract(qtyReceived, qtyOrdered, XT.QTY_SCALE);
      return toPost >= 0 ? toPost : 0;
    }

  });

  /**
    @class

    @extends XM.Info
  */
  XM.WorkOrderRelation = XM.Info.extend({
    /** @lends XM.WorkOrderRelation.prototype */

    recordType: 'XM.WorkOrderRelation',

    editableModel: 'XM.WorkOrder'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.WorkOrderListItem = XM.Info.extend({
    /** @lends XM.WorkOrderListItem.prototype */

    recordType: 'XM.WorkOrderListItem',

    editableModel: 'XM.WorkOrder',

    canIssueMaterial: function (callback) {
      var hasPrivilege = XT.session.privileges.get("IssueWoMaterials");
      if (callback) {
        callback(hasPrivilege);
      }
      return this;
    },

    canPostProduction: function (callback) {
      var hasPrivilege = XT.session.privileges.get("PostProduction");
      if (callback) {
        callback(hasPrivilege);
      }
      return this;
    }

  });

  _.extend(XM.WorkOrder, {
    /** @scope XM.WorkOrderListItem */

    /**
      Released Status.

      @static
      @constant
      @type String
      @default R
    */
    RELEASED: 'R',

    /**
      Expoloded status.

      @static
      @constant
      @type String
      @default E
    */
    EXPLODED: 'E',

    /**
      In-Process status.

      @static
      @constant
      @type String
      @default I
    */
    INPROCESS: 'I',

    /**
      Open Status.

      @static
      @constant
      @type String
      @default S
    */
    OPEN: 'O',

    /**
      Start Date.

      @static
      @constant
      @type String
      @default S
    */
    START_DATE: 'S',

    /**
      Explosion Date.

      @static
      @constant
      @type String
      @default E
    */
    EXPLOSION_DATE: 'E',

    /**
      Single Level.

      @static
      @constant
      @type String
      @default S
    */
    SINGLE_LEVEL: 'S',

    /**
      Multiple Level.

      @static
      @constant
      @type String
      @default M
    */
    MULTIPLE_LEVEL: 'M',

    /**
      To Date.

      @static
      @constant
      @type String
      @default D
    */
    TO_DATE: 'D',

    /**
      Proportional.

      @static
      @constant
      @type String
      @default P
    */
    PROPORTIONAL: 'P'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.WorkOrderListItemCollection = XM.Collection.extend(
    /** @lends XM.WorkOrderListItemCollection.prototype */{

    model: XM.WorkOrderListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.WorkOrderRelationCollection = XM.Collection.extend(
    /** @lends XM.WorkOrderRelationCollection.prototype */{

    model: XM.WorkOrderRelation

  });

}());

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
    Returns incident status as a localized string.

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

    editableModel: 'XM.WorkOrder'

  });

  _.extend(XM.WorkOrder, {
    /** @scope XM.WorkOrderListItem */

    /**
      Released Status.

      @static
      @constant
      @type String
      @default I
    */
    RELEASED: 'R',

    /**
      Expoloded status.

      @static
      @constant
      @type String
      @default N
    */
    EXPLODED: 'E',

    /**
      In-Process status.

      @static
      @constant
      @type String
      @default F
    */
    INPROCESS: 'I',

    /**
      Open Status.

      @static
      @constant
      @type String
      @default I
    */
    OPEN: 'O',

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.WorkOrderListItemCollection = XM.Collection.extend(/** @lends XM.WorkOrderListItemCollection.prototype */{

    model: XM.WorkOrderListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.WorkOrderRelationCollection = XM.Collection.extend(/** @lends XM.WorkOrderRelationCollection.prototype */{

    model: XM.WorkOrderRelation

  });

}());

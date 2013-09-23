/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  /**
    @class

    @extends XM.Info
  */
  XM.WorkOrderListItem = XM.Model.extend({
    /** @lends XM.WorkOrderListItem.prototype */

    recordType: 'XM.WorkOrderListItem',

        /**
    Returns incident status as a localized string.

    @returns {String}
    */
    getWorkOrderStatusString: function () {
      var K = XM.WorkOrderListItem,
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

  _.extend(XM.WorkOrderListItem, {
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

}());

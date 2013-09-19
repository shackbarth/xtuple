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
  XM.WorkOrderListItem = XM.Info.extend(/** @lends XM.WorkOrderListItem.prototype */{

    recordType: 'XM.WorkOrderListItem'

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

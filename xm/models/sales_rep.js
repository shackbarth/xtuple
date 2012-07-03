/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
  
    @extends XM.AccountDocument
  */
  XM.SalesRep = XM.AccountDocument.extend({
    /** @scope XM.SalesRep.prototype */

    recordType: 'XM.SalesRep',

    privileges: {
      "all": {
        "create": "MaintainSalesReps",
        "read": true,
        "update": "MaintainSalesReps",
        "delete": "MaintainSalesReps"
      }
    },

    defaults: {
      isActive: true,
      commission: 0
    }

  });

}());

/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
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

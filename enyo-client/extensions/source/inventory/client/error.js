// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true,
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*global XT:true, _:true */

(function () {
  "use strict";

  var errors = [
    {
      code: "xtinv1001",
      messageKey: "_improperItemSite"
    }, {
      code: "xtinv1002",
      messageKey: "_noSalesAssignments"
    }, {
      code: "xtinv1003",
      messageKey: "_orderOnCreditHold"
    }, {
      code: "xtinv1004",
      messageKey: "_orderOnPackingHold"
    }, {
      code: "xtinv1005",
      messageKey: "_orderOnShippingHold"
    }, {
      code: "xtinv1006",
      messageKey: "_shipmentNotFound"
    }, {
      code: "xtinv1007",
      messageKey: "_incompleteShipment"
    }, {
      code: "xtinv1008",
      messageKey: "_alreadyShipped"
    }
  ];

  _.each(errors, XT.Error.addError);

}());

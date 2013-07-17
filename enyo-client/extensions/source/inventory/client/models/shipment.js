/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initShipmentModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.Shipment = XM.Document.extend({

    recordType: "XM.Shipment",

    numberPolicy: XM.Document.AUTO_NUMBER,

    readOnlyAttributes: [
      "order"
    ]

    });

    /**
      @class

      @extends XM.Document
    */
    XM.ShipmentLine = XM.Document.extend({

    recordType: "XM.ShipmentLine",

    parentKey: "shipment"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.ShipmentCollection = XM.Collection.extend({

    model: XM.Shipment

    });

  };

}());


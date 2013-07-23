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
      ],

      recallShipment: function (callback) {
        this.dispatch("XM.Inventory", "recallShipment", [this.id], {
          success: function () {
            if (callback) {
              callback();
            }
          },
          error: function () {
            if (callback) {
              callback();
            }
          }
        });
      },
      //Todo - If the shipment is invoiced I need to check if the user has the privilege to Recall Invoiced Shipments
      canRecall: function (callback) {
        var canIRecall = this.get("isShipped") === true && this.get("isPostedInvoice") === false;
        callback(canIRecall);
      }

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


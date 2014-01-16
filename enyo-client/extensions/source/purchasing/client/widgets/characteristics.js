/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict: false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.purchasing.initCharacteristicWidgets = function () {

    // ..........................................................
    // PURCHASE ORDER
    //

    enyo.kind({
      name: "XV.PurchaseOrderCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.PurchaseOrderCharacteristic",
      which: "isPurchaseOrders"
    });

    // ..........................................................
    // PURCHASE ORDER LINE
    //

    enyo.kind({
      name: "XV.PurchaseOrderLineCharacteristicsWidget",
      kind: "XV.OrderCharacteristicsWidget",
      parentKey: "purchaseOrderLine",
      model: "XM.PurchaseOrderLineCharacteristic"
    });

    // ..........................................................
    // PURCHASE TYPE
    //

    enyo.kind({
      name: "XV.PurchaseTypeCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.PurchaseTypeCharacteristic",
      which: "isPurchaseOrders"
    });

  };

}());

/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, Globalize:true */

(function () {

  // ..........................................................
  // SHIPMENT LINE
  //

  enyo.kind({
    name: "XV.ShipmentLineRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_lineItems".loc(),
    parentKey: "shipment",
    listRelations: "XV.ShipmentLineListRelations"
  });

}());

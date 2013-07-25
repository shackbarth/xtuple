/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, window:true, enyo:true, _:true */

(function () {
  // ..........................................................
  // CUSTOMER
  //

  enyo.kind({
    name: "XV.VendorWidget",
    kind: "XV.RelationWidget",
    collection: "XM.VendorRelationCollection",
    list: "XV.VendorList"
  });

}());
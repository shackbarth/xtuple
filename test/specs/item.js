/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    @class
    @alias Item
  */
  var spec = {
    skipAll: true,
    recordType: "XM.Item",
    collectionType: "XM.ItemListItemCollection",
    cacheName: null,
    listKind: "XV.ItemList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["number", "description1"], // TODO: more
    extensions: ["billing", "crm", "sales", "inventory", "project"],
    privileges: {
      createUpdate: "MaintainItemMasters",
      read: "ViewItemMasters",
      delete: "DeleteItemMasters"
    },
    createHash: {
      number: "ATEST" + Math.random(),
      description1: "Item description1",
      isActive: true,
      itemType: "P",
      classCode: {code: "TOYS-COMP"},
      productCategory: {code: "CLASSIC-WOOD"},
      inventoryUnit: {name: "CS"},
      isFractional: true,
      isSold: true,
      listPrice: 0.00,
      priceUnit: {name: "CS"}
    },
    updatableField: "description1"
  };


  exports.spec = spec;

}());


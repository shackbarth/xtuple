/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
  assert = require("chai").assert;

  exports.honorific = {
    recordType: "XM.Honorific",
    collectionType: "XM.HonorificCollection",
    cacheName: "XM.honorifics",
    listKind: "XV.HonorificList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code"],
    extensions: ["crm", "project"],
    privileges: {
      createUpdateDelete: "MaintainTitles",
      read: true
    },
    createHash: {
      code: "Herr" + Math.random()
    },
    updatableField: "code"
  };

  exports.item = {
    recordType: "XM.Item",
    collectionType: "XM.ItemListItemCollection",
    cacheName: null,
    listKind: "XV.ItemList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["number", "description1"], // TODO: more
    extensions: ["crm", "sales", "inventory", "project"], // TODO: billing
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

  exports.shipVia = {
    recordType: "XM.ShipVia",
    collectionType: "XM.ShipViaCollection",
    cacheName: "XM.shipVias",
    listKind: "XV.ShipViaList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "description"],
    extensions: ["sales", "inventory"],
    //extensions: ["sales", "billing", "inventory"], TODO
    privileges: {
      createUpdateDelete: "MaintainShipVias",
      read: true
    },
    createHash: {
      code: "TestShipVia" + Math.random(),
      description: "Test Ship Via"
    },
    updatableField: "description"
  };

  exports.reasonCode = {
    recordType: "XM.ReasonCode",
    collectionType: "XM.ReasonCodeCollection",
    cacheName: "XM.reasonCodes",
    listKind: "XV.ReasonCodeList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "description", "documentType"],
    extensions: ["inventory"], // TODO: billing
    privileges: {
      createUpdateDelete: "MaintainReasonCodes",
      read: true
    },
    createHash: {
      code: "TestReasonCode" + Math.random(),
      description: "Test Reason Code",
      documentType: "ARCM"
    },
    updatableField: "description"
  };

  //  > XM.ReasonCode.CREDIT_MEMO = 'ARCM'
  //  > XM.ReasonCode.DEBIT_MEMO = 'ARDM'
  // * The above constants should be added to a static collection called XM.reasonCodeDocumentTypes
  // * XM.ReasonCode should include the following attributes:
  //   > String "code" that is the documentKey and idAttribute
  //     > String "description"
  //     > String "documentType"
  // * XM.ReasonCode should not enforce uppercase on the code.
  // * The "MaintainReasonCodes" priviliges should be available the billing extension.
  // * Any user should be able to a view a XM.ReasonCode object.
  // * Only users with the "MaintainReasonCodes" privilege should be should be able to create, update or delete a XM.ReasonCode object.
  // * A XM.ReasonCode object can not be deleted if it has been referenced by a receivable.
  // * XM.ReasonCodeCollection based on XM.Collection class should exist.
  // * A cached collection called XM.reasonCodes should be created on application startup when billing or inventory is installed
  // * A List view that presents the XM.ReasonCode collection sholud be exist in the core application
  // * The list view should be added to setup by the billing and inventory extensions.
  // * A widget called XV.ReasonCodeDocumentTypePicker should be created that is backed by XM.reasonCodeDocumentTypes
  // * XV.ReasonCodeDocumentTypePicker should have the noneText property set to disylay "Any".

}());

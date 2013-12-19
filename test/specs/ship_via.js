/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    Ship Vias describe the transportation method used to ship Sales Order Items.
    Shipping companies, for example, are considered to be Ship Vias
    @class
    @alias ShipVia
    @property {String} Code
    @property {String} Description
  */
  var spec = {
    recordType: "XM.ShipVia",
    collectionType: "XM.ShipViaCollection",
    cacheName: "XM.shipVias",
    listKind: "XV.ShipViaList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof ShipVia.prototype
      @description Ship Vias are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof ShipVia.prototype
      @description The ID attribute is "name, which will not be automatically uppercased.
    */
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "description"],
    /**
      @member -
      @memberof ShipVia.prototype
      @description Used in the Billing and Sales modules
    */
    extensions: ["billing", "sales"],
    /**
      @member -
      @memberof ShipVia.prototype
      @description Ship Vias can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainShipVias" privilege.
    */
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

  exports.spec = spec;

}());


/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Shipping Zones are used to define geographic regions into which sold Items are shipped.
  Sales Orders are linked to Shipping Zones through the Ship-To Address master.
  This assignment of Shipping Zones to Sales Order enables you to analyze sales activity
  by geographic region
  @class
  @alias ShipZone
  @property {String} name
  @property {String} description
  **/
  var spec = {
    recordType: "XM.ShipZone",
    enforceUpperKey: false,
    collectionType: "XM.ShipZoneCollection",
    listKind: "XV.ShipZoneList",
    instanceOf: "XM.Document",
    attributes: ["id", "name", "description"],
    /**
      @member -
      @memberof ShipZone.prototype
      @description The ID attribute is "name", which will not be automatically uppercased.
    */
    idAttribute: "name",
    /**
      @member -
      @memberof ShipZone.prototype
      @description Used in the Sales modules
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof ShipZone.prototype
      @description ShipZones are lockable.
    */
    isLockable: true,
    /**
    @member -
    @memberof ShipZone.prototype
    @description The Ship Zone collection is cached.
    */
    cacheName: "XM.shipZones",
    /**
      @member -
      @memberof ShipZone.prototype
      @description ShipZones can be read by users with "ViewShippingZones" privilege and can be created, updated,
        or deleted by users with the "MaintainShippingZones" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainShippingZones",
      read: "ViewShippingZones"
    },
    createHash : {
      name: "TESTSHIPZONE" + Math.random(),
      description: "Test Ship Zone"
    },
    updatableField: "description"
  };
  exports.spec = spec;
}());

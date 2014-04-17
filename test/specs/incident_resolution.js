/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Incident Resolutions are used by the Incident Management system to categorize how Incidents
  are resolved.
  TIP: You must manually create Incident Resolutions if you want the ability to assign them to
  incidents. If no incident categories are defined, then none will be available when
  entering incidents.
  @class
  @alias IncidentResolution
  @property {String} Name
  @property {String} Description
  @property {Number} Order
  **/
  var spec = {
    recordType: "XM.IncidentResolution",
    enforceUpperKey: false,
    collectionType: "XM.IncidentResolutionCollection",
    listKind: "XV.IncidentResolutionList",
    instanceOf: "XM.Document",
    attributes: ["id", "name", "order", "description"],
    /**
      @member -
      @memberof IncidentResolution.prototype
      @description The ID attribute is "name", which will not be automatically uppercased.
    */
    idAttribute: "name",
    /**
      @member -
      @memberof IncidentResolution.prototype
      @description Used in the crm module
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof IncidentResolution.prototype
      @description Incident Resolutions are lockable.
    */
    isLockable: true,
    /**
    @member -
    @memberof IncidentResolution.prototype
    @description The Incident Resolution collection is cached.
    */
    cacheName: "XM.incidentResolutions",
    /**
      @member -
      @memberof IncidentResolution.prototype
      @description Incident Resolutions can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainIncidentResolutions" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainIncidentResolutions",
      read: true
    },
    createHash: {
      name: "InctRes" + Math.random(),
      description: "Incident Resolution 123",
      order: 10
    },
    updatableField: "description"
  };
  exports.spec = spec;
}());

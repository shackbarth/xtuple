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
    idAttribute: "name",
    extensions: ["crm"],
    isLockable: true,
    cacheName: "XM.incidentResolutions",
    privileges: {
      createUpdateDelete: "MaintainIncidentResolutions",
      read: true
    },
    createHash: {
      description: "test account" + Math.random(),
      name: "test IncidentResolution",
      order: 10
    },
    updatableField: "description"
  };
  exports.spec = spec;
}());

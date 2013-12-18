/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Incident Severities are used by the Incident Management system to categorize the 
  severity of Incidents
  TIP: You must manually create Incident Severities if you want the ability to assign them to 
  incidents. If no incident categories are defined, then none will be available when 
  entering incidents.
  @class
  @alias IncidentSeverity
  @property {String} Name
  @property {String} Description
  @property {Number} Order
  @property {Option} Email Delivery Profile
  **/
 var spec = {
    recordType: "XM.IncidentSeverity",
    enforceUpperKey: false,
    collectionType: "XM.IncidentSeverityCollection",
    listKind: "XV.IncidentSeverityList",
    instanceOf: "XM.Document",
    attributes: ["id", "name", "order", "description"],
    idAttribute: "name",
    extensions: ["crm"], 
    isLockable: true,
    cacheName: "XM.incidentSeverities",
    privileges: {
      createUpdateDelete: "MaintainIncidentSeverities",
      read: true
    },
    createHash: {
        name: "SEVERECONSERVATIVE" + Math.random(),
        description: "description",
        order: 10
    },
    updatableField: "description"
  };
  exports.spec = spec;
}());

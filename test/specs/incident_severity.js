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
  **/
 var spec = {
    recordType: "XM.IncidentSeverity",
    enforceUpperKey: false,
    collectionType: "XM.IncidentSeverityCollection",
    listKind: "XV.IncidentSeverityList",
    instanceOf: "XM.Document",
    attributes: ["id", "name", "order", "description"],
    /**
      @member -
      @memberof IncidentSeverity.prototype
      @description The ID attribute is "name", which will not be automatically uppercased.
    */
    idAttribute: "name",
    /**
      @member -
      @memberof IncidentSeverity.prototype
      @description Used in the crm module
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof IncidentSeverity.prototype
      @description IncidentSeveritys are lockable.
    */
    isLockable: true,
    /**
    @member -
    @memberof IncidentSeverity.prototype
    @description The Incident Severity collection is cached.
    */
    cacheName: "XM.incidentSeverities",
    /**
      @member -
      @memberof IncidentSeverity.prototype
      @description IncidentSeveritys can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainIncidentSeverities" privilege.
    */
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

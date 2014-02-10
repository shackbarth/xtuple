/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Priorities are used by the Priority Management system to prioritize Incidents and To-Do's
  TIP: You must manually create Priorities if you want the ability to assign them to 
  incidents or To-Dos.
  @class
  @alias Priority
  @property {String} Name
  @property {String} Description
  @property {Number} Order
  **/
 var spec = {
    recordType: "XM.Priority",
    enforceUpperKey: false,
    collectionType: "XM.PriorityCollection",
    listKind: "XV.PriorityList",
    instanceOf: "XM.Document",
    attributes: ["id", "name", "order", "description"],
    /**
      @member -
      @memberof Priority.prototype
      @description The ID attribute is "name", which will not be automatically uppercased.
    */
    idAttribute: "name",
    /**
      @member -
      @memberof Priority.prototype
      @description Used in the crm module
    */
    extensions: ["crm"], 
    /**
      @member -
      @memberof Priority.prototype
      @description Priorities are lockable.
    */
    isLockable: true,
    /**
    @member -
    @memberof Priority.prototype
    @description The honorific collection is cached.
    */
    cacheName: "XM.priorities",
    /**
      @member -
      @memberof Priority.prototype
      @description Priorities can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainIncidentPriorities" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainIncidentPriorities",
      read: true
    },
    createHash: {
        name: "Must Have" + Math.random(),
        description: "description",
        order: 10
    },
    updatableField: "description"
  };
  exports.spec = spec;
}());

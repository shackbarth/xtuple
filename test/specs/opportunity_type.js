/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Opportunity Types are used by the Opportunity Management system
  to categorize kinds of Opportunities
  @class
  @alias OpportunityType
  @property {String} Name
  @property {String} Description
  **/
  var spec = {
    recordType: "XM.OpportunityType",
    enforceUpperKey: false,
    collectionType: "XM.OpportunityTypeCollection",
    listKind: "XV.OpportunityTypeList",
    instanceOf: "XM.Document",
    attributes: ["id", "name", "description"],
    /**
      @member -
      @memberof OpportunityType.prototype
      @description The ID attribute is "name, which will not be automatically uppercased.
    */
    idAttribute: "name",
    /**
      @member -
      @memberof OpportunityType.prototype
      @description Used in the crm modules
    */
    extensions: ["crm"],
     /**
      @member -
      @memberof OpportunityType.prototype
      @description Opportunity Types are lockable.
    */
    isLockable: true,
    cacheName: "XM.opportunityTypes",
    /**
      @member -
      @memberof OpportunityType.prototype
      @description Opportunity Types can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainOpportunityTypes" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainOpportunityTypes",
      read: true
    },
    createHash : {
      name : 'Test Name' + Math.random(),
      description : 'Test Description'
    },
    updatableField: "description"
  };
  exports.spec = spec;
}());

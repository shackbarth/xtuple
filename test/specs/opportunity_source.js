/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Opportunity Sources are used by the Opportunity Management system to categorize the
  lead source of an Opportunity
  TIP: You must manually create Opportunity Sources if you want the ability to assign them to
  Opportunities. If no Opportunity Sources are defined, then none will be available when
  entering opportunities.
  @class
  @alias OpportunitySource
  @property {String} Name
  @property {String} Description
  **/
  var spec = {
    recordType: "XM.OpportunitySource",
    enforceUpperKey: false,
    collectionType: "XM.OpportunitySourceCollection",
    listKind: "XV.OpportunitySourceList",
    instanceOf: "XM.Document",
    attributes: ["id", "name", "description"],
    /**
      @member -
      @memberof OpportunitySource.prototype
      @description The ID attribute is "name, which will not be automatically uppercased.
    */
    idAttribute: "name",
    /**
      @member -
      @memberof OpportunitySource.prototype
      @description Used in the crm modules
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof OpportunitySource.prototype
      @description Opportunity Sources are lockable.
    */
    isLockable: true,
    cacheName: "XM.opportunitySources",
    /**
      @member -
      @memberof OpportunitySource.prototype
      @description Opportunity Sources can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainOpportunitySources" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainOpportunitySources",
      read: true
    },
    createHash : {
      name: 'Agent' + Math.random(),
      description: 'Sales Agent'
    },
    updatableField: "description"
  };
  exports.spec = spec;
}());

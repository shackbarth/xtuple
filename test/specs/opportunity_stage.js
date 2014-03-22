/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Opportunity Stages are used by the Opportunity Management system to categorize the
  current stage of an Opportunity
  TIP: You must manually create Opportunity Stages if you want the ability to assign them to
  Opportunities. If no Opportunity Stages are defined, then none will be available when
  entering opportunities.
  @class
  @alias OpportunityStage
  @property {String} Name
  @property {String} Description
  **/
  var spec = {
    recordType: "XM.OpportunityStage",
    enforceUpperKey: false,
    collectionType: "XM.OpportunityStageCollection",
    listKind: "XV.OpportunityStageList",
    instanceOf: "XM.Document",
    attributes: ["id", "name", "description", "deactivate"],
    /**
      @member -
      @memberof OpportunityStage.prototype
      @description The ID attribute is "name, which will not be automatically uppercased.
    */
    idAttribute: "name",
    /**
      @member -
      @memberof OpportunityStage.prototype
      @description Used in the crm modules
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof OpportunityStage.prototype
      @description Opportunity Stages are lockable.
    */
    isLockable: true,
    cacheName: "XM.opportunityStages",
    /**
      @member -
      @memberof OpportunityStage.prototype
      @description Opportunity Stages can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainOpportunityStages" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainOpportunityStages",
      read: true
    },
    createHash : {
      name: 'Stage' + Math.random(),
      description: 'Description',
      deactivate: true
    },
    updatableField: "description"
  };
  exports.spec = spec;
}());

/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    common = require("../lib/common");

  /**
  Whenever you have a chance to make a sale, it is considered an Opportunity. The xTuple
  Applications make it easy to track these revenue opportunities with the Opportunity
  Management system
    @class
    @alias Opportunity
    @property {String} Number
    @property {String} Name
    @property {Boolean} isActive
    @property {Account} Account 
    @property {Contact} Contact
    @property {OpportunityStage} OpportunityStage
    @property {Priority} Priority
    @property {OpportunityType} OpportunityType
    @property {OpportunitySource} OpportunitySource
    @property {Number} Amount
    @property {Currency} Currency
    @property {Number} Probability
    @property {Date} StartDate
    @property {Date} AssignDate
    @property {Date} TargetClose
    @property {Date} ActualClose
    @property {String} notes
    @property {UserAccount} owner
    @property {Employee} assignedTo
    @property {OpportunityAccount} Accounts
    @property {OpportunityComment} Comments
    @property {OpportunityCharacterisitic} Characterisitcs
    @property {OpportunityOpportunity} Opportunities
    @property {OpportunityItem} Items
    @property {OpportunityFile} File
    @property {OpportunityContact} Contact
    @property {OpportunityUrl} Urls
    @property {OpportunityIncident} Incidents
    @property {OpportunityToDo} Todos
    @property {OpportunityProject} Projects
    @property {OpportunityCustomer} Customers
  */
  var spec = {
    recordType: "XM.Opportunity",
    collectionType: "XM.OpportunityListItemCollection",
    /**
    @member -
    @memberof Opportunity
    @description The Opportunity has no cache defined
    */
    cacheName: null,
    listKind: "XV.OpportunityList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Opportunity
      @description Opportunities are lockable.
    */
    isLockable: true,
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["id", "number", "name", "isActive", "account", "contact", "opportunityStage",
    "priority", "opportunitySource", "opportunityType", "amount", "currency", "probability", 
    "startDate", "assignDate", "targetClose", "actualClose", "notes", "owner", "assignedTo", 
    "comments", "characteristics", "contacts", "items", "files", "urls", "accounts", 
    "opportunities", "incidents", "toDos", "toDoRelations", "projects", "customers", 
    "quoteRelations", "salesOrderRelations"],
    requiredAttributes: ["number", "name", "isActive", "account", "opportunityStage",
    "opportunitySource", "opportunityType"], 
    /**
      @member -
      @memberof Opportunity
      @description Used in the crm module
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof Opportunity
      @description Opportunities can be read by users with "ViewAllOpportunities" privilege and can be
      created, updated, or deleted by users with the "MaintainAllOpportunities" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainAllOpportunities",
      read: "ViewAllOpportunities"
    },
    createHash: {
      name: "BigOne" + Math.random(),
      account: { number: "XPPI"},
      opportunityStage: { name: "QUOTE" },
      opportunitySource: { name: "INTERNAL" },
      opportunityType: { name: "DESIGN" }
    },
    updateHash: {
      name: "SmallOne" + Math.random()
    }
  };
   var additionalTests = function () {  
  /**
    @member -
    @memberof Opportunity
    @description Users with "ViewPersonalOpportunities" privilege can read their personal Opportunities
    but cannot read the contact's owned by other users. Users with "MaintainPersonalOpportunities" 
    privilege can create, update or delete their personal Opportunities but not the Opportunities owned
    by other users 
    */
    it.skip("Users with \"ViewPersonalOpportunities\" privilege can read their personal Opportunities" +
      "but cannot read the Opportunities owned by other users. ", function () {
    });
    it.skip("Users with \"MaintainPersonalOpportunities\" privilege can create, update or delete" +
    "their personal Opportunities but not the Opportunities owned by other users", function () {
    });
     /**
    @member -
    @memberof Opportunity
    @description Comments panel should exist to add new comments to the Opportunity
    */
    it.skip("Comments panel should exist to add new comments to the Opportunity", function () {
    });
     /**
    @member -
    @memberof Opportunity
    @description All Comment Types assigned to Opportunity should be available for selection
    */
    it.skip("All Comment Types assigned to Opportunity should be available for selection", function () {
    });
    /**
    @member -
    @memberof Opportunity
    @description Documents panel should exist to connect the Opportunities to : Account, contact,
      Customer, File, Incident, Item, Link, Opportunity, Project, To do
    */
    it.skip("Documents panel should exist to connect the Opportunities to : Account, contact," +
      "Customer, File, Incident, Item, Link, Opportunity, Project, To do", function () {
    });
    it.skip("User should be able to detach an attached document from the Opportunity", function (){
    });
    /**
    @member -
    @memberof Opportunity
    @description TO DO panel should exist to attach existing/new To Dos to the Opportunity
    */
    it.skip("TO DO panel should exist to attach existing/new To Dos to the Opportunity", function () {
    });
    it.skip("User should be able to detach an attached To do from the Opportunity screen", function (){
    });
    it.skip("User should be able to open an attached To Do from the Opportunity screen", function (){
    });
    /**
    @member -
    @memberof Opportunity
    @description Quotes panel should exist to attach existing/new Quotes to the Quote
    */
    it.skip("Quotes panel should exist to attach existing/new Quotes to the Opportunity", function () {
    });
    it.skip("User should be able to detach an attached Quote from the Opportunity", function (){
    });
    it.skip("User should be able to open an attached Quote from the Opportunity", function (){
    });
    /**
    @member -
    @memberof Opportunity
    @description Sales Order panel should exist to attach existing/new Sales Orders to the Opportunity
    */
    it.skip("Sales Order panel should exist to attach existing/new Sales Orders to the Opportunity", function () {
    });
    it.skip("User should be able to detach an attached Sales Order from the Opportunity", function (){
    });
    it.skip("User should be able to open an attached Sales Order from the Opportunity", function (){
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
  
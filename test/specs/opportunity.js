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
    @property {String} number [required] (Displays the system-defined number used to identify the Opportunity)
    @property {String} name [required] (Enter a name to identify the Opportunity)
    @property {Boolean} isActive [required, default: true] (Select to specify the Opportunity is active. If not selected, the Opportunity will be marked as inactive, causing it to be hidden in some lists)
    @property {Account} account [required] (Specify the CRM Account the Opportunity is associated with)
    @property {Contact} contact (Enter the name of the Contactâor select a name from the Contacts list. Details for the Contact will be shown after selection)
    @property {OpportunityStage} opportunityStage [required] (Specify the current Stage of the Opportunity. It's possible an Opportunity will be automatically marked as inactive when it reaches a certain stage, depending on how your system is configured)
    @property {Priority} priority (Specify the priority level for the Opportunity)
    @property {OpportunityType} opportunityType [required] (Specify the type of Opportunity)
    @property {OpportunitySource} opportunitySource [required] (Specify the source which generated the Opportunity)
    @property {Number} amount (Enter the monetary value of the Opportunity)
    @property {Currency} currency 
    @property {Number} probability (Project the likelihood the Opportunity will be closed)
    @property {Date} startDate (Specify the date when the Opportunity was first identified. This date will be auto-populated when the Opportunity is created)
    @property {Date} assignDate (Specify the date when the Opportunity was assigned. This date will be auto-populated when the Opportunity is assigned)
    @property {Date} targetClose (Specify the date you expect the Opportunity will close)
    @property {Date} actualClose (Specify the date when the Opportunity closed)
    @property {String} notes (This is a scrolling text field with word-wrapping for entering Notes related to the Opportunity. Any Notes entered on this screen are for internal purposes only)
    @property {UserAccount} owner (Specify the user who owns the Opportunity)
    @property {UserAccount} assignedTo (Specify the user the Opportunity is assigned to)
    @property {OpportunityAccount} accounts
    @property {OpportunityComment} comments
    @property {OpportunityCharacterisitic} characterisitcs
    @property {OpportunityOpportunity} opportunities
    @property {OpportunityItem} items
    @property {OpportunityFile} file
    @property {OpportunityContact} contact
    @property {OpportunityUrl} urls
    @property {OpportunityIncident} incidents
    @property {OpportunityToDo} todos
    @property {OpportunityProject} projects
    @property {OpportunityCustomer} customers
  */
  var spec = {
    recordType: "XM.Opportunity",
    collectionType: "XM.OpportunityListItemCollection",
    /**
    @member Other
    @memberof Opportunity
    @description The Opportunity has no cache defined
    */
    cacheName: null,
    listKind: "XV.OpportunityList",
    instanceOf: "XM.Document",
    /**
      @member Settings
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
      @member Setup
      @memberof Opportunity
      @description Used in the crm module
    */
    extensions: ["crm"],
    /**
      @member Privileges
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
    @member Privileges
    @memberof Opportunity
    @description Users with "ViewPersonalOpportunities" privilege can read their personal Opportunities
    but cannot read the Opportunities owned by other users. Users with "MaintainPersonalOpportunities" 
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
    @member Settings
    @memberof Opportunity
    @description When the currency for amount is changed, Amount should be recalculated according to
    the Exchange rates
    */
    it.skip("When the currency for amount is changed, Amount should be recalculated according to" +
    "the Exchange rates", function () {
    });
    /**
    @member Navigation
    @memberof Opportunity
    @description Contacts search should display only contacts related to the specific account, if
    account is already selected
    */
    it.skip("History panel should be available which displays the Incident history", function () {
    });
     /**
    @member Other
    @memberof Opportunity
    @description Comments panel should exist to add new comments to the Opportunity
    */
    it.skip("Comments panel should exist to add new comments to the Opportunity", function () {
    });
     /**
    @member Other
    @memberof Opportunity
    @description All Comment Types assigned to Opportunity should be available for selection
    */
    it.skip("All Comment Types assigned to Opportunity should be available for selection", function () {
    });
    /**
    @member Other
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
    @member Other
    @memberof Opportunity
    @description TO DO panel should exist to attach existing/new To Dos to the Opportunity
    */
    it.skip("TO DO panel should exist to attach existing/new To Dos to the Opportunity", function () {
    });
    /**
    @member Other
    @memberof Opportunity
    @description User should be able to detach an attached To do from the Opportunity screen
    */
    it.skip("User should be able to detach an attached To do from the Opportunity screen", function (){
    });
    /**
    @member Other
    @memberof Opportunity
    @description User should be able to open an attached To Do from the Opportunity screen
    */
    it.skip("User should be able to open an attached To Do from the Opportunity screen", function (){
    });
    /**
    @member Other
    @memberof Opportunity
    @description Quotes panel should exist to attach existing/new Quotes to the Quote
    */
    it.skip("Quotes panel should exist to attach existing/new Quotes to the Opportunity", function () {
    });
    /**
    @member Other
    @memberof Opportunity
    @description User should be able to detach an attached Quote from the Opportunity
    */
    it.skip("User should be able to detach an attached Quote from the Opportunity", function (){
    });
    /**
    @member Other
    @memberof Opportunity
    @description User should be able to open an attached Quote from the Opportunity
    */
    it.skip("User should be able to open an attached Quote from the Opportunity", function (){
    });
    /**
    @member Other
    @memberof Opportunity
    @description Sales Order panel should exist to attach existing/new Sales Orders to the Opportunity
    */
    it.skip("Sales Order panel should exist to attach existing/new Sales Orders to the Opportunity", function () {
    });
    /**
    @member Other
    @memberof Opportunity
    @description User should be able to detach an attached Sales Order from the Opportunity
    */
    it.skip("User should be able to detach an attached Sales Order from the Opportunity", function (){
    });
    /**
    @member Other
    @memberof Opportunity
    @description User should be able to open an attached Sales Order from the Opportunity
    */
    it.skip("User should be able to open an attached Sales Order from the Opportunity", function (){
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
  
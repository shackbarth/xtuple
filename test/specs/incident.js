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
  The Incident Management system enables you to monitor and record Incidents that are linked to
  Accounts, Contacts, Users, and To-Do"s.
    @class
    @alias Incident
    @property {String} number [that is the documentKey and idAttribute.] (Next available Invoice Number will automatically display. Default values and input parameters for Invoice Numbers are configurable at the system level.)
    @property {String} description [required] (Enter a few words to briefly describe the Incident)
    @property {IncidentCategory} category [required] (Specify a user-defined Category to assign the Incident)
    @property {Boolean} isPublic (If your CRM module is configured to allow for public/private Incidents, this option will be shown. When shown, select to indicate you want the Incident to be viewable publicly)
    @property {Account} account [required] (Specify the CRM Account the Incident is associated with)
    @property {Contact} contact [required] (Manually enter Contact information in the fields below or use the lookup feature to select pre-existing Contact information. If the Contact you select is linked to a CRM Account, the Account will be filled in automatically)
    @property {Priority} priority (Specify a user-defined Priority to assign the Incident)
    @property {String} status [required, default: New](Specify a system-defined Incident status to assign to the Incident from the available options)
    @property {IncidentResolution} resolution (Specify a user-defined Resolution to assign the Incident)
    @property {IncidentSeverity} severity (Specify a user-defined Severity to assign the Incident)
    @property {UserAccount} owner
    @property {Employee}  assignedTo (Specify the user you want to assign the Incident to)
    @property {String} notes (This is a scrolling text field with word-wrapping for entering general Notes related to the Incident. When a Note is entered, the content of the Note will also automatically be inserted as a Comment on the Incident. The Comment created this way may not be edited; however, if you edit the Note, the associated Comment will include your edits)
    @property {Item} item (Use the field to link an Incident to a specific Item or Lot/Serial Number)
    @property {Date} created [required]
    @property {Date} updated
    @property {IncidentHistory} history (To view the history associated with an Incident, select the "History" tab)
    @property {IncidentAlarm} alarms ()
    @property {IncidentAccount} accounts
    @property {IncidentComment} comments (To view system-generated Comments associated with an Incident or to add new Comments of your own. select the "Comments" tab)
    @property {IncidentCharacterisitic} characterisitcs
    @property {IncidentContact} contacts
    @property {IncidentIncident} incidents
    @property {IncidentOpportunity} opportunities
    @property {IncidentItem} items
    @property {IncidentFile} files
    @property {IncidentUrl} urls
    @property {IncidentToDo} Todos
    @property {IncidentProject} Projects
    @property {IncidentCustomer} Customers
  */
  var spec = {
    recordType: "XM.Incident",
    skipCrud: true,
    skipSmoke: true,
    collectionType: "XM.IncidentListItemCollection",
    /**
    @member Other
    @memberof Incident
    @description The Incident has no cache defined
    */
    cacheName: null,
    listKind: "XV.IncidentList",
    instanceOf: "XM.Document",
    /**
      @member Settings
      @memberof Incident
      @description Incidents are lockable.
    */
    isLockable: true,
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["id", "number", "description", "category", "isPublic", "account", "contact",
    "priority", "status", "resolution", "severity", "owner", "assignedTo", "notes", "item",
    "recurrences", "created", "updated", "alarms", "history", "comments", "characteristics",
    "contacts", "items", "files", "urls", "accounts", "incidents", "uuid", "opportunities",
    "toDos", "toDoRelations", "project", "projects", "customers"],
    requiredAttributes: ["description", "status", "created", "category", "account", "contact",
    "number"],
    /**
      @member Setup
      @memberof Incident
      @description Used in the crm module
    */
    extensions: ["crm"],
    /**
      @member Privileges
      @memberof Incident
      @description Incidents can be read by users with "ViewAllIncidents" privilege and can be
      created and updated by users with the "MaintainAllIncidents" privilege.
    */
    /**
      @member Privileges
      @memberof Incident
      @description Incidents cannot be deleted by the users
    */
    privileges: {
      createUpdateDelete: "MaintainAllIncidents",
      read: "ViewAllIncidents"
    },
    createHash: {
      description: "Incident desc",
      status: "New",
      account: { number: "TTOYS" },
      contact: {  number: 14 },
      category: { name: "Product" }
    },
    updateHash: {
      description: "updated" + Math.random()
    }
  };
  var additionalTests = function () {
    describe("Incident status behavior", function () {
      var incidentModel;

      beforeEach(function () {
        incidentModel = new XM.Incident();
        incidentModel.initialize(null, {isNew: true});
      });
      it("Incident status starts out as new", function () {
        assert.equal(incidentModel.get("status"), XM.Incident.NEW);
      });
      it("Incident status gets set to assigned when user is assigned to it", function () {
        incidentModel.set("assignedTo", new XM.UserAccountRelation());
        assert.equal(incidentModel.get("status"), XM.Incident.ASSIGNED);
      });
      it("Incident status does not revert to assigned from closed when user is assigned to it", function () {
        incidentModel.set("status", XM.Incident.CLOSED);
        incidentModel.set("assignedTo", new XM.UserAccountRelation());
        assert.equal(incidentModel.get("status"), XM.Incident.CLOSED);
      });
      it("Incident status does not revert to assigned from resolved when user is assigned to it", function () {
        incidentModel.set("status", XM.Incident.RESOLVED);
        incidentModel.set("assignedTo", new XM.UserAccountRelation());
        assert.equal(incidentModel.get("status"), XM.Incident.RESOLVED);
      });
    });
    /**
    @member Privileges
    @memberof Incident
    @description Users with "ViewPersonalIncidents" privilege can read their personal Incidents
    but cannot read the contact's owned by other users. Users with "MaintainPersonalIncidents"
    privilege can create and update their personal Incidents but not the Incidents owned
    by other users
    */
    it.skip("Users with \"ViewPersonalIncidents\" privilege can read their personal Incidents" +
      "but cannot read the Incidents owned by other users. ", function () {
    });
    it.skip("Users with \"MaintainPersonalIncidents\" privilege can create, update or delete" +
    "their personal Incidents but not the Incidents owned by other users", function () {
    });
     /**
    @member Other
    @memberof Incident
    @description Comments panel should exist to add new comments to the Incident
    */
    it.skip("Comments panel should exist to add new comments to the Incident", function () {
    });
     /**
    @member Other
    @memberof Incident
    @description All Comment Types assigned to Incident should be available for selection
    */
    it.skip("All Comment Types assigned to Incident should be available for selection", function () {
    });
    /**
    @member Other
    @memberof Incident
    @description Documents panel should exist to connect the Incidents to : Account, contact,
      Customer, File, Incident, Item, Link, Incident, Project, To do
    */
    it.skip("Documents panel should exist to connect the Incidents to : Account, contact," +
      "Customer, File, Incident, Item, Link, Opportunity, Project, To do", function () {
    });
    it.skip("User should be able to detach an attached document from the Incident", function (){
    });
    /**
    @member Other
    @memberof Incident
    @description TO DO panel should exist to attach existing/new To Dos to the Incident
    */
    it.skip("TO DO panel should exist to attach existing/new To Dos to the Incident", function () {
    });
    /**
    @member Other
    @memberof Incident
    @description User should be able to detach an attached To do from the Incident screen
    */
    it.skip("User should be able to detach an attached To do from the Incident screen", function (){
    });
    /**
    @member Other
    @memberof Incident
    @description User should be able to open an attached To Do from the Incident screen
    */
    it.skip("User should be able to open an attached To Do from the Incident screen", function (){
    });
    /**
    @member Other
    @memberof Incident
    @description New/Attach buttons in the 'TO DO' panel should be disabled for a new Incident
    */
    it.skip("New/Attach buttons in the 'TO DO' panel should be disabled for a new Incident", function () {
    });
    /**
    @member Other
    @memberof Incident
    @description History panel should be available which displays the Incident history
    */
    it.skip("History panel should be available which displays the Incident history", function () {
    });
    /**
    @member Navigation
    @memberof Incident
    @description Contacts search should display only contacts related to the specific account, if
    account is already selected
    */
    it.skip("Contacts search should display only contacts related to the specific account", function () {
    });
    /**
    @member Other
    @memberof Incident
    @description Characteristics Drop down list should display the characteristics assigned to the
     Incidents
    */
    it.skip("Characteristics Drop down list should display incident characteristics", function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());

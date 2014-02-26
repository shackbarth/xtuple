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
   ["id", "number", "description", "category", "isPublic", "account", "contact",
    "priority", "status", "resolution", "severity", "owner", "assignedTo", "notes", "item",
    "recurrences", "created", "updated", "alarms", "history", "comments", "characteristics",
    "contacts", "items", "files", "urls", "accounts", "incidents", "uuid", "opportunities",
    "toDos", "toDoRelations", "project", "projects", "customers"]
    @class
    @alias Incident
    @property {String} Number
    @property {String} Description
    @property {IncidentCategory} Category
    @property {Boolean} isPublic
    @property {Account} Account
    @property {Contact} Contact
    @property {Priority} Priority
    @property {String} Status
    @property {IncidentResolution} Resolution
    @property {IncidentSeverity} Severity
    @property {UserAccount} Owner
    @property {Employee}  AssignedTo
    @property {String} Notes
    @property {Item} Item
    @property {Date} Created
    @property {Date} Updated
    @property {IncidentHistory} History
    @property {IncidentAlarm} Alarms
    @property {IncidentAccount} Accounts
    @property {IncidentComment} Comments
    @property {IncidentCharacterisitic} Characterisitcs
    @property {IncidentContacts} Contacts
    @property {IncidentIncidents} Incidents
    @property {IncidentItem} Items
    @property {IncidentFile} File
    @property {IncidentContact} Contact
    @property {IncidentUrl} Urls
    @property {IncidentIncident} Incidents
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
    @member -
    @memberof Incident
    @description The Incident has no cache defined
    */
    cacheName: null,
    listKind: "XV.IncidentList",
    instanceOf: "XM.Document",
    /**
      @member -
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
      @member -
      @memberof Incident
      @description Used in the crm module
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof Incident
      @description Incidents can be read by users with "ViewAllIncidents" privilege and can be
      created, updated, or deleted by users with the "MaintainAllIncidents" privilege.
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
  exports.spec = spec;
  //exports.additionalTests = additionalTests;
}());
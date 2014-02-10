/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true,
require:true, assert:true, setTimeout:true, clearTimeout:true, exports:true,
it:true, describe:true, beforeEach:true, before:true, enyo:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    crud = require('../lib/crud'),
    assert = require("chai").assert;
  /**
    @class
    @alias ToDo
    @property {String} Name
    @property {String} Description
    @property {Account} Account
    @property {Contact} Contact
    @property {String} Status
    @property {Boolean} isActive
    @property {Date} StartDate
    @property {Date} DueDate
    @property {Date} AssignDate
    @property {Date} CompleteDate
    @property {String} notes
    @property {Priority} Priority
    @property {UserAccount} owner
    @property {UserAccount} AssignedTo
    @property {ToDoAlarm} Alarms
    @property {ToDoComment} Comments
    @property {ToDoAccount} Accounts
    @property {ToDoContact} Contacts
    @property {ToDoItem} Items
    @property {ToDoFile} Files
    @property {ToDoUrl} Urls
    @property {ToDoToDo} todos
    @property {ToDoIncident} Incidents
    @property {ToDoOpportunity} Opportunity
    @property {ToDoProject} Projects
    @property {ToDoCustomer} Customers
    */
  var spec = {
    recordType: "XM.ToDo",
    collectionType: "XM.ToDoListItemCollection",
    /**
      @member -
      @memberof ToDo
      @description The To Do Items collection is not cached.
    */
    cacheName: null,
    listKind: "XV.ToDoList",
    instanceOf: "XM.Model",
    /**
      @member -
      @memberof ToDo
      @description ToDo is lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof ToDo
      @description The ID attribute is "uuid"
    */
    idAttribute: "uuid",
    attributes: ["id", "uuid", "name", "description", "account", "contact", "status",
                    "statusProxy", "isActive", "startDate", "dueDate", "assignDate",
                    "completeDate", "notes", "priority", "owner", "assignedTo", "alarms",
                    "comments", "accounts", "contacts", "items", "files", "urls", "toDos",
                    "incident", "opportunity", "incidents", "opportunities", "projects",
                    "customers"],
    requiredAttributes: ["name", "dueDate", "uuid"],
    /**
      @member -
      @memberof ToDo
      @description To Do Items are used in CRM module
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof ToDo
      @description Users can create, update, and delete ToDos if they have the
        'MaintainAllToDoItems' privilege, and they can read ToDos if they have
        the 'ViewAllToDoItems' privilege.
    */
    privileges: {
      createUpdateDelete: ["MaintainAllToDoItems", "MaintainPersonalToDoItems"],
      read: ["ViewAllToDoItems", "ViewPersonalToDoItems"]
    },
    createHash: {
      name: "ToDo Name" + Math.random(),
      dueDate: new Date()
    },
    updateHash: {
      name: "Updated" + Math.random()
    }
  };
  var additionalTests = function () {
    /**
    @member -
    @memberof ToDo
    @description ToDo list should be printable
    */
    it.skip("ToDo Itemslist should be printable", function () {
    });
    /**
    @member -
    @memberof ToDo
    @description ToDo Item should be printable
    */
    it.skip("To Do Item should be printable", function () {
    });
    /**
    @member -
    @memberof ToDo
    @description Comments panel should exist to add comments to the To Do item
    */
    it.skip("Comments panel should exist to add comments to the To Do item", function () {
    });
    /**
    @member -
    @memberof ToDo
    @description Comment types assigned to To Do should be available for selection in Comment
    Types picker
    */
    it.skip("Comment types assigned to To Do should be available for selection in Comment Types" +
    "picker", function () {
    });
    /**
    @member -
    @memberof ToDo
    @description Documents panel should exist to link the To Do Item to New/Existing Account,
    contact, Customer, File, Incident, Item, Link, Opportunity, Project, To do
    */
    it.skip("Documents panel should exist to link the To Do Item to New/Existing Account, " +
      "contact, Customer, File, Incident, Item, Link, Opportunity, Project, To do", function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());

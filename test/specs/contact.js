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
  Contacts are people who may be associated directly with CRM accounts, customers,
  ship-to addresses, vendors, vendor addresses, and sites.
    @class
    @alias Contact
    @property {String} Number [Required] Displays the system-defined number used to identify the contact.
    @property {Boolean} isActive Select if you are actively doing business with this contact. Not selecting makes the contact inactive.
    @property {String} Honorific
    @property {String} FirstName
    @property {String} MiddleName
    @property {String} LastName
    @property {String} Suffix
    @property {String} JobTitle
    @property {String} Initials
    @property {String} phone
    @property {String} alternative
    @property {String} fax
    @property {String} PrimaryEmail
    @property {String} WebAddress
    @property {Account} Account
    @property {UserAccount} owner
    @property {String} notes
    @property {Address} Address
    @property {String} email
    @property {String} Comments
    @property {ContactCharacteristics} Characteristics
    @property {ContactAccounts} Accounts
    @property {ContactContacts} Contacts
    @property {ContactItems} Items
    @property {ContactFiles} Files
    @property {ContactUrls} Urls
    @property {ContactUsers} ContactUsers
    @property {ContactIncidents} Incidents
    @property {ContactOpportunities} Opportunities
    @property {ContactToDos} Todos
    @property {ContactProjects} Projects
    @property {ContactCustomers} Customers
  */
  var spec = {
    recordType: "XM.Contact",
    collectionType: null,
    /**
    @member -
    @memberof Contact.prototype
    @description The Contact has no cache defined
    */
    cacheName: null,
    listKind: "XV.ContactList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Contact.prototype
      @description Contacts are lockable.
    */
    isLockable: true,
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["id", "number", "isActive", "honorific", "firstName", "middleName", "lastName",
    "suffix", "jobTitle", "initials", "phone", "alternate", "fax", "primaryEmail", "webAddress",
    "account", "owner", "notes", "address", "email", "comments", "characteristics", "accounts",
    "contacts", "items", "files", "urls", "crmaccountUsers", "incidents", "opportunities",
    "toDos", "incidentRelations", "opportunityRelations", "toDoRelations", "projects",
    "projectRelations", "customers"],
    requiredAttributes: ["number"],
    /**
      @member -
      @memberof Contact.prototype
      @description Used in the crm and project module
    */
    extensions: ["crm", "project"],
    /**
      @member -
      @memberof Contact.prototype
      @description Contacts can be read by users with "ViewAllContacts" privilege and can be
      created, updated, or deleted by users with the "MaintainAllContacts" privilege.
    */
    privileges: {
      createUpdateDelete: ["MaintainAllContacts", "MaintainPersonalContacts"],
      read: ["ViewAllContacts", "ViewPersonalContacts"]
    },
    createHash: {
      firstName: "Michael" + Math.random(),
      middleName: "mtext",
      lastName: "ltext",
      suffix: "Jr",
      jobTitle: "Dev",
      phone: "111-222-333",
      webAddress: "www.example.com",
      primaryEmail: "modonnell@xtuple.com",
      account: { number: "TTOYS"},
      notes: "contact notes"
    },
    beforeSaveUIActions: [{
      it: "Can add an address",
      action: function (workspace, done) {
        workspace.$.addressWidget.edit();
        setTimeout(function () {
          workspace.$.addressWidget.$.line1.setValue("100 School Street");
          workspace.$.addressWidget.$.city.setValue("Carlisle");
          done();
        }, 1000);
      }
    }],
    updatableField: "firstName"
  };
  var additionalTests = function () {
  /**
    @member -
    @memberof Contact.prototype
    @description Users with "ViewPersonalContacts" privilege can read their personal contacts
    but cannot read the contact's owned by other users. Users with "MaintainPersonalContacts"
    privilege can create, update or delete their personal contacts but not the contacts owned
    by other users
    */
    it.skip("Users with \"ViewPersonalContacts\" privilege can read their personal contacts" +
      "but cannot read the contacts owned by other users. ", function () {
    });
    it.skip("Users with \"MaintainPersonalContacts\" privilege can create, update or delete" +
    "their personal contacts but not the contacts owned by other users", function () {
    });
      /**
    @member -
    @memberof Contact.prototype
    @description Comments panel should exist to add new comments to the Contact
    */
    it.skip("Comments panel should exist to add new comments to the Contact", function () {
    });
    /**
    @member -
    @memberof Contact.prototype
    @description Documents panel should exist to connect the Contacts to : Account, contact,
      Customer, File, Incident, Item, Link, Opportunity, Project, To do
    */
    it.skip("Documents panel should exist to connect the Contacts to : Account, contact," +
      "Customer, File, Incident, Item, Link, Opportunity, Project, To do", function () {
    });
    /**
    @member -
    @memberof Contact.prototype
    @description Email Addresses panel should exist to add email addresses related to the contact
    */
    it.skip("Email Addresses panel should exist to add email addresses related to the contact",
        function () {
    });
    /**
    @member -
    @memberof Contact.prototype
    @description TO DO panel should exist to attach existing/new To Dos to the Contact
    */
    it.skip("TO DO panel should exist to attach existing/new To Dos to the Contact", function () {
    });
    /**
    @member -
    @memberof Contact.prototype
    @description Opportunities panel should exist to attach existing/new Opportunities to the Contact
    */
    it.skip("Opportunities panel should exist to attach existing/new Opportunities to the Contact", function () {
    });
    /**
    @member -
    @memberof Contact.prototype
    @description Incidents panel should exist to attach existing/new Incidents to the Contact
    */
    it.skip("Incidents panel should exist to attach existing/new Incidents to the Contact", function () {
    });
    /**
    @member -
    @memberof Contact.prototype
    @description Projects panel should exist to attach existing/new Projects to the Contact
    */
    it.skip("Projects panel should exist to attach existing/new Projects to the Contact", function () {
    });
    /**
    @member -
    @memberof Contact.prototype
    @description Contacts attached as a primary/secondary contact to a CRM account cannot be
    deleted
    */
    it.skip("Contacts attached as a primary/secondary contact to a CRM account cannot be " +
    "deleted", function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());


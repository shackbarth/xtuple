/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Accounts are central to the xTuple CRM system. An Account holds information
  about an entity and serves to define it further as a Customer, Prospect, Vendor,
  Competitor, or Partner..
  @class
  @alias Account
  @property {String} Number
  @property {String} Name
  @property {Boolean} isActive
  @property {String} accountType
  @property {Account} parent
  @property {String} notes
  @property {Contact} PrimaryContact
  @property {Contact} SecondayContact
  @property {UserAccount} owner
  @property {Boolean} UserAccount
  @property {Boolean} Employee
  @property {Boolean} SalesRepresenatative
  @property {Boolean} TaxAuthority
  @property {Boolean} partner
  @property {Boolean} Competitor
  @property {Boolean} Customer
  @property {Boolean} Prospect
  @property {String} Comments
  @property {AccountCharacteristics} Characteristics
  @property {AccountContacts} contacts
  @property {AccountIncidents} incidents
  @property {AccountItems} Items
  @property {AccountFiles} Files
  @property {AccountUrls}  Urls
  @property {AccountAccounts} accounts
  @property {AccountOpportunities} Opportunities
  @property {AccountTodos} ToDos
  @property {AccountProjects} Projects
  **/
  var spec = {
    recordType: "XM.Account",
    collectionType: null,
    enforceUpperKey: true,
    listKind: "XV.AccountList",
    instanceOf: "XM.Document",
    attributes: ["id", "number", "name", "isActive", "accountType", "parent", "notes",
    "primaryContact", "secondaryContact", "contactRelations", "owner", "userAccount",
    "employee", "salesRep", "taxAuthority", "partner", "competitor", "comments",
    "characteristics", "contacts", "incidents", "items", "files", "urls", "accounts",
    "opportunities", "toDos", "incidentRelations", "opportunityRelations", "toDoRelations",
    "projects", "projectRelations", "customer", "prospect", "customers"],
    requiredAttributes: ["number", "name", "isActive", "accountType"],
    /**
      @member -
      @memberof Account.prototype
      @description The ID attribute is "number", which will not be automatically uppercased.
    */
    idAttribute: "number",
    /**
      @member -
      @memberof Account.prototype
      @description Used in the crm module
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof Account.prototype
      @description Accounts are lockable.
    */
    isLockable: true,
    /**
    @member -
    @memberof Account.prototype
    @description Account has no cache defined
    */
    cacheName: null,
    /**
      @member -
      @memberof Account.prototype
      @description Accounts can be read by users with "ViewAllCRMAccounts" privilege and can be 
        created, updated, or deleted by users with the "MaintainAllCRMAccounts" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainAllCRMAccounts",
      read: "ViewAllCRMAccounts"
    },
    createHash: {
      number: "Test_account" + Math.random(),
      name: "A test Account"
    },
    updatableField: "name"
  };
  var additionalTests = function () {
    /**
    @member -
    @memberof Account.prototype
    @description Users with "ViewPersonalCRMAccounts" privilege can read their personal accounts 
    but cannot read the accounts owned by other users. Users with "MaintainPersonalCRMAccounts" privilege
    can create, update or delete their personal accounts but not the accounts owned by other users 
    */
    it.skip("Users with \"ViewPersonalCRMAccounts\" privilege can read their personal accounts" +
      "but cannot read the Accounts owned by other users. ", function () {
    });
    it.skip("Users with \"MaintainPersonalCRMAccounts\" privilege can create, update or delete" +
    "their personal accounts but not the accounts owned by other users", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Assigning an account to itself as its parent should display an error dialog
      'Record is not allowed to reference itself as its parent'
    */
    it.skip("Assigning an account to itself as its parent should display an error dialog on" +
      "Save", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Selecting one of Roles: Customer,Prospect,Employee,Sales Rep,Tax Authority,
      'User account - should display the respective workspace with Number and Name populated
      by default
    */
    it.skip("Selecting one of Roles: Customer,Prospect,Employee,Sales Rep,Tax Authority," +
      "User account - should display the respective workspace with Number and Name populated" +
      "by default", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description If in unsaved state, Selecting one of Roles: Customer,Prospect,Employee,
      Sales Rep,Tax Authority,User account - should display the respective workspace with Number
      and Name populated by default
    */
    it.skip("If in unsaved state, selecting one of Roles: Customer,Prospect,Employee," +
      "Sales Rep,Tax Authority,User account - should display a dialog asking to save the record" +
      "before continuing", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Comments panel should exist to add new comments to the Account
    */
    it.skip("Comments panel should exist to add new comments to the Account", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Documents panel should exist to connect the Accounts to : Account, contact,
      Customer, File, Incident, Item, Link, Opportunity, Project, To do
    */
    it.skip("Documents panel should exist to connect the Accounts to : Account, contact," +
      "Customer, File, Incident, Item, Link, Opportunity, Project, To do", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Contacts panel should exist to attach existing/new contacts to the Account
    */
    it.skip("Contacts panel should exist to attach existing/new contacts to the Account", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description TO DO panel should exist to attach existing/new To Dos to the Account
    */
    it.skip("TO DO panel should exist to attach existing/new To Dos to the Account", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Opportunities panel should exist to attach existing/new Opportunities to the Account
    */
    it.skip("Opportunities panel should exist to attach existing/new Opportunities to the Account", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Incidents panel should exist to attach existing/new Incidents to the Account
    */
    it.skip("Incidents panel should exist to attach existing/new Incidents to the Account", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Projects panel should exist to attach existing/new Projects to the Account
    */
    it.skip("Projects panel should exist to attach existing/new Projects to the Account", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Delete option should be disabled for the Accounts with a role
    */
    it.skip("Accounts with a role cannot be deleted", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Delete option should be disabled for the Accounts assigned with a contact
    */
    it.skip("Accounts linked to a contact cannot be deleted", function () {
    });
    /**
    @member -
    @memberof Account.prototype
    @description Account Number should follow the Number policy in the Configure CRM screen
    */
    describe("Account Number should follow the Number policy in the Configure" +
    "CRM screen", function () {
      /**
      @member -
      @memberof Account.prototype
      @description - Account Number should be blank for a new Account when Number policy is
      set to 'Manual'
      */
      it.skip("Account Number should be blank for a new Account when Number policy is" +
      "set to 'Manual'", function () {
      });
      /**
      @member -
      @memberof Account.prototype
      @description - Account Number should be populated with 'Next Number' for a new Account
      when Number policy is set to 'Automatic'
      */
      it.skip("Account Number should be populated with 'Next Number' for a new Account " +
      "when Number policy is set to 'Automatic'", function () {
      });
      /**
      @member -
      @memberof Account.prototype
      @description - Account Number should be populated with 'Next Number' but editable for a
      new Account when Number policy is set to 'Override Allowed'
      */
      it.skip("Account Number should be populated with 'Next Number' but editable for a " +
      "new Account when Number policy is set to 'Override Allowed'", function () {
      });
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());

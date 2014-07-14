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
    smoke = require("../lib/smoke"),
    common = require("../lib/common"),
    crud = require('../lib/crud'),
    assert = require("chai").assert;
    /**
    The "Customers" screen lists all your company's Customers. In addition, the screen can be
    used to generate Customer reports(for example, Customers by Customer Type)
    @class
    @alias Customer
    @property {String} id The ID attribute
    @property {String} Number
    @property {String} Name
    @property {CustomerType} CustomerType
    @property {Boolean} isActive
    @property {String} notes
    @property {Contact} BillingContact
    @property {String} CorrespondenceContact
    @property {SalesRep} SalesRep
    @property {Number} Commission
    @property {ShipVia} ShipVia
    @property {String} ShipCharge
    @property {Boolean} isFreeFormShipTo
    @property {Boolean} isFreeFormBillto
    @property {Terms} Terms
    @property {String} Discount
    @property {Currency} Currency
    @property {String} CreditStatus
    @property {String} BalanceMethod
    @property {String} CreditLimit
    @property {Currency} CreditLimitCurrency
    @property {String} CreditRating
    @property {Number} GraceDays
    @property {TaxZone} TaxZone
    @property {ShipTo} ShipTos
    @property {String} Comments
    @property {TaxRegistration} TaxRegistration
    @property {CustomerCharacteristics} Characteristics
    @property {CustomerAccounts} Accounts
    @property {CustomerContacts} Contacts
    @property {CustomerItems} Items
    @property {CustomerFiles} Files
    @property {CustomerUrls} Urls
    @property {CustomerRelatedCustomers} Customers
    @property {Site} PreferredSite
    @property {CreditCards} CreditCards
    @property {CustomerAccount} CRMAccount
    */
  var spec = {
    recordType: "XM.Customer",
    collectionType: "XM.CustomerListItemCollection",
    /**
      @member -
      @memberof Customer
      @description The customer collection is not cached.
    */
    cacheName: null,
    listKind: "XV.CustomerList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Customer
      @description Customer is lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Customer
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["id", "number", "name", "customerType", "isActive", "notes", "billingContact",
    "correspondenceContact", "salesRep", "commission", "shipVia", "shipCharge",
    "isFreeFormShipto", "isFreeFormBillto", "terms", "discount", "currency", "creditStatus",
    "balanceMethod", "creditLimit", "creditLimitCurrency", "creditRating", "graceDays",
    "taxZone", "shiptos", "comments", "taxRegistration", "characteristics", "backorder",
    "partialShip", "blanketPurchaseOrders", "usesPurchaseOrders", "autoUpdateStatus",
    "autoHoldOrders", "accounts", "contacts", "items", "files", "urls", "customers",
    "preferredSite", "creditCards", "account", "contactRelations", "incidentRelations",
    "opportunityRelations", "toDoRelations", "projects", "quoteRelations", "salesOrderRelations"],
    requiredAttributes: ["number", "name", "isActive", "isFreeFormShipto", "isFreeFormBillto",
    "discount", "creditStatus", "balanceMethod", "backorder", "partialShip",
    "blanketPurchaseOrders", "usesPurchaseOrders", "autoUpdateStatus",
    "autoHoldOrders", "customerType", "salesRep", "shipCharge", "terms"],
    /**
      @member -
      @memberof Customer
      @description Used in the Billing and Sales modules
    */
    extensions: ["billing", "sales"],
    /**
      @member -
      @memberof Customer
      @description Users can create, update, and delete Customers if they have the
        'MaintainCustomerMasters' privilege, and they can read Customers if they have
        the 'ViewCustomerMasters' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainCustomerMasters",
      read: "ViewCustomerMasters"
    },
    createHash : require("../lib/model_data").customer,
    updatableField: "name",
    beforeSaveActions: [{
      it: "should add a credit card",
      action: function (data, next) {
        var creditCardModel = new XM.CreditCard(),
          creditCardHash = {
            creditCardType: "V",
            name: "John Smith",
            address1: "123 Main Street",
            city: "Norfolk",
            state: "VA",
            zip: "23510",
            country: "USA",
            monthExpired: "05",
            yearExpired: "2010",
            number: "4111111111111111",
            sequence: 500
          },
          setCreditCard = function () {
            creditCardModel.off("change:id", setCreditCard);
            creditCardModel.set(creditCardHash);
            data.model.get("creditCards").add(creditCardModel);
            next();
          };
        creditCardModel.on("change:uuid", setCreditCard);
        creditCardModel.initialize(null, {isNew: true});
        assert.isTrue(creditCardModel.canEdit("creditCardType"));
      }
    }],
    afterSaveActions: [{
      it: "should have saved the credit card correctly",
      action: function (data, next) {
        assert.equal(data.model.get("creditCards").models[0].get("number"), "************1111");
        next();
      }
    }, {
      it: "should not allow an edit to the saved credit card",
      action: function (data, next) {
        var creditCardModel = data.model.get("creditCards").models[0];
        assert.isFalse(creditCardModel.canEdit("creditCardType"));
        next();
      }
    }],
    beforeDeleteActions: crud.accountBeforeDeleteActions,
    afterDeleteActions: crud.accountAfterDeleteActions
  };
  var additionalTests = function () {
    it.skip("Billing contact and corresponding contact can be assigned to a customer", function () {
    });
    it.skip("Sales Commission should be displayed corresponding to the Sales Rep" +
    "selected", function () {
    });
    /**
    @member CustomerShipTo
    @memberof Customer
    @description Select to display Ship-To Addresses for the specified Customer. Every Customer can have
    multiple Ship-To Addresses, one for each of the destinations you ship goods to. Ship-To
    Addresses are specified at the point of Sales Order entry
    @property {String} id The ID attribute
    @property {Customer} customer
    @property {String} number
    @property {String} name
    @property {Boolean} isActive
    @property {Boolean} isDefault
    @property {SalesRep} SalesRep
    @property {Number} Commission
    @property {ShipZone} ShipZone
    @property {TaxZone} TaxZone
    @property {ShipVia} shipVia
    @property {ShipCharge} ShipCharge
    @property {Contact} Contact
    @property {Address} Address
    @property {String} Notes
    @property {String} ShippingNotes
    */
    describe("CustomerShipTo", function () {
      it.skip("Ship-Tos can be created, updated and deleted from the Customer" +
      "screen", function () {
      });
      it.skip("Ship To should include attributes: 'id', 'uuid', 'customer', 'number'," +
      "'name', 'isActive', 'isDefault', 'salesRep', 'commission', 'shipZone', 'taxZone'," +
      "'shipVia', 'shipCharge', 'contact', 'address', 'notes', 'shippingNotes'", function () {
      });
      /**
      @member -
      @memberof CustomerShipTo
      @description Users can create, update, and delete ShipTos if they have the
        'MaintainShiptos' privilege, and they can read ShipTos if they have
        the 'ViewShiptos' privilege.
    */
      it.skip("Users can create, update, and delete ShipTos if they have the" +
        "'MaintainShiptos' privilege, and they can read ShipTos if they have" +
        "the 'ViewShiptos' privilege", function () {
      });
    });
      /**
    @member -
    @memberof Customer
    @description Comments panel should exist to add new comments to the Customer
    */
    it.skip("Comments panel should exist to add new comments to the Customer", function () {
    });
    /**
    @member -
    @memberof Customer
    @description Documents panel should exist to connect the Customers to : Account, contact,
      Customer, File, Incident, Item, Link, Opportunity, Project, To do
    */
    it.skip("Documents panel should exist to connect the Customers to : Account, contact," +
      "Customer, File, Incident, Item, Link, Opportunity, Project, To do", function () {
    });
    /**
    @member -
    @memberof Customer
    @description Quotes panel should exist to attach existing/new Quotes to the Customer
    */
    it.skip("Quotes panel should exist to attach existing/new Quotes to the " +
    "Customer", function () {
    });
    /**
    @member -
    @memberof Customer
    @description Sales Orders panel should exist to attach existing/new SalesOrders to the Customer
    */
    it.skip("Sales Orders panel should exist to attach existing/new SalesOrders to the" +
    "Customer", function () {
    });
    /**
    @member -
    @memberof Customer
    @description Contacts panel should exist to attach existing/new contacts to the Customer
    */
    it.skip("Contacts panel should exist to attach existing/new contacts to the" +
    "Customer", function () {
    });
    /**
    @member -
    @memberof Customer
    @description TO DO panel should exist to attach existing/new To Dos to the Customer
    */
    it.skip("TO DO panel should exist to attach existing/new To Dos to the Customer", function () {
    });
    /**
    @member -
    @memberof Customer
    @description Opportunities panel should exist to attach existing/new Opportunities
    to the Customer
    */
    it.skip("Opportunities panel should exist to attach existing/new Opportunities to the" +
    "Customer", function () {
    });
    /**
    @member -
    @memberof Customer
    @description Incidents panel should exist to attach existing/new Incidents to the Customer
    */
    it.skip("Incidents panel should exist to attach existing/new Incidents to the Customer", function () {
    });
    /**
    @member CustomerTaxRegistration
    @memberof Customer
    @description Tax Registrations panel should exist to attach existing/new Tax Registrations
    to the Customer
    @property {String} id ID attribute
    @property {Customer} Customer
    @property {TaxAuthority} TaxAuthority
    @property {String} Number
    @property {TaxZone} TaxZone
    @property {Date} Effective
    @property {Date} Expires
    @property {String} notes
    */
    describe("Customer Tax Registration", function () {
      it.skip("A model XM.CustomerTaxRegistration should exist extending XM.Model", function () {
      });
      it.skip("Tax Registrations panel should exist to attach existing/new Tax Registrations" +
      "to the Customer", function () {
      });
      it.skip("Tax Registration should include attributes: 'id', 'uuid', 'customer', 'taxAuthority', " +
        "'number', 'taxZone', 'effective', 'expires', 'notes'", function () {
      });
       /**
      @member
      @memberof CustomerTaxRegistration
      @description Users can create, update, and delete Tax Registrations if they have the
        MaintainTaxRegistrations privilege, and they can read Tax Registrations if they have
        the ViewTaxRegistrations privilege.
      */
      it.skip("Users can create, update, and delete Tax Registrations if they have the" +
        "MaintainTaxRegistrations privilege, and they can read Tax Registrations if they have" +
        "the ViewTaxRegistrations privilege.", function () {
      });
    });
    /**
    @member -
    @memberof Customer
    @description Credit Cards panel should exist to create/edit Credit Cards
    */
    it.skip("Tax Registrations panel should exist to create,edit/Delete" +
    "Tax Registrations", function () {
    });
    /**
    @member -
    @memberof Customer
    @description Delete option should be disabled for the Customers with sales history
    */
    it.skip("Customers with sales history cannot be deleted", function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());

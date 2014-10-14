/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true,
require:true, assert:true, setTimeout:true, clearTimeout:true, exports:true,
it:true, describe:true, beforeEach:true, before:true, enyo:true */

(function () {
  "use strict";

/*
TODO: the following items are not yet done but need to be done by release

1. tax type defaults to item tax type if user has no OverrideTax privilege
*/

/*
TODO deferred to later sprint:

 * filter invoice list by customer group
 * print invoices (support printing more that 1 on the same screen)
 * inventory extensions
 * manufacturing extensions
 * get the tax summary and tax adjustment boxes in the same panel
 * Include a panel that displays credit allocations.
    - When clicked a "new" button should allow the user to create a new minimalized version
    of cash receipt on-the-fly. The cash receipt need only record the amount, currency,
    document number, document date, distribution date and whether the balance should
    generate a credit memo or a customer deposit, depending on global customer deposit metrics.
    "EnableCustomerDeposit"
    - When clicked, an "allocate" button should present a list of open receivables that are
    credits that can be associated with the invoice.
    - The 2 buttons above should only be enabled if the user has the "ApplyARMemos" privilege.
*/
  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    common = require("../lib/common"),
    assert = require("chai").assert,
    invoiceModel,
    lineModel,
    allocationModel,
    invoiceTaxModel,
    usd,
    gbp,
    nctax,
    nctaxCode,
    ttoys,
    vcol,
    bpaint,
    btruck;


  /**
    Here is some high-level description of what an invoice is supposed to do.
    @class
    @alias Invoice
    @property {String} number [that is the documentKey and idAttribute.] (Next available Invoice Number will automatically display, unless your system requires you to enter Invoice Numbers manually. Default values and input parameters for Invoice Numbers are configurable at the system level.)
    @property {Date} invoiceDate [required default today] (By default, the current day's date will be entered.)
    @property {Boolean} isPosted [required, defaulting to false, read only]
    @property {Boolean} isVoid [required, defaulting to false, read only]
    @property {BillingCustomer} customer [required] (Enter the Customer Number of the Customer to be billed. The lookup feature located to the right of the field leads to a searchable Customers list. You may also access this list using the keyboard shortcut "CTRL + L". Once a Customer Number is entered, the Customer name and billing address will display. Select the "?" or "$" symbol to view Customer information for the specified Customer. If a Customer's credit is "In Good Standing," the button will feature a black question mark ("?") icon. If the icon turns to an orange dollar sign ("$"), the Customer's credit Status is "On Credit Warning." A red dollar sign ("$") indicates the Customer's credit Status is "On Credit Hold.")
    @property {String} billtoName
    @property {String} billtoAddress1 (Enter the Customer address where bills should be sent. By default, the billing address defined on the Customer master will be entered here.)
    @property {String} billtoAddress2 ()
    @property {String} billtoAddress3 ()
    @property {String} billtoCity ()
    @property {String} billtoState ()
    @property {String} billtoPostalCode ()
    @property {String} billtoCountry ()
    @property {String} billtoPhone ()
    @property {Currency} currency
    @property {Terms} terms (Specify the billing Terms for the Invoice. By default, the Customer's standard billing terms will appear in the field.)
    @property {SalesRep} salesRep (Specify the Sales Representative for the Invoice. By default, the Customer's designated Sales Representative will appear in the field.)
    @property {Percent} commission [required, default 0] By default, the commission percentage recorded on the Customer master will be automatically entered in this field. If for some reason you select a non-default Sales Representative at Order entry, the commission rate will not change. To adjust the commission rate, you must make the change manually.
    @property {SaleType} saleType
    @property {String} customerPurchaseOrderNumber PO #: Enter a Customer Purchase Order Number, as needed
    @property {TaxZone} taxZone (Specify the Tax Zone for the Invoice. By default, the main Tax Zone for the Customer will appear in the field. The Ship-To Address Tax Zone will be shown if a Ship-To Address is being used.)
    @property {String} notes (This is a scrolling text field with word-wrapping for entering Notes related to the Invoice. Notes entered on this screen will follow the Invoice through the billing process. For example, you may view notes associated with a posted Invoice within the Invoice Information report.)
    @property {InvoiceRelation} recurringInvoice
    @property {Money} allocatedCredit the sum of all allocated credits
    @property {Money} outstandingCredit the sum of all unallocated credits, not including
      cash receipts pending
    @property {Money} subtotal the sum of the extended price of all line items
    @property {Money} taxTotal the sum of all taxes inluding line items, freight and
      tax adjustments
    @property {Money} miscCharge read only (will be re-implemented as editable by Ledger)
    @property {Money} total the calculated total of subtotal + freight + tax + miscCharge
    @property {Money} balance the sum of total - allocatedCredit - authorizedCredit -
      outstandingCredit.
      - If sum calculates to less than zero, then the balance is zero.
    @property {InvoiceAllocation} allocations (Displays the monetary value of any Credit Memos and/or Credit Card charges which have been specifically allocated to the Invoice. To allocate Credit Memos to the Invoice, select the "Allocated C/M's" link.)
    @property {InvoiceTax} taxAdjustments
    @property {InvoiceLine} lineItems Display lists Line Items for this Invoice. A valid Customer Number must be entered in the "Customer #" field before Line Items can be added to the Order.
    @property {InvoiceCharacteristic} characteristics
    @property {InvoiceContact} contacts
    @property {InvoiceAccount} accounts
    @property {InvoiceCustomer} customers
    @property {InvoiceFile} files
    @property {InvoiceUrl} urls
    @property {InvoiceItem} items
    @property {String} orderNumber [Added by sales extension] (Will display the relevant Sales Order Number for Invoices generated from the Select for Billing process flow. If the Invoice is miscellaneous and was not generated by the Select for Billing process, then use this field for informational or reference purposes. Possible references might include Sales Order Number or Customer Purchase Order Number.)
    @property {Date} orderDate [Added by sales extension] By default, the current day's date will be entered.
    @property {InvoiceSalesOrder} salesOrders [Added by sales extension]
    @property {InvoiceIncident} incidents [Added by crm extension]
    @property {InvoiceOpportunity} opportunities [Added by crm extension]
  */
  var spec = {
    recordType: "XM.Invoice",
    collectionType: "XM.InvoiceListItemCollection",
    /**
      @member Other
      @memberof Invoice
      @description The invoice collection is not cached.
    */
    cacheName: null,
    listKind: "XV.InvoiceList",
    instanceOf: "XM.Document",
    /**
      @member Settings
      @memberof Invoice
      @description Invoice is lockable.
    */
    isLockable: true,
    /**
      @member Settings
      @memberof Invoice
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["number", "invoiceDate", "isPosted", "isVoid", "customer",
      "billtoName", "billtoAddress1", "billtoAddress2", "billtoAddress3",
      "billtoCity", "billtoState", "billtoPostalCode", "billtoCountry",
      "billtoPhone", "currency", "terms", "salesRep", "commission",
      "saleType", "customerPurchaseOrderNumber", "taxZone", "notes",
      "recurringInvoice", "allocatedCredit", "outstandingCredit", "subtotal",
      "taxTotal", "miscCharge", "total", "balance", "allocations",
      "taxAdjustments", "lineItems", "characteristics", "contacts",
      "accounts", "customers", "files", "urls", "items",
      "orderNumber", "orderDate", "salesOrders", // these 3 from sales extension
      "incidents", "opportunities", // these 2 from crm
      "project", "projects"], // these 2 from project
    requiredAttributes: ["number", "invoiceDate", "isPosted", "isVoid",
      "customer", "commission"],
    defaults: {
      invoiceDate: new Date(),
      isPosted: false,
      isVoid: false,
      commission: 0
    },
    /**
      @member Setup
      @memberof Invoice
      @description Used in the billing module
    */
    extensions: ["billing"],
    /**
      @member Privileges
      @memberof Invoice
      @description Users can create, update, and delete invoices if they have the
        MaintainMiscInvoices privilege.
    */
    /**
      @member Privileges
      @memberof Invoice
      @description Users can read invoices if they have the ViewMiscInvoices privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainMiscInvoices",
      read: "ViewMiscInvoices"
    },
    createHash: {
      number: "30" + (100 + Math.round(Math.random() * 900)),
      customer: {number: "TTOYS"}
    },
    updatableField: "notes",
    beforeSaveActions: [{it: 'sets up a valid line item',
      action: require("./sales_order").getBeforeSaveAction("XM.InvoiceLine")}],
    skipSmoke: true,
    beforeSaveUIActions: [{it: 'sets up a valid line item',
      action: function (workspace, done) {
        var gridRow;

        workspace.value.on("change:total", done);
        workspace.$.lineItemBox.newItem();
        gridRow = workspace.$.lineItemBox.$.editableGridRow;
        // TODO
        //gridRow.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel,
          //site: submodels.siteModel}});
        gridRow.$.quantityWidget.doValueChange({value: 5});

      }
    }]
  };

  var additionalTests = function () {
    /**
      @member Settings
      @memberof Invoice
      @description There is a setting "Valid Credit Card Days"
      @default 7
    */
    describe("Setup for Invoice", function () {
      it("The system settings option CCValidDays will default to 7 if " +
          "not already in the db", function () {
        assert.equal(XT.session.settings.get("CCValidDays"), 7);
      });
      /**
        @member Settings
        @memberof Invoice
        @description Characteristics can be assigned as being for invoices
      */
      it("XM.Characteristic includes isInvoices as a context attribute", function () {
        var characteristic = new XM.Characteristic();
        assert.isBoolean(characteristic.get("isInvoices"));
      });
      /**
        @member InvoiceCharacteristic
        @memberof Invoice
        @description Follows the convention for characteristics
        @see Characteristic
      */
      it("convention for characteristic assignments", function () {
        var model;

        assert.isFunction(XM.InvoiceCharacteristic);
        model = new XM.InvoiceCharacteristic();
        assert.isTrue(model instanceof XM.CharacteristicAssignment);
      });
      it("can be set by a widget in the characteristics workspace", function () {
        var characteristicWorkspace = new XV.CharacteristicWorkspace();
        assert.include(_.map(characteristicWorkspace.$, function (control) {
          return control.attr;
        }), "isInvoices");
      });
    });
    /**
      @member Settings
      @memberof Invoice
      @description Documents should exist to connect an invoice to:
        Contact, Account, Customer, File, Url, Item
    */
    describe("Nested-only Document associations per the document convention", function () {
      it("XM.InvoiceContact", function () {
        assert.isFunction(XM.InvoiceContact);
        assert.isTrue(XM.InvoiceContact.prototype.isDocumentAssignment);
      });
      it("XM.InvoiceAccount", function () {
        assert.isFunction(XM.InvoiceAccount);
        assert.isTrue(XM.InvoiceAccount.prototype.isDocumentAssignment);
      });
      it("XM.InvoiceCustomer", function () {
        assert.isFunction(XM.InvoiceCustomer);
        assert.isTrue(XM.InvoiceCustomer.prototype.isDocumentAssignment);
      });
      it("XM.InvoiceFile", function () {
        assert.isFunction(XM.InvoiceFile);
        assert.isTrue(XM.InvoiceFile.prototype.isDocumentAssignment);
      });
      it("XM.InvoiceUrl", function () {
        assert.isFunction(XM.InvoiceUrl);
        assert.isTrue(XM.InvoiceUrl.prototype.isDocumentAssignment);
      });
      it("XM.InvoiceItem", function () {
        assert.isFunction(XM.InvoiceItem);
        assert.isTrue(XM.InvoiceItem.prototype.isDocumentAssignment);
      });
    });
    describe("InvoiceLine", function () {
      before(function (done) {
        async.parallel([
          function (done) {
            common.fetchModel(bpaint, XM.ItemRelation, {number: "BPAINT1"}, function (err, model) {
              bpaint = model;
              done();
            });
          },
          function (done) {
            common.fetchModel(btruck, XM.ItemRelation, {number: "BTRUCK1"}, function (err, model) {
              btruck = model;
              done();
            });
          },
          function (done) {
            common.initializeModel(invoiceModel, XM.Invoice, function (err, model) {
              invoiceModel = model;
              done();
            });
          },
          function (done) {
            common.initializeModel(lineModel, XM.InvoiceLine, function (err, model) {
              lineModel = model;
              done();
            });
          },
          function (done) {
            usd = _.find(XM.currencies.models, function (model) {
              return model.get("abbreviation") === "USD";
            });
            gbp = _.find(XM.currencies.models, function (model) {
              return model.get("abbreviation") === "GBP";
            });
            done();
          }
        ], done);
      });
      /**
        @member InvoiceLineTax
        @memberof InvoiceLine
        @description Contains the tax of an invoice line.
        @property {String} uuid The ID attribute ()
        @property {TaxType} taxType
        @property {TaxCode} taxCode
        @property {Money} amount
      */
      it("has InvoiceLineTax as a nested-only model extending XM.Model", function () {
        var attrs = ["uuid", "taxType", "taxCode", "amount"],
          model;

        assert.isFunction(XM.InvoiceLineTax);
        model = new XM.InvoiceLineTax();
        assert.isTrue(model instanceof XM.Model);
        assert.equal(model.idAttribute, "uuid");
        assert.equal(_.difference(attrs, model.getAttributeNames()).length, 0);
      });
      it.skip("XM.InvoiceLineTax can be created, updated and deleted", function () {
        // TODO: put under test (code is written)
      });
      it.skip("A view should be used underlying XM.InvoiceLineTax that does nothing " +
          "after insert, update or delete (existing table triggers for line items will " +
          "take care of populating this data correctly)", function () {
        // TODO: put under test (code is written)
      });
      /**
        @class
        @alias InvoiceLine
        @description Represents a line of an invoice. Only ever used within the context of an
          invoice.
        @property {String} uuid [The ID attribute] ()
        @property {Number} lineNumber required
        @property {ItemRelation} item
        @property {SiteRelation} site defaults to the system default site
        @property {String} customerPartNumber
        @property {Boolean} isMiscellaneous false if item number set, true if not.
        @property {String} itemNumber
        @property {String} itemDescription
        @property {SalesCategory} salesCategory
        @property {Quantity} quantity
        @property {Unit} quantityUnit
        @property {Number} quantityUnitRatio
        @property {Quantity} billed
        @property {Number} customerPrice
        @property {SalesPrice} price
        @property {Unit} priceUnit
        @property {Number} priceUnitRatio
        @property {ExtendedPrice} extendedPrice billed * quantityUnitRatio *
          (price / priceUnitRatio)
        @property {Number} notes
        @property {TaxType} taxType
        @property {Money} taxTotal sum of all taxes
        @property {InvoiceLineTax} taxes
      */
      var invoiceLine = it("A nested only model called XM.InvoiceLine extending " +
          "XM.Model should exist", function () {
        var lineModel;
        assert.isFunction(XM.InvoiceLine);
        lineModel = new XM.InvoiceLine();
        assert.isTrue(lineModel instanceof XM.Model);
        assert.equal(lineModel.idAttribute, "uuid");
      });
      it.skip("InvoiceLine should include attributes x, y, and z", function () {
        // TODO: put under test (code is written)
      });
      /**
        @member Settings
        @memberof InvoiceLine
        @description InvoiceLine keeps track of the available selling units of measure
        based on the selected item, in the "sellingUnits" property
      */
      it("should include a property \"sellingUnits\" that is an array of available selling " +
          "units of measure based on the selected item", function () {
        var lineModel = new XM.InvoiceLine();
        assert.isObject(lineModel.sellingUnits);
      });
      /**
        @member Other
        @memberof InvoiceLine
        @description When the item is changed the following should be updated from item information:
          sellingUnits, quantityUnit, quantityUnitRatio, priceUnit, priceUnitRatio, unitCost
          and taxType. Then, the price should be recalculated.
      */
      it("XM.InvoiceLine should have a fetchSellingUnits function that updates " +
          "sellingUnits based on the item selected", function () {
        assert.isFunction(lineModel.fetchSellingUnits);
      });
      it("itemDidChange should recalculate sellingUnits, quantityUnit, quantityUnitRatio, " +
          "priceUnit, priceUnitRatio, " +
          "and taxType. Also calculatePrice should be executed.", function (done) {
        this.timeout(4000);

        assert.equal(lineModel.sellingUnits.length, 0);
        assert.isNull(lineModel.get("quantityUnit"));
        assert.isNull(lineModel.get("priceUnit"));
        assert.isNull(lineModel.get("taxType"));
        lineModel.set({item: btruck});

        setTimeout(function () {
          assert.equal(lineModel.sellingUnits.length, 1);
          assert.equal(lineModel.sellingUnits.models[0].id, "EA");
          assert.equal(lineModel.get("quantityUnit").id, "EA");
          assert.equal(lineModel.get("priceUnit").id, "EA");
          assert.equal(lineModel.get("priceUnitRatio"), 1);
          assert.equal(lineModel.get("quantityUnitRatio"), 1);
          assert.equal(lineModel.get("taxType").id, "Taxable");
          done();
        }, 3000); // TODO: use an event. headache because we have to wait for several
      });
      /**
        @member Settings
        @memberof InvoiceLine
        @description Quantity and billed values can be fractional only if the item allows it
      */
      it("When the item isFractional attribute === false, decimal numbers should not be allowed " +
          "for quantity and billed values.", function () {
        lineModel.set({billed: 1, quantity: 1.5});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({quantity: 2});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
        lineModel.set({billed: 1.5});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({billed: 2});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
      });
      it("When the item isFractional attribute === true, decimal numbers should be allowed " +
          "for quantity values.", function (done) {
        lineModel.set({item: bpaint, quantity: 1.5});
        setTimeout(function () {
          assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
          done();
        }, 1900); // wait for line._isItemFractional to get updated from the item
      });
      it("When the item isFractional attribute === true, decimal numbers should be allowed " +
          "for billed values.", function () {
        lineModel.set({billed: 1.5, quantity: 2});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
      });
      /**
        @member Settings
        @memberof InvoiceLine
        @description The "ordered" and "billed" amounts must be positive
      */
      it("Ordered should only allow positive values", function () {
        lineModel.set({quantity: -1});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({quantity: 0});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({quantity: 2});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
      });
      it("Billed should only allow positive values", function () {
        lineModel.set({billed: -1});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({billed: 0});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({billed: 2});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
      });
      /**
        @member Settings
        @memberof InvoiceLine
        @description When item is unset, all item-related values should be cleared.
      */
      it("If item is unset, the above values should be cleared.", function (done) {
        // relies on the fact that the item was set above to something
        this.timeout(4000);
        lineModel.set({item: null});

        setTimeout(function () {
          assert.equal(lineModel.sellingUnits.length, 0);
          assert.isNull(lineModel.get("quantityUnit"));
          assert.isNull(lineModel.get("priceUnit"));
          assert.isNull(lineModel.get("taxType"));
          done();
        }, 3000); // TODO: use an event. headache because we have to wait for several
      });
      /**
        @member Privileges
        @memberof InvoiceLine
        @description User requires the "OverrideTax" privilege to edit the tax type.
      */
      it.skip("User requires the OverrideTax privilege to edit the tax type", function () {
        // TODO: write code and put under test
        //HINT: Default tax type must be enforced by a trigger on the database if no privilege.
        assert.fail();
      });
      it("lineNumber must auto-number itself sequentially", function () {
        var dummyModel = new XM.InvoiceLine();
        assert.isUndefined(lineModel.get("lineNumber"));
        invoiceModel.get("lineItems").add(dummyModel);
        invoiceModel.get("lineItems").add(lineModel);
        assert.equal(lineModel.get("lineNumber"), 2);
        invoiceModel.get("lineItems").remove(dummyModel);
        // TODO: be more thorough
      });
      /**
        @member Settings
        @memberof Invoice
        @description Currency field should be read only after a line item is added to the invoice
      */
      it("Currency field should be read-only after a line item is added to the invoice",
          function () {
        assert.isTrue(invoiceModel.isReadOnly("currency"));
      });
      /**
        @member Settings
        @memberof InvoiceLine
        @description The user can define a line item as being miscellaneous or not.
          Miscellaneous means that they can enter a free-form itemNumber, itemDescription,
          and salesCategory. If the item is not miscellaneous then they must choose
          an item instead.
      */
      it("When isMiscellaneous is false, item is editable and itemNumber, itemDescription " +
          " and salesCategory are read only", function () {
        lineModel.set({isMiscellaneous: false});
        assert.isFalse(lineModel.isReadOnly("item"));
        assert.isTrue(lineModel.isReadOnly("itemNumber"));
        assert.isTrue(lineModel.isReadOnly("itemDescription"));
        assert.isTrue(lineModel.isReadOnly("salesCategory"));
      });
      it("When isMiscellaneous is true, item is read only and itemNumber, itemDescription " +
          " and salesCategory are editable.", function () {
        lineModel.set({isMiscellaneous: true});
        assert.isTrue(lineModel.isReadOnly("item"));
        assert.isFalse(lineModel.isReadOnly("itemNumber"));
        assert.isFalse(lineModel.isReadOnly("itemDescription"));
        assert.isFalse(lineModel.isReadOnly("salesCategory"));
      });
      it("If isMiscellaneous === false, then validation makes sure an item is set.", function () {
        lineModel.set({isMiscellaneous: false, item: null});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({item: bpaint});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
      });
      it("If isMiscellaneous === true then validation makes sure the itemNumber, " +
          "itemDescription and salesCategory are set", function () {
        lineModel.set({isMiscellaneous: true, itemDescription: null});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({
          itemNumber: "P",
          itemDescription: "Paint",
          salesCategory: new XM.SalesCategory()
        });
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
      });
      it.skip("XM.InvoiceLine should have a calculatePrice function that retrieves a price from " +
          "the customer.itemPrice dispatch function based on the billed value.", function () {
        // TODO: put under test (code is written)
        assert.fail();
      });
    });
    describe("XM.InvoiceListItem", function () {
      // TODO:posting and voiding work, anecdotally. Put it under test.
      it.skip("XM.InvoiceListItem includes a post function that dispatches a " +
          "XM.Invoice.post function to the server", function () {
        var model = new XM.InvoiceListItem();
        assert.isFunction(model.doPost);
        /*
        model.set({number: "999"});
        model.doPost({
          success: function () {
            console.log("success", arguments);
            done();
          },
          error: function () {
            console.log("error", arguments);
          }
        });
        */
      });
      // this should really be under better test
      it.skip("XM.InvoiceListItem includes a void function that dispatches a " +
          "XM.Invoice.void function to the server", function () {
        var model = new XM.InvoiceListItem();
        assert.isFunction(model.doVoid);
      });
    });
    describe("XM.Invoice", function () {
      before(function (done) {
        async.parallel([
          function (done) {
            common.fetchModel(ttoys, XM.BillingCustomer, {number: "TTOYS"}, function (err, model) {
              ttoys = model;
              done();
            });
          },
          function (done) {
            common.fetchModel(vcol, XM.BillingCustomer, {number: "VCOL"}, function (err, model) {
              vcol = model;
              done();
            });
          },
          function (done) {
            common.fetchModel(nctax, XM.TaxZone, {code: "NC TAX"}, function (err, model) {
              nctax = model;
              done();
            });
          },
          function (done) {
            common.fetchModel(nctaxCode, XM.TaxCode, {code: "NC TAX-A"}, function (err, model) {
              nctaxCode = model;
              done();
            });
          },
          function (done) {
            common.initializeModel(invoiceTaxModel, XM.InvoiceTax, function (err, model) {
              invoiceTaxModel = model;
              done();
            });
          },
          function (done) {
            common.initializeModel(allocationModel, XM.InvoiceAllocation, function (err, model) {
              allocationModel = model;
              done();
            });
          }
        ], done);
      });

      //
      // Note: the other required fields in taxhist should be populated with the following:
      // basis: 0
      // percent: 0
      // amount: 0
      // docdate: invoice date
      // taxtype: 3. Yes, 3.
      //
      /**
        @member InvoiceTax
        @memberof Invoice
        @description Invoice tax adjustments
        @property {String} uuid ()
        @property {TaxCode} taxCode
        @property {Money} amount
      */
      it("A nested only model called XM.InvoiceTax extending XM.Model should exist", function () {
        assert.isFunction(XM.InvoiceTax);
        var invoiceTaxModel = new XM.InvoiceTax(),
          attrs = ["uuid", "taxCode", "amount"];

        assert.isTrue(invoiceTaxModel instanceof XM.Model);
        assert.equal(invoiceTaxModel.idAttribute, "uuid");
        assert.equal(_.difference(attrs, invoiceTaxModel.getAttributeNames()).length, 0);
      });
      /**
        @member Settings
        @memberof Invoice
        @description The invoice numbering policy can be determined by the user.
      */
      it("XM.Invoice should check the setting for InvcNumberGeneration to determine " +
          "numbering policy", function () {
        var model;
        XT.session.settings.set({InvcNumberGeneration: "M"});
        model = new XM.Invoice();
        assert.equal(model.numberPolicy, "M");
        XT.session.settings.set({InvcNumberGeneration: "A"});
        model = new XM.Invoice();
        assert.equal(model.numberPolicy, "A");
      });
      /**
        @member InvoiceAllocation
        @memberof Invoice
        @description Invoice-level allocation information
        @property {String} uuid ()
        @property {String} invoice [XXX String or Number?]
        @property {Money} amount
        @property {Currency} currency
      */
      it("A nested only model called XM.InvoiceAllocation extending XM.Model " +
          "should exist", function () {
        assert.isFunction(XM.InvoiceAllocation);
        var invoiceAllocationModel = new XM.InvoiceAllocation(),
          attrs = ["uuid", "invoice", "amount", "currency"];

        assert.isTrue(invoiceAllocationModel instanceof XM.Model);
        assert.equal(invoiceAllocationModel.idAttribute, "uuid");
        assert.equal(_.difference(attrs, invoiceAllocationModel.getAttributeNames()).length, 0);
      });
      it("XM.InvoiceAllocation should only be updateable by users with the ApplyARMemos " +
          "privilege.", function () {
        XT.session.privileges.attributes.ApplyARMemos = false;
        assert.isFalse(XM.InvoiceAllocation.canCreate());
        assert.isTrue(XM.InvoiceAllocation.canRead());
        assert.isFalse(XM.InvoiceAllocation.canUpdate());
        assert.isFalse(XM.InvoiceAllocation.canDelete());
        XT.session.privileges.attributes.ApplyARMemos = true;
        assert.isTrue(XM.InvoiceAllocation.canCreate());
        assert.isTrue(XM.InvoiceAllocation.canRead());
        assert.isTrue(XM.InvoiceAllocation.canUpdate());
        assert.isTrue(XM.InvoiceAllocation.canDelete());
      });
      /**
        @member InvoiceListItem
        @memberof Invoice
        @description List-view summary information for an invoice
        @property {String} number
        @property {Boolean} isPrinted [XXX changed from printed]
        @property {BillingCustomer} customer
        @property {Date} invoiceDate
        @property {Money} total
        @property {Boolean} isPosted
        @property {Boolean} isVoid
        @property {String} orderNumber Added by sales extension
      */
      it("A model called XM.InvoiceListItem extending XM.Info should exist", function () {
        assert.isFunction(XM.InvoiceListItem);
        var invoiceListItemModel = new XM.InvoiceListItem(),
          attrs = ["number", "isPrinted", "customer", "invoiceDate", "total", "isPosted",
            "isVoid", "orderNumber"];

        assert.isTrue(invoiceListItemModel instanceof XM.Info);
        assert.equal(invoiceListItemModel.idAttribute, "number");
        assert.equal(_.difference(attrs, invoiceListItemModel.getAttributeNames()).length, 0);
      });
      it("Only users that have ViewMiscInvoices or MaintainMiscInvoices may read " +
          "XV.InvoiceListItem", function () {
        XT.session.privileges.attributes.ViewMiscInvoices = false;
        XT.session.privileges.attributes.MaintainMiscInvoices = false;
        XT.session.privileges.attributes.ViewPersonalCRMAccounts = false;
        assert.isFalse(XM.InvoiceListItem.canRead());

        XT.session.privileges.attributes.ViewMiscInvoices = true;
        XT.session.privileges.attributes.MaintainMiscInvoices = false;
        assert.isTrue(XM.InvoiceListItem.canRead());

        XT.session.privileges.attributes.ViewMiscInvoices = false;
        XT.session.privileges.attributes.MaintainMiscInvoices = true;
        assert.isTrue(XM.InvoiceListItem.canRead());

        XT.session.privileges.attributes.ViewMiscInvoices = true;
        XT.session.privileges.attributes.ViewPersonalCRMAccounts = true;
      });
      it("XM.InvoiceListItem is not editable", function () {
        assert.isFalse(XM.InvoiceListItem.canCreate());
        assert.isFalse(XM.InvoiceListItem.canUpdate());
        assert.isFalse(XM.InvoiceListItem.canDelete());
      });
      /**
        @member InvoiceRelation
        @memberof Invoice
        @description Summary information for an invoice
        @property {String} number
        @property {CustomerRelation} customer
        @property {Date} invoiceDate
        @property {Boolean} isPosted
        @property {Boolean} isVoid
      */
      it("A model called XM.InvoiceRelation extending XM.Info should exist with " +
          "attributes number (the idAttribute) " +
          "customer, invoiceDate, isPosted, and isVoid", function () {
        assert.isFunction(XM.InvoiceRelation);
        var invoiceRelationModel = new XM.InvoiceRelation(),
          attrs = ["number", "customer", "invoiceDate", "isPosted", "isVoid"];

        assert.isTrue(invoiceRelationModel instanceof XM.Info);
        assert.equal(invoiceRelationModel.idAttribute, "number");
        assert.equal(_.difference(attrs, invoiceRelationModel.getAttributeNames()).length, 0);

      });
      it("All users with the billing extension may read XV.InvoiceRelation.", function () {
        assert.isTrue(XM.InvoiceRelation.canRead());
      });
      it("XM.InvoiceRelation is not editable.", function () {
        assert.isFalse(XM.InvoiceRelation.canCreate());
        assert.isFalse(XM.InvoiceRelation.canUpdate());
        assert.isFalse(XM.InvoiceRelation.canDelete());
      });
      /**
        @member Settings
        @memberof Invoice
        @description When the customer changes, the billto information should be populated from
          the customer, along with the salesRep, commission, terms, taxZone, and currency.
          The billto fields will be read-only if the customer does not allow free-form billto.
      */
      it("When the customer changes on XM.Invoice, the following customer data should be " +
          "populated from the customer: billtoName (= customer.name), billtoAddress1, " +
          "billtoAddress2, billtoAddress3, billtoCity, billtoState, billtoPostalCode, " +
          "billtoCountry should be populated by customer.billingContact.address." +
          "salesRep, commission, terms, taxZone, currency, billtoPhone " +
          "(= customer.billingContact.phone)", function () {
        assert.isUndefined(invoiceModel.get("billtoName"));
        invoiceModel.set({customer: ttoys});
        assert.equal(invoiceModel.get("billtoName"), "Tremendous Toys Incorporated");
        assert.equal(invoiceModel.get("billtoAddress2"), "101 Toys Place");
        assert.equal(invoiceModel.get("billtoPhone"), "703-931-4269");
        assert.isString(invoiceModel.getValue("salesRep.number"),
          ttoys.getValue("salesRep.number"));
        assert.equal(invoiceModel.getValue("commission"), 0.075);
        assert.equal(invoiceModel.getValue("terms.code"), "2-10N30");
        assert.equal(invoiceModel.getValue("taxZone.code"), "VA TAX");
        assert.equal(invoiceModel.getValue("currency.abbreviation"), "USD");
      });
      it("The following fields will be set to read only if the customer does not allow " +
          "free form billto: billtoName, billtoAddress1, billtoAddress2, billtoAddress3, " +
          "billtoCity, billtoState, billtoPostalCode, billtoCountry, billtoPhone", function () {
        assert.isFalse(invoiceModel.isReadOnly("billtoName"), "TTOYS Name");
        assert.isFalse(invoiceModel.isReadOnly("billtoAddress3"), "TTOYS Address3");
        assert.isFalse(invoiceModel.isReadOnly("billtoPhone"), "TTOYS Phone");
        invoiceModel.set({customer: vcol});
        assert.isTrue(invoiceModel.isReadOnly("billtoName"), "VCOL Name");
        assert.isTrue(invoiceModel.isReadOnly("billtoAddress3"), "VCOL Address3");
        assert.isTrue(invoiceModel.isReadOnly("billtoPhone"), "VCOL Phone");
      });
      it("If the customer attribute is empty, the above fields should be unset.", function () {
        assert.isString(invoiceModel.get("billtoName"));
        invoiceModel.set({customer: null});
        assert.isUndefined(invoiceModel.get("billtoName"));
        assert.isUndefined(invoiceModel.get("billtoAddress2"));
        assert.isUndefined(invoiceModel.get("billtoPhone"));
        assert.isNull(invoiceModel.get("salesRep"));
        assert.isNull(invoiceModel.get("terms"));
        assert.isNull(invoiceModel.get("taxZone"));
        assert.isNull(invoiceModel.get("currency"));
      });
      /**
        @member Settings
        @memberof InvoiceLine
        @description The price will be recalculated when the units change.
      */
      it("If the quantityUnit or priceUnit are changed, \"calculatePrice\" should be " +
          "run.", function (done) {
        invoiceModel.set({customer: ttoys});
        assert.isUndefined(lineModel.get("price"));
        lineModel.set({item: btruck});
        lineModel.set({billed: 10});
        setTimeout(function () {
          assert.equal(lineModel.get("price"), 9.8910);
          done();
        }, 1900);
      });
      /**
        @member Settings
        @memberof InvoiceLine
        @description If price or billing change, extendedPrice should be recalculated.
      */
      it("If price or billing change, extendedPrice should be recalculated.", function () {
        assert.equal(lineModel.get("extendedPrice"), 98.91);
      });
      /**
        @member Settings
        @memberof InvoiceLine
        @description When billed is changed extendedPrice should be recalculated.
      */
      it("When billed is changed extendedPrice should be recalculated", function (done) {
        lineModel.set({billed: 20});
        setTimeout(function () {
          assert.equal(lineModel.get("extendedPrice"), 197.82);
          done();
        }, 1900);
      });
      /**
        @member Settings
        @memberof Invoice
        @description When currency or invoice date is changed outstanding credit should be
          recalculated.
      */
      it.skip("When currency or invoice date is changed outstanding credit should be recalculated",
          function (done) {

        this.timeout(9000);
        var outstandingCreditChanged = function () {
          if (invoiceModel.get("outstandingCredit")) {
            // second time, with valid currency
            invoiceModel.off("change:outstandingCredit", outstandingCreditChanged);
            assert.equal(invoiceModel.get("outstandingCredit"), 25250303.25);
            done();
          } else {
            // first time, with invalid currency
            invoiceModel.set({currency: usd});
          }
        };

        invoiceModel.on("change:outstandingCredit", outstandingCreditChanged);
        invoiceModel.set({currency: null});
      });
      /**
        @member Settings
        @memberof Invoice
        @description AllocatedCredit should be recalculated when XM.InvoiceAllocation records
          are added or removed.
      */
      it("AllocatedCredit should be recalculated when XM.InvoiceAllocation records " +
          "are added or removed", function () {
        assert.isUndefined(invoiceModel.get("allocatedCredit"));
        allocationModel.set({currency: usd, amount: 200});
        invoiceModel.get("allocations").add(allocationModel);
        assert.equal(invoiceModel.get("allocatedCredit"), 200);
      });
      /**
        @member Settings
        @memberof Invoice
        @description When invoice date is changed allocated credit should be recalculated.
      */
      it("When the invoice date is changed allocated credit should be recalculated", function () {
        allocationModel.set({currency: usd, amount: 300});
        assert.equal(invoiceModel.get("allocatedCredit"), 200);
        // XXX This is a wacky way to test this.
        // XXX Shouldn't the change to the allocated credit itself trigger a change
          //to allocatedCredit?
        invoiceModel.set({invoiceDate: new Date("1/1/2010")});
        assert.equal(invoiceModel.get("allocatedCredit"), 300);
      });
      /**
        @member Settings
        @memberof Invoice
        @description When subtotal, totalTax or miscCharge are changed, the total
          should be recalculated.
      */
      it("When subtotal, totalTax or miscCharge are changed, the total should be recalculated",
          function () {
        assert.equal(invoiceModel.get("total"), 207.71);
        invoiceModel.set({miscCharge: 40});
        assert.equal(invoiceModel.get("total"), 247.71);
      });
      /**
        @member Settings
        @memberof Invoice
        @description TotalTax should be recalculated when taxZone changes or
          taxAdjustments are added or removed.
      */
      it("TotalTax should be recalculated when taxZone changes.", function (done) {
        var totalChanged = function () {
          invoiceModel.off("change:total", totalChanged);
          assert.equal(invoiceModel.get("taxTotal"), 10.88);
          assert.equal(invoiceModel.get("total"), 248.70);
          done();
        };

        assert.equal(invoiceModel.get("taxTotal"), 9.89);
        invoiceModel.on("change:total", totalChanged);
        invoiceModel.set({taxZone: nctax});
      });
      it("TotalTax should be recalculated when taxAdjustments are added or removed.",
          function (done) {
        var totalChanged = function () {
          invoiceModel.off("change:total", totalChanged);
          assert.equal(invoiceModel.get("taxTotal"), 20.88);
          assert.equal(invoiceModel.get("total"), 258.70);
          done();
        };

        invoiceTaxModel.set({taxCode: nctaxCode, amount: 10.00});
        invoiceModel.on("change:total", totalChanged);
        invoiceModel.get("taxAdjustments").add(invoiceTaxModel);
      });
      it("The document date of the tax adjustment should be the invoice date.",
          function () {
        assert.equal(invoiceModel.get("invoiceDate"), invoiceTaxModel.get("documentDate"));
      });
      /**
        @member Settings
        @memberof Invoice
        @description When an invoice is loaded where "isPosted" is true, then the following
          attributes will be made read only:
          lineItems, number, invoiceDate, terms, salesrep, commission, taxZone, saleType
      */
      it("When an invoice is loaded where isPosted is true, then the following " +
          "attributes will be made read only: lineItems, number, invoiceDate, terms, " +
          "salesrep, commission, taxZone, saleType", function (done) {
        var postedInvoice = new XM.Invoice(),
          statusChanged = function () {
            if (postedInvoice.isReady()) {
              postedInvoice.off("statusChange", statusChanged);
              assert.isTrue(postedInvoice.isReadOnly("lineItems"));
              assert.isTrue(postedInvoice.isReadOnly("number"));
              assert.isTrue(postedInvoice.isReadOnly("invoiceDate"));
              assert.isTrue(postedInvoice.isReadOnly("terms"));
              assert.isTrue(postedInvoice.isReadOnly("salesRep"));
              assert.isTrue(postedInvoice.isReadOnly("commission"));
              assert.isTrue(postedInvoice.isReadOnly("taxZone"));
              assert.isTrue(postedInvoice.isReadOnly("saleType"));
              done();
            }
          };

        postedInvoice.on("statusChange", statusChanged);
        postedInvoice.fetch({number: "60004"});
      });
      /**
        @member Settings
        @memberof Invoice
        @description Balance should be recalculated when total, allocatedCredit, or
          outstandingCredit are changed.
      */
      it("Balance should be recalculated when total, allocatedCredit, or outstandingCredit " +
          "are changed", function () {
        assert.equal(invoiceModel.get("balance"), 0);
      });
      /**
        @member Settings
        @memberof Invoice
        @description When allocatedCredit or lineItems exist, currency should become read only.
      */
      it("When allocatedCredit or lineItems exist, currency should become read only.", function () {
        assert.isTrue(invoiceModel.isReadOnly("currency"));
      });
      /**
        @member Settings
        @memberof Invoice
        @description To save, the invoice total must not be less than zero and there must be
          at least one line item.
      */
      it("Save validation: The total must not be less than zero", function () {
        invoiceModel.set({customer: ttoys, number: "98765"});
        assert.isUndefined(JSON.stringify(invoiceModel.validate(invoiceModel.attributes)));
        invoiceModel.set({total: -1});
        assert.isObject(invoiceModel.validate(invoiceModel.attributes));
        invoiceModel.set({total: 1});
        assert.isUndefined(JSON.stringify(invoiceModel.validate(invoiceModel.attributes)));
      });
      it("Save validation: There must be at least one line item.", function () {
        var lineItems = invoiceModel.get("lineItems");
        assert.isUndefined(JSON.stringify(invoiceModel.validate(invoiceModel.attributes)));
        lineItems.remove(lineItems.at(0));
        assert.isObject(invoiceModel.validate(invoiceModel.attributes));
      });

      it("XM.Invoice includes a function calculateAuthorizedCredit", function (done) {
        // TODO test more thoroughly
        /*
        > Makes a call to the server requesting the total authorized credit for a given
          - sales order number
          - in the invoice currency
          - using the invoice date for exchange rate conversion.
        > Authorized credit should only include authoriztions inside the "CCValidDays" window,
          or 7 days if no CCValidDays is set, relative to the current date.
        > The result should be set on the authorizedCredit attribute
        > On response, recalculate the balance (HINT#: Do not attempt to use bindings for this!)
        */
        assert.isFunction(invoiceModel.calculateAuthorizedCredit);
        invoiceModel.calculateAuthorizedCredit();
        setTimeout(function () {
          assert.equal(invoiceModel.get("authorizedCredit"), 0);
          done();
        }, 1900);
      });

      /**
        @member Other
        @memberof Invoice
        @description Invoice includes a function "calculateTax" that
          Gathers line item, freight and adjustments
          Groups by and sums and rounds to XT.MONEY_SCALE for each tax code
          Sums the sum of each tax code and sets totalTax to the result
      */
      it.skip("has a calculateTax function that works correctly", function () {
        // TODO: put under test
      });


      it.skip("When a customer with non-base currency is selected the following values " +
          "should be displayed in the foreign currency along with the values in base currency " +
          " - Unit price, Extended price, Allocated Credit, Authorized Credit, Margin, " +
          "Subtotal, Misc. Charge, Freight, Total, Balance", function () {

        // TODO: put under test (requires postbooks demo to have currency conversion)
      });


    });
    describe("Invoice List View", function () {
      /**
        @member Navigation
        @memberof Invoice
        @description Users can perform the following actions from the list: Delete unposted
          invoices where the user has the MaintainMiscInvoices privilege, Post unposted
          invoices where the user has the "PostMiscInvoices" privilege, Void posted invoices
          where the user has the "VoidPostedInvoices" privilege, Print invoice forms where
          the user has the "PrintInvoices" privilege.
      */
      it("Delete unposted invoices where the user has the MaintainMiscInvoices privilege",
          function (done) {
        var model = new XM.InvoiceListItem();
        model.couldDestroy(function (response) {
          assert.isTrue(response);
          done();
        });
      });
      it("Cannot delete invoices that are already posted", function (done) {
        var model = new XM.InvoiceListItem();
        model.set({isPosted: true});
        XT.session.privileges.attributes.MaintainMiscInvoices = true;
        model.couldDestroy(function (response) {
          assert.isFalse(response);
          done();
        });
      });
      it("Post unposted invoices where the user has the PostMiscInvoices privilege",
          function (done) {
        var model = new XM.InvoiceListItem();
        model.canPost(function (response) {
          assert.isTrue(response);
          done();
        });
      });
      it("Cannot post invoices that are already posted", function (done) {
        var model = new XM.InvoiceListItem();
        model.set({isPosted: true});
        XT.session.privileges.attributes.PostMiscInvoices = true;
        model.canPost(function (response) {
          assert.isFalse(response);
          done();
        });
      });
      it("Void posted invoices where the user has the VoidPostedInvoices privilege",
          function (done) {
        var model = new XM.InvoiceListItem();
        model.set({isPosted: true});
        XT.session.privileges.attributes.VoidPostedInvoices = true;
        model.canVoid(function (response) {
          assert.isTrue(response);
          done();
        });
      });
      it("Cannot void invoices that are not already posted", function (done) {
        var model = new XM.InvoiceListItem();
        model.set({isPosted: false});
        XT.session.privileges.attributes.VoidPostedInvoices = true;
        model.canVoid(function (response) {
          assert.isFalse(response);
          done();
        });
      });
      /**
        @member Settings
        @memberof Invoice
        @description The invoice list should support multiple selections
      */
      it("The invoice list should support multiple selections", function () {
        var list = new XV.InvoiceList();
        assert.isTrue(list.getMultiSelect());
        // XXX it looks like trying to delete multiple items at once only deletes the first
      });
      it("The invoice list has a parameter widget", function () {
        /*
          * The invoice list should use a parameter widget that has the following options:
            > Invoices
              - Number
            > Show
              - Unposted - checked by default
              - Posted - unchecked by default
              - Voided - unchecked by default
            > Customer
              - Number
              - Type (picker)
              - Type Pattern (text)
              - Group
            > Invoice Date
              - From Date
              - To Date
        */
        var list = new XV.InvoiceList();
        assert.isString(list.getParameterWidget());
      });
      /**
        @member Buttons
        @memberof Invoice
        @description The InvoiceList should be printable
      */
      it("XV.InvoiceList should be printable", function () {
        var list = new XV.InvoiceList(),
          actions = list.actions;
        assert.include(_.pluck(actions, 'name'), 'print');
        assert.include(_.pluck(actions, 'name'), 'email');
      });

    });
    describe("Invoice workspace", function () {
      it("Has a customer relation model that's mapped correctly", function () {
        // TODO: generalize this into a relation widget test that's run against
        // every relation widget in the app.
        var workspace = new XV.InvoiceWorkspace();
        var widgetAttr = workspace.$.customerWidget.attr;
        var attrModel = _.find(XT.session.schemas.XM.attributes.Invoice.relations,
          function (relation) {
            return relation.key === widgetAttr;
          }).relatedModel;
        var widgetModel = XT.getObjectByName(workspace.$.customerWidget.getCollection())
          .prototype.model.prototype.recordType;
        assert.equal(attrModel, widgetModel);
      });
      /**
        @member Buttons
        @memberof Invoice
        @description The InvoiceWorkspace should be printable
      */
      it("XV.InvoiceWorkspace should be printable", function () {
        var workspace = new XV.InvoiceWorkspace(),
          actions = workspace.actions;
        assert.include(_.pluck(actions, 'name'), 'print');
        assert.include(_.pluck(actions, 'name'), 'email');
      });
      /**
        @member Navigation
        @memberof Invoice
        @description Supports grid-entry of line items on desktop browsers.
      */
      it("Should include line items views where a grid box is used for non-touch devices " +
          "and a list relation editor for touch devices.", function () {
        var workspace;

        enyo.platform.touch = true;
        workspace = new XV.InvoiceWorkspace();
        assert.equal(workspace.$.lineItemBox.kind, "XV.InvoiceLineItemBox");
        enyo.platform.touch = false;
        workspace = new XV.InvoiceWorkspace();
        assert.equal(workspace.$.lineItemBox.kind, "XV.InvoiceLineItemGridBox");
      });
      /**
        @member Navigation
        @memberof Invoice
        @description The bill to addresses available when searching addresses should filter
          on the addresses associated with the customer's account record by default.
      */
      it.skip("The bill to addresses available when searching addresses should filter " +
          "on the addresses associated with the customer's account record by default.",
            function () {
        // TODO: put under test
        assert.fail();
      });
      /**
        @member Navigation
        @memberof Invoice
        @description The customer search list should search only on active customers.
      */
      it.skip("The customer search list should search only on active customers", function () {
        // TODO: put under test
        assert.fail();
      });
      /**
        @member Other
        @memberof Invoice
        @description A child workspace view should exist called XV.InvoiceLineWorkspace
          should include: all the attributes on XM.InvoiceLine, item cost and item list
          price values, and a read only panel that displays a group box of lists of taxes.
      */
      it.skip("The invoiceLine child workspace", function () {
        // TODO: put under test
        assert.fail();
      });
    });
    describe("Sales Extension", function () {
      /**
        @member Setup
        @memberof Invoice
        @description If the sales extension is installed you can link invoices to sales orders
      */
      it("XM.InvoiceSalesOrder", function () {
        assert.isFunction(XM.InvoiceSalesOrder);
        assert.isTrue(XM.InvoiceSalesOrder.prototype.isDocumentAssignment);
      });
      /**
        @member Settings
        @memberof Invoice
        @description Invoice will include authorizedCredit, the sum of credit card authorizations
          in the order currency where:
            - The current_timestamp - authorization date is less than CCValidDays || 7
            - The payment status the cc payment (ccpay) record is authorized ("A")
            - The cc payment record is for an order number = the order number specified on
              the invoice
          When currency or invoice date is changed authorized credit should be recalculated.
      */
      it("authorizedCredit", function () {
        // TODO: better testing
        assert.equal(invoiceModel.get("authorizedCredit"), 0);
      });
      /**
        @member Settings
        @memberof Invoice
        @description sales extension order date defaults to today
      */
      it("Sales extension order date default today", function () {
        assert.equal(invoiceModel.get("orderDate").getDate(), new Date().getDate());
      });
    });
    describe("Project extension", function () {
      /**
        @member Setup
        @memberof Invoice
        @description If the project extension is installed you can link invoices to projects
      */
      it("XM.InvoiceProject", function () {
        assert.isFunction(XM.InvoiceProject);
        assert.isTrue(XM.InvoiceProject.prototype.isDocumentAssignment);
      });
      /**
        @member Settings
        @memberof Invoice
        @description The project attribute will be read-only for posted invoices
      */
      it.skip("project is read-only for posted invoices", function () {
        // TODO: put under test
        assert.fail();
      });
      /**
        @member Other
        @memberof Invoice
        @description The project widget will be added to the invoice workspace if the
          UseProjects setting is true.
      */
      it.skip("Add the project widget to the invoice workspace if the UseProjects setting is true.",
          function () {
        // TODO: put under test
        assert.fail();
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;

/*

***** CHANGES MADE BY MANUFACTURING EXTENSION ******

* A nested only model should be created according to convention for many-to-many document
associations:
  > XM.InvoiceWorkOrder

* Modify XM.Invoice to include:
  > InvoiceWorkOrder "workOrders"

**** OTHER NOTES ****

The following will not be implemented on this pass
  > Recurring invoices
  > Ledger functionality
  > Site level privelege checking
*/

}());

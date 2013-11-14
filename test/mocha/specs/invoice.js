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

1. order number and order date on top of overview (with sales extension)
2. tax type defaults to item tax type if user has no OverrideTax privilege
3. A panel that displays a group box of lists of taxes separated headers
  for taxes by line items, freight, and adjustments. Users should be able to add new tax
  adjustments, and remove tax adjustments for non-posted invoices.

4. Should include a panel that displays credit allocations.
    - When clicked a "new" button should allow the user to create a new minimalized version
    of cash receipt on-the-fly. The cash receipt need only record the amount, currency,
    document number, document date, distribution date and whether the balance should
    generate a credit memo or a customer deposit, depending on global customer deposit metrics.
    "EnableCustomerDeposit"
    - When clicked, an "allocate" button should present a list of open receivables that are
    credits that can be associated with the invoice.
    - The 2 buttons above should only be enabled if the user has the "ApplyARMemos" privilege.
*/


// TODO deferred to later sprint:
// filter invoice list by customer group
// print invoices (support printing more that 1 on the same screen)
// inventory extensions
// manufacturing extensions

  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
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

  // TODO: this kind of thing belongs in the framework
  var initializeModel = function (model, Klass, done) {
    var statusChanged = function () {
      if (model.isReady()) {
        model.off("statusChange", statusChanged);
        done(null, model);
      }
    };
    model = new Klass();
    model.on("statusChange", statusChanged);
    model.initialize(null, {isNew: true});
  };
  var fetchModel = function (model, Klass, hash, done) {
    var statusChanged = function () {
      if (model.isReady()) {
        model.off("statusChange", statusChanged);
        done(null, model);
      }
    };
    model = new Klass();
    model.on("statusChange", statusChanged);
    model.fetch(hash);
  };

  /**
    Here is some high-level description of what an invoice is supposed to do.
    @class
    @alias Invoice
    @parameter {String} number that is the documentKey and idAttribute
    @parameter {Date} invoiceDate required default today
    @parameter {Boolean} isPosted required, defaulting to false, read only
    @parameter {Boolean} isVoid required, defaulting to false, read only
    @parameter {BillingCustomer} customer required
    @parameter {String} billtoName
    @parameter {String} billtoAddress1
    @parameter {String} billtoAddress2
    @parameter {String} billtoAddress3
    @parameter {String} billtoCity
    @parameter {String} billtoState
    @parameter {String} billtoPostalCode
    @parameter {String} billtoCountry
    @parameter {String} billtoPhone
    @parameter {Currency} currency
    @parameter {Terms} terms
    @parameter {SalesRep} salesRep
    @parameter {Percent} commission required, default 0
    @parameter {SaleType} saleType
    @parameter {String} customerPurchaseOrderNumber
    @parameter {TaxZone} taxZone
    @parameter {String} notes
    @parameter {InvoiceRelation} recurringInvoice
    @parameter {Money} allocatedCredit the sum of all allocated credits
    @parameter {Money} outandingCredit the sum of all unallocated credits, not including
      cash receipts pending
    @parameter {Money} subtotal the sum of the extended price of all line items
    @parameter {Money} taxTotal the sum of all taxes inluding line items, freight and
      tax adjustments
    @parameter {Money} miscCharge read only (will be re-implemented as editable by Ledger)
    @parameter {Money} total the calculated total of subtotal + freight + tax + miscCharge
    @parameter {Money} balance the sum of total - allocatedCredit - authorizedCredit -
      outstandingCredit.
      - If sum calculates to less than zero, then the balance is zero.
    @parameter {InvoiceAllocation} allocations
    @parameter {InvoiceTax} taxAdjustments
    @parameter {InvoiceLine} lineItems
    @parameter {InvoiceCharacteristic} characteristics
    @parameter {InvoiceContact} contacts
    @parameter {InvoiceAccount} accounts
    @parameter {InvoiceCustomer} customers
    @parameter {InvoiceFile} files
    @parameter {InvoiceUrl} urls
    @parameter {InvoiceItem} items
    @parameter {String} orderNumber Added by sales extension
    @parameter {Date} orderDate Added by sales extension
    @parameter {InvoiceSalesOrder} salesOrders Added by sales extension
    @parameter {InvoiceIncident} incidents Added by crm extension
    @parameter {InvoiceOpportunity} opportunities Added by crm extension
  */
  var spec = {
    recordType: "XM.Invoice",
    collectionType: "XM.InvoiceListItemCollection",
    /**
      @member -
      @memberof Invoice.prototype
      @description The invoice collection is not cached.
    */
    cacheName: null,
    listKind: "XV.InvoiceList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Invoice.prototype
      @description Invoice is lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Invoice.prototype
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
      @member -
      @memberof Invoice.prototype
      @description Used in the billing module
    */
    extensions: ["billing"],
    /**
      @member -
      @memberof Invoice.prototype
      @description Users can create, update, and delete invoices if they have the
        MaintainMiscInvoices privilege, and they can read invoices if they have
        the ViewMiscInvoices privilege.
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
      action: require("../lib/model_data").getBeforeSaveAction("XM.InvoiceLine")}],
    skipSmoke: true,
    beforeSaveUIActions: [{it: 'sets up a valid line item',
      action: function (workspace, done) {
        var gridRow;

        workspace.value.on("change:total", done);
        workspace.$.invoiceLineItemBox.newItem();
        gridRow = workspace.$.invoiceLineItemBox.$.editableGridRow;
        // TODO
        //gridRow.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel,
          //site: submodels.siteModel}});
        gridRow.$.quantityWidget.doValueChange({value: 5});

      }
    }]
  };

  var additionalTests = function () {
    /**
      @member -
      @memberof Invoice.prototype
      @description There is a setting "Valid Credit Card Days"
      @default 7
    */
    describe("Setup for Invoice", function () {
      it("The system settings option CCValidDays will default to 7 if " +
          "not already in the db", function () {
        assert.equal(XT.session.settings.get("CCValidDays"), 7);
      });
      /**
        @member -
        @memberof Invoice.prototype
        @description Characteristics can be assigned as being for invoices
      */
      it("XM.Characteristic includes isInvoices as a context attribute", function () {
        var characteristic = new XM.Characteristic();
        assert.isBoolean(characteristic.get("isInvoices"));
      });
      /**
        @member InvoiceCharacteristic
        @memberof Invoice.prototype
        @description Follows the convention for characteristics
        @see Characteristic
      */
      it("convention for characteristic assignments", function () {
        var model;

        assert.isFunction(XM.InvoiceCharacteristic);
        model = new XM.InvoiceCharacteristic();
        assert.isTrue(model instanceof XM.CharacteristicAssignment);
      });
    });
    /**
      @member -
      @memberof Invoice.prototype
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
            fetchModel(bpaint, XM.ItemRelation, {number: "BPAINT1"}, function (err, model) {
              bpaint = model;
              done();
            });
          },
          function (done) {
            fetchModel(btruck, XM.ItemRelation, {number: "BTRUCK1"}, function (err, model) {
              btruck = model;
              done();
            });
          },
          function (done) {
            initializeModel(invoiceModel, XM.Invoice, function (err, model) {
              invoiceModel = model;
              done();
            });
          },
          function (done) {
            initializeModel(lineModel, XM.InvoiceLine, function (err, model) {
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
        @memberof InvoiceLine.prototype
        @description Contains the tax of an invoice line.
        @property {String} uuid The ID attribute
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
        @property {String} uuid The ID attribute
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
        @property {SalesOrderLine} salesOrderLine Added by sales extension
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
        @member -
        @memberof InvoiceLine.prototype
        @description InvoiceLine keeps track of the available selling units of measure
        based on the selected item, in the "sellingUnits" property
      */
      it("should include a property \"sellingUnits\" that is an array of available selling " +
          "units of measure based on the selected item", function () {
        var lineModel = new XM.InvoiceLine();
        assert.isObject(lineModel.sellingUnits);
      });
      /**
        @member -
        @memberof InvoiceLine.prototype
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
        @member -
        @memberof InvoiceLine.prototype
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
        @member -
        @memberof InvoiceLine.prototype
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
        @member -
        @memberof InvoiceLine.prototype
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
        @member -
        @memberof InvoiceLine.prototype
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
        @member -
        @memberof Invoice.prototype
        @description Currency field should be read only after a line item is added to the invoice
      */
      it("Currency field should be read-only after a line item is added to the invoice",
          function () {
        assert.isTrue(invoiceModel.isReadOnly("currency"));
      });
      /**
        @member -
        @memberof InvoiceLine.prototype
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
            fetchModel(ttoys, XM.BillingCustomer, {number: "TTOYS"}, function (err, model) {
              ttoys = model;
              done();
            });
          },
          function (done) {
            fetchModel(vcol, XM.BillingCustomer, {number: "VCOL"}, function (err, model) {
              vcol = model;
              done();
            });
          },
          function (done) {
            fetchModel(nctax, XM.TaxZone, {code: "NC TAX"}, function (err, model) {
              nctax = model;
              done();
            });
          },
          function (done) {
            fetchModel(nctaxCode, XM.TaxCode, {code: "NC TAX-A"}, function (err, model) {
              nctaxCode = model;
              done();
            });
          },
          function (done) {
            initializeModel(invoiceTaxModel, XM.InvoiceTax, function (err, model) {
              invoiceTaxModel = model;
              done();
            });
          },
          function (done) {
            initializeModel(allocationModel, XM.InvoiceAllocation, function (err, model) {
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
        @memberof Invoice.prototype
        @description Invoice tax adjustments
        @property {String} uuid
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
        @member -
        @memberof Invoice.prototype
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
        @memberof Invoice.prototype
        @description Invoice-level allocation information
        @property {String} uuid
        @property {String} invoice // XXX String or Number?
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
        @memberof Invoice.prototype
        @description List-view summary information for an invoice
        @property {String} number
        @property {Boolean} isPrinted XXX changed from printed
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
        assert.isFalse(XM.InvoiceListItem.canRead());

        XT.session.privileges.attributes.ViewMiscInvoices = true;
        XT.session.privileges.attributes.MaintainMiscInvoices = false;
        assert.isTrue(XM.InvoiceListItem.canRead());

        XT.session.privileges.attributes.ViewMiscInvoices = false;
        XT.session.privileges.attributes.MaintainMiscInvoices = true;
        assert.isTrue(XM.InvoiceListItem.canRead());
      });
      it("XM.InvoiceListItem is not editable", function () {
        assert.isFalse(XM.InvoiceListItem.canCreate());
        assert.isFalse(XM.InvoiceListItem.canUpdate());
        assert.isFalse(XM.InvoiceListItem.canDelete());
      });
      /**
        @member InvoiceRelation
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
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
        assert.equal(invoiceModel.getValue("salesRep.number"), "1000");
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
        @member -
        @memberof InvoiceLine.prototype
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
        @member -
        @memberof InvoiceLine.prototype
        @description If price or billing change, extendedPrice should be recalculated.
      */
      it("If price or billing change, extendedPrice should be recalculated.", function () {
        assert.equal(lineModel.get("extendedPrice"), 98.91);
      });
      /**
        @member -
        @memberof InvoiceLine.prototype
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
        @member -
        @memberof Invoice.prototype
        @description When currency or invoice date is changed outstanding credit should be
          recalculated.
      */
      it.skip("When currency or invoice date is changed outstanding credit should be recalculated",
          function (done) {
        // frustratingly nondeterministic
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
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
        @description Balance should be recalculated when total, allocatedCredit, or
          outstandingCredit are changed.
      */
      it("Balance should be recalculated when total, allocatedCredit, or outstandingCredit " +
          "are changed", function () {
        assert.equal(invoiceModel.get("balance"), 0);
      });
      /**
        @member -
        @memberof Invoice.prototype
        @description When allocatedCredit or lineItems exist, currency should become read only.
      */
      it("When allocatedCredit or lineItems exist, currency should become read only.", function () {
        assert.isTrue(invoiceModel.isReadOnly("currency"));
      });
      /**
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
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
      it("Cannot delete unposted invoices where the user has no MaintainMiscInvoices privilege",
          function (done) {
        var model = new XM.InvoiceListItem();
        XT.session.privileges.attributes.MaintainMiscInvoices = false;
        model.couldDestroy(function (response) {
          assert.isFalse(response);
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
      it("Cannot post invoices where the user has no PostMiscInvoices privilege", function (done) {
        var model = new XM.InvoiceListItem();
        XT.session.privileges.attributes.PostMiscInvoices = false;
        model.canPost(function (response) {
          assert.isFalse(response);
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
      it("Cannot void invoices where the user has no VoidPostedInvoices privilege",
          function (done) {
        var model = new XM.InvoiceListItem();
        model.set({isPosted: true});
        XT.session.privileges.attributes.VoidPostedInvoices = false;
        model.canVoid(function (response) {
          assert.isFalse(response);
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
      it("Print invoices where the user has the PrintInvoices privilege", function (done) {
        var model = new XM.InvoiceListItem();
        model.canPrint(function (response) {
          assert.isTrue(response);
          done();
        });
      });
      it("Cannot print invoices where the user has no PrintInvoices privilege", function (done) {
        var model = new XM.InvoiceListItem();
        XT.session.privileges.attributes.PrintInvoices = false;
        model.canPrint(function (response) {
          assert.isFalse(response);
          done();
        });
      });
      /**
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
        @description The InvoiceList should be printable
      */
      it("XV.InvoiceList should be printable", function () {
        var list = new XV.InvoiceList();
        assert.isTrue(list.getAllowPrint());
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
        @member -
        @memberof Invoice.prototype
        @description Supports grid-entry of line items on desktop browsers.
      */
      it("Should include line items views where a grid box is used for non-touch devices " +
          "and a list relation editor for touch devices.", function () {
        var workspace;

        enyo.platform.touch = true;
        workspace = new XV.InvoiceWorkspace();
        assert.equal(workspace.$.lineItemsPanel.children[0].kind, "XV.InvoiceLineItemBox");
        enyo.platform.touch = false;
        workspace = new XV.InvoiceWorkspace();
        assert.equal(workspace.$.lineItemsPanel.children[0].kind, "XV.InvoiceLineItemGridBox");
      });
      /**
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
        @description The customer search list should search only on active customers.
      */
      it.skip("The customer search list should search only on active customers", function () {
        // TODO: put under test
        assert.fail();
      });
      /**
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
        @description If the sales extension is installed you can link invoices to sales orders
      */
      it("XM.InvoiceSalesOrder", function () {
        assert.isFunction(XM.InvoiceSalesOrder);
        assert.isTrue(XM.InvoiceSalesOrder.prototype.isDocumentAssignment);
      });
      /**
        @member -
        @memberof Invoice.prototype
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
        @member -
        @memberof Invoice.prototype
        @description sales extension order date defaults to today
      */
      it("Sales extension order date default today", function () {
        assert.equal(invoiceModel.get("orderDate").getDate(), new Date().getDate());
      });
    });
    describe("Project extension", function () {
      /**
        @member -
        @memberof Invoice.prototype
        @description If the project extension is installed you can link invoices to projects
      */
      it("XM.InvoiceProject", function () {
        assert.isFunction(XM.InvoiceProject);
        assert.isTrue(XM.InvoiceProject.prototype.isDocumentAssignment);
      });
      /**
        @member -
        @memberof Invoice.prototype
        @description The project attribute will be read-only for posted invoices
      */
      it.skip("project is read-only for posted invoices", function () {
        // TODO: put under test
        assert.fail();
      });
      /**
        @member -
        @memberof Invoice.prototype
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

***** CHANGES MADE BY INVENTORY EXTENSION ******

* XM.InvoiceLine will include:
  > Boolean "updateInventory"
* The updateInventory attribute is readOnly unless all the following are true
  > The invoice is unposted.
  > A valid item is selected.
  > The item and site do not resolve to an item site that is job cost
  > There is no associated salesOrderLine (attr added by sales extension)

* XM.InvoiceListItem will include:
  > String "shipDate"
  > String "shipToName"
* XM.InvoiceListItem will extend the post function to include inventory information
  * For each line item where "updateInventory" is true, issue materials to the invoice
  * Capture distribution detail (trace and location) where applicable
#HINT: This will likely require creating an alternate dispatchable "post" function that
  accepts an invoice id _and_ inventory data.

* XM.Invoice will include:
  > Date "shipDate" default today
  > CustomerShiptoRelation "shipto"
  > String "shiptoName"
  > String "shiptoAddress1"
  > String "shiptoAddress2"
  > String "shiptoAddress3"
  > String "shiptoCity"
  > String "shiptoState"
  > String "shiptoPostalCode"
  > String "shiptoCountry"
  > String "shiptoPhone"
  > ShipCharge "shipCharge"
  > ShipZone "shipZone"
  > String "incoterms" // HINT: This is the "invchead_fob" field
  > String "shipVia"
  > Money "freight" required, default 0
* When the customer changes will copy the following attributes from the customer model:
  > shipCharge
  > shipto (If a default customer shipto exists)
  > The following fields will be set to read only if the customer does not allow free
  form shipnto:
    - shiptoName
    - shiptoAddress1
    - shiptoAddress2
    - shiptoAddress3
    - shiptoCity
    - shiptoState
    - shiptoPostalCode
    - shiptoCountry
    - shiptoPhone
* The inventory extension adds a function to XM.Invoice "copyBilltoToShipto" that
does the following
  > Clears the shipto
  > Copies billto name, address fields and phone number to shipto equivilants.
  > Sets the invoice tax zone to the customer tax zone.
* When an invoice is loaded where "isPosted" is true, then the following attributes
will be made read only:
  > lineItems
  > number
  > invoiceDate
  > terms
  > salesrep
  > commission
  > taxZone
  > shipCharges
  > project
  > freight
  > shipZone
  > saleType

* If the shipto changes to a value, the following fields should be set based on information
from the shipto:
  - shiptoName (= customer.shipto.name)
  - shiptoAddress1
  - shiptoAddress2
  - shiptoAddress3
  - shiptoCity
  - shiptoState
  - shiptoPostalCode
  - shiptoCountry (< ^ should be populated by the default customer.shipto.address).
  - shiptoPhone
  - salesRep
  - commission
  - taxZone
  - shipCharge
  - shipZone
* if the shipto is cleared these fields should be unset
  - shiptoName
  - shiptoAddress1
  - shiptoAddress2
  - shiptoAddress3
  - shiptoCity
  - shiptoState
  - shiptoPostalCode
  - shiptoCountry
  - shiptoPhone
* If any of the above listed shipto attributes are manually altered, the shipto is unset.

* Freight should be read only and zero when the "isCustomerPay" property is false on the ship
charge associated with the invoice.

* totalTax should be recalculated when freight changes.

* Add the following to the invoice workspace:
  > When the customer is changed on the XV.InvoiceWorkspace model:
    - customer should be set on shipto relation so that it will search on and select from that
    customer's shipto addresses.
    - The bill to address should be supplimented with a "Shipto" button that when clicked runs
    the copyToShipto function ()
    - The copy ship to button should be disabled if the customer does not allow free-form shiptos.
  > The shipto addresses available when searching addresses sholud filter on the addresses
  associated with the customer's account record by default.

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

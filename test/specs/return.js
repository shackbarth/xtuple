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
    assert = require("chai").assert,
    returnModel,
    lineModel,
    allocationModel,
    ReturnTaxModel,
    usd,
    gbp,
    nctax,
    nctaxCode,
    ttoys,
    vcol,
    bpaint,
    btruck;
  /**
    Returns (Credit memo) are used to issue credit for sold Inventory
    @class
    @alias Return
    @property {String} number that is the documentKey and idAttribute
    @property {Date} returnDate required default today
    @property {Boolean} isPosted required, defaulting to false, read only
    @property {Boolean} isVoid required, defaulting to false, read only
    @property {BillingCustomer} customer required
    @property {String} billtoName
    @property {String} billtoAddress1
    @property {String} billtoAddress2
    @property {String} billtoAddress3
    @property {String} billtoCity
    @property {String} billtoState
    @property {String} billtoPostalCode
    @property {String} billtoCountry
    @property {Currency} currency
    @property {SalesRep} salesRep
    @property {Percent} commission required, default 0
    @property {SaleType} saleType
    @property {String} customerPurchaseOrderNumber
    @property {TaxZone} taxZone
    @property {String} notes
    @property {Money} subtotal the sum of the extended price of all line items
    @property {Money} taxTotal the sum of all taxes inluding line items, freight and
      tax adjustments
    @property {Money} miscCharge read only (will be re-implemented as editable by Ledger)
    @property {Money} total the calculated total of subtotal + freight + tax + miscCharge
    @property {Money} balance the sum of total - allocatedCredit - authorizedCredit -
      outstandingCredit.
      - If sum calculates to less than zero, then the balance is zero.
    @property {ReturnAllocation} allocations
    @property {ReturnTax} taxAdjustments
    @property {ReturnLine} lineItems
  */
  var spec = {
    recordType: "XM.Return",
    collectionType: "XM.ReturnListItemCollection",
    /**
      @member -
      @memberof Return
      @description The Return collection is not cached.
    */
    cacheName: null,
    listKind: "XV.ReturnList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Return
      @description Return is lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Return
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["number", "returnDate", "isPosted", "isVoid", "customer",
      "billtoName", "billtoAddress1", "billtoAddress2", "billtoAddress3",
      "billtoCity", "billtoState", "billtoPostalCode", "billtoCountry",
      "currency", "salesRep", "commission",
      "saleType", "customerPurchaseOrderNumber", "taxZone", "notes",
      "subtotal", "taxTotal", "miscCharge", "total", "balance", "allocations",
      "taxAdjustments", "lineItems"],
    requiredAttributes: ["number", "returnDate", "isPosted", "isVoid",
      "customer", "commission"],
    defaults: {
      returnDate: new Date(),
      isPosted: false,
      isVoid: false,
      commission: 0
    },
    /**
      @member -
      @memberof Return
      @description Used in the billing module
    */
    extensions: ["billing"],
    /**
      @member Privileges
      @memberof Return
      @description Users can create, update, and delete Returns if they have the
        MaintainCreditMemos privilege.
    */
    /**
      @member Privileges
      @memberof Return
      @description Users can read Returns if they have
        the ViewCreditMemos privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainCreditMemos", //Privileges from the desktop client
      read: "ViewCreditMemos"
    },
    createHash: {
      //customer: {number: "XRETAIL"}
      customer: {number: "TTOYS"}
    },
    updatableField: "notes",
    beforeSaveActions: [{it: 'sets up a valid line item',
      action: require("./sales_order").getBeforeSaveAction("XM.ReturnLine")}],
    beforeSaveUIActions: [{it: 'sets up a valid line item',
      action: function (workspace, done) {
        var gridRow,
          // XXX we really need a standard way of doing this
          primeSubmodels = require("./sales_order").primeSubmodels;

        primeSubmodels(function (submodels) {
          workspace.$.lineItemBox.newItem();
          gridRow = workspace.$.lineItemBox.$.editableGridRow;
          gridRow.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel,
            site: submodels.siteModel}});
          gridRow.$.quantityWidget.doValueChange({value: 5});
          gridRow.$.creditedWidget.doValueChange({value: 5});
          setTimeout(function () {
            done();
          }, 3000);
        });

      }
    }]
  };

  var additionalTests = function () {
    describe("ReturnLine", function () {
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
            common.initializeModel(returnModel, XM.Return, function (err, model) {
              returnModel = model;
              done();
            });
          },
          function (done) {
            common.initializeModel(lineModel, XM.ReturnLine, function (err, model) {
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
        @member ReturnLineTax
        @memberof ReturnLine
        @description Contains the tax of an Return line.
        @property {String} uuid The ID attribute
        @property {TaxType} taxType
        @property {TaxCode} taxCode
        @property {Money} amount
      */
      it("has ReturnLineTax as a nested-only model extending XM.Model", function () {
        var attrs = ["uuid", "taxType", "taxCode", "amount"],
          model;

        assert.isFunction(XM.ReturnLineTax);
        model = new XM.ReturnLineTax();
        assert.isTrue(model instanceof XM.Model);
        assert.equal(model.idAttribute, "uuid");
        assert.equal(_.difference(attrs, model.getAttributeNames()).length, 0);
      });
      it.skip("XM.ReturnLineTax can be created, updated and deleted", function () {
        // TODO: put under test (code is written)
      });
      it.skip("A view should be used underlying XM.ReturnLineTax that does nothing " +
          "after insert, update or delete (existing table triggers for line items will " +
          "take care of populating this data correctly)", function () {
        // TODO: put under test (code is written)
      });
      /**
        @class
        @alias ReturnLine
        @description Represents a line of an Return. Only ever used within the context of an
          Return.
        @property {String} uuid The ID attribute
        @property {Number} lineNumber required
        @property {ItemRelation} item
        @property {SiteRelation} site defaults to the system default site
        @property {ReasonCode} ReasonCode
        @property {Quantity} quantity
        @property {Unit} quantityUnit
        @property {Number} quantityUnitRatio
        @property {Quantity} credited
        @property {Number} discountPercentFromSale
        @property {Number} customerPrice
        @property {SalesPrice} price
        @property {Unit} priceUnit
        @property {Number} priceUnitRatio
        @property {ExtendedPrice} "extendedPrice" = credited * quantityUnitRatio *
        (price / priceUnitRatio)
        @property {Number} notes
        @property {TaxType} taxType
        @property {Money} taxTotal sum of all taxes
        @property {ReturnLineTax} taxes
        @property {SalesOrderLine} salesOrderLine Added by sales extension
      */
      it("A nested only model called XM.ReturnLine extending " +
          "XM.Model should exist", function () {
        var lineModel;
        assert.isFunction(XM.ReturnLine);
        lineModel = new XM.ReturnLine();
        assert.isTrue(lineModel instanceof XM.Model);
        assert.equal(lineModel.idAttribute, "uuid");
      });
      it.skip("ReturnLine should include attributes x, y, and z", function () {
        // TODO: put under test (code is written)
      });
      /**
        @member -
        @memberof ReturnLine
        @description ReturnLine keeps track of the available selling units of measure
        based on the selected item, in the "sellingUnits" property
      */
      it("XM.ReturnLine should include a property \"sellingUnits\" that is an array " +
          "of available selling units of measure based on the selected item", function () {
        var lineModel = new XM.ReturnLine();
        assert.isObject(lineModel.sellingUnits);
      });
      /**
        @member -
        @memberof ReturnLine
        @description When the item is changed the following should be updated from item information:
          sellingUnits, quantityUnit, quantityUnitRatio, priceUnit, priceUnitRatio, unitCost
          and taxType. Then, the price should be recalculated.
      */
      it("XM.ReturnLine should have a fetchSellingUnits function that updates " +
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
        @memberof ReturnLine
        @description quantity and credited values can be fractional only if the item allows it
      */
      it("When the item isFractional attribute === false, decimal numbers should not be allowed " +
          "for quantity and credited values.", function () {
        lineModel.set({quantity: 1, credited: 1.5});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({credited: 2});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
        lineModel.set({quantity: 1.5});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({quantity: 2});
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
          "for credited values.", function () {
        lineModel.set({quantity: 1.5, credited: 2});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
      });
      /**
        @member -
        @memberof ReturnLine
        @description Returned and credited should only allow positive values.
      */
      it("Returned should only allow positive values", function () {
        lineModel.set({quantity: -1});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({quantity: 0});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({quantity: 2});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
      });
      it("credited should only allow positive values", function () {
        lineModel.set({credited: -1});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({credited: 0});
        assert.isObject(lineModel.validate(lineModel.attributes));
        lineModel.set({credited: 2});
        assert.isUndefined(JSON.stringify(lineModel.validate(lineModel.attributes)));
      });
      /**
        @member -
        @memberof ReturnLine
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
        @memberof ReturnLine
        @description User requires the "OverrideTax" privilege to edit the tax type.
      */
      it.skip("User requires the OverrideTax privilege to edit the tax type", function () {
        // TODO: write code and put under test
        //HINT: Default tax type must be enforced by a trigger on the database if no privilege.
        assert.fail();
      });
      it("lineNumber must auto-number itself sequentially", function () {
        var dummyModel = new XM.ReturnLine();
        assert.isUndefined(lineModel.get("lineNumber"));
        returnModel.get("lineItems").add(dummyModel);
        returnModel.get("lineItems").add(lineModel);
        assert.equal(lineModel.get("lineNumber"), 2);
        returnModel.get("lineItems").remove(dummyModel);
        // TODO: be more thorough
      });
      /**
        @member -
        @memberof Return
        @description Currency field should be read only after a line item is added to the Return
      */
      it("Currency field should be read-only after a line item is added to the Return",
          function () {
        assert.isTrue(returnModel.isReadOnly("currency"));
      });
      it.skip("XM.ReturnLine should have a calculatePrice function that retrieves a price from " +
          "the customer.itemPrice dispatch function based on the 'credited' value.", function () {
        // TODO: put under test (code is written)
        assert.fail();
      });
    });
    describe("XM.ReturnListItem", function () {
      // TODO:posting and voiding work, anecdotally. Put it under test.
      it.skip("XM.ReturnListItem includes a post function that dispatches a " +
          "XM.Return.post function to the server", function () {
        var model = new XM.ReturnListItem();
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
      it.skip("XM.ReturnListItem includes a void function that dispatches a " +
          "XM.Return.void function to the server", function () {
        var model = new XM.ReturnListItem();
        assert.isFunction(model.doVoid);
      });
    });
    describe("XM.Return", function () {
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
            common.initializeModel(ReturnTaxModel, XM.ReturnTax, function (err, model) {
              ReturnTaxModel = model;
              done();
            });
          },
          function (done) {
            common.initializeModel(allocationModel, XM.ReturnAllocation, function (err, model) {
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
      // docdate: Return date
      // taxtype: 3. Yes, 3.
      //
      /**
        @member ReturnTax
        @memberof Return
        @description Return tax adjustments
        @property {String} uuid
        @property {TaxCode} taxCode
        @property {Money} amount
      */
      it("A nested only model called XM.ReturnTax extending XM.Model should exist", function () {
        assert.isFunction(XM.ReturnTax);
        var ReturnTaxModel = new XM.ReturnTax(),
          attrs = ["uuid", "taxCode", "amount"];

        assert.isTrue(ReturnTaxModel instanceof XM.Model);
        assert.equal(ReturnTaxModel.idAttribute, "uuid");
        assert.equal(_.difference(attrs, ReturnTaxModel.getAttributeNames()).length, 0);
      });
      /**
        @member -
        @memberof Return
        @description The Return numbering policy can be determined by the user.
      */
      it("XM.Return should check the setting for CMNumberGeneration to determine " + //Please change the variable InvcNumberGeneration accordingly
          "numbering policy", function () {
        var model;
        XT.session.settings.set({CMNumberGeneration: "M"});
        model = new XM.Return();
        assert.equal(model.numberPolicy, "M");
        XT.session.settings.set({CMNumberGeneration: "A"});
        model = new XM.Return();
        assert.equal(model.numberPolicy, "A");
      });
      /**
        @member ReturnAllocation
        @memberof Return
        @description Return-level allocation information
        @property {String} uuid
        @property {String} return // XXX String or Number?
        @property {Money} amount
        @property {Currency} currency
      */
      it("A nested only model called XM.ReturnAllocation extending XM.Model " +
          "should exist", function () {
        assert.isFunction(XM.ReturnAllocation);
        var ReturnAllocationModel = new XM.ReturnAllocation(),
          attrs = ["uuid", "return", "amount", "currency"];

        assert.isTrue(ReturnAllocationModel instanceof XM.Model);
        assert.equal(ReturnAllocationModel.idAttribute, "uuid");
        assert.equal(_.difference(attrs, ReturnAllocationModel.getAttributeNames()).length, 0);
      });
      it("XM.ReturnAllocation should only be updateable by users with the ApplyARMemos " +
          "privilege.", function () {
        XT.session.privileges.attributes.ApplyARMemos = false;
        assert.isFalse(XM.ReturnAllocation.canCreate());
        assert.isTrue(XM.ReturnAllocation.canRead());
        assert.isFalse(XM.ReturnAllocation.canUpdate());
        assert.isFalse(XM.ReturnAllocation.canDelete());
        XT.session.privileges.attributes.ApplyARMemos = true;
        assert.isTrue(XM.ReturnAllocation.canCreate());
        assert.isTrue(XM.ReturnAllocation.canRead());
        assert.isTrue(XM.ReturnAllocation.canUpdate());
        assert.isTrue(XM.ReturnAllocation.canDelete());
      });
      /**
        @member ReturnListItem
        @memberof Return
        @description List-view summary information for an Return
        @property {String} number
        @property {Boolean} isPrinted
        @property {BillingCustomer} customer
        @property {Date} returnDate
        @property {Money} total
        @property {Boolean} isPosted
        @property {Boolean} isOpen
        @property {Boolean} isVoid
        @property {String} orderNumber Added by sales extension
      */
      it("A model called XM.ReturnListItem extending XM.Info should exist", function () {
        assert.isFunction(XM.ReturnListItem);
        var ReturnListItemModel = new XM.ReturnListItem(),
          attrs = ["number", "customer", "returnDate", "total", "isPosted", "isVoid"];

        assert.isTrue(ReturnListItemModel instanceof XM.Info);
        assert.equal(ReturnListItemModel.idAttribute, "number");
        assert.equal(_.difference(attrs, ReturnListItemModel.getAttributeNames()).length, 0);
      });
      it("Only users that have ViewCreditMemos or MaintainCreditMemos may read " +
          "XV.ReturnListItem", function () {
        XT.session.privileges.attributes.ViewCreditMemos = false;
        XT.session.privileges.attributes.MaintainCreditMemos = false;
        assert.isFalse(XM.ReturnListItem.canRead());

        XT.session.privileges.attributes.ViewCreditMemos = true;
        XT.session.privileges.attributes.MaintainCreditMemos = false;
        assert.isTrue(XM.ReturnListItem.canRead());

        XT.session.privileges.attributes.ViewCreditMemos = false;
        XT.session.privileges.attributes.MaintainCreditMemos = true;
        assert.isTrue(XM.ReturnListItem.canRead());
      });
      it("XM.ReturnListItem is not editable", function () {
        assert.isFalse(XM.ReturnListItem.canCreate());
        assert.isFalse(XM.ReturnListItem.canUpdate());
        assert.isFalse(XM.ReturnListItem.canDelete());
      });
      it.skip("XM.ReturnListItem includes a \"post\" function that dispatches a" +
        "XM.Return.post function to the server", function () {
      });
      it.skip("XM.ReturnListItem includes a \"void\" function that dispatches a" +
        "XM.Return.void function to the server", function () {
      });

      /**
        @member ReturnRelation
        @memberof Return
        @description Summary information for an Return
        @property {String} number
        @property {CustomerRelation} customer
        @property {Date} returnDate
        @property {Boolean} isPosted
        @property {Boolean} isOpen
        @property {Boolean} isVoid
      */
      it("A model called XM.ReturnRelation extending XM.Info should exist with " +
          "attributes number (the idAttribute) " +
          "customer, returnDate, isPosted and isVoid", function () {
        assert.isFunction(XM.ReturnRelation);
        var ReturnRelationModel = new XM.ReturnRelation(),
          attrs = ["number", "customer", "returnDate", "isPosted", "isVoid"];

        assert.isTrue(ReturnRelationModel instanceof XM.Info);
        assert.equal(ReturnRelationModel.idAttribute, "number");
        assert.equal(_.difference(attrs, ReturnRelationModel.getAttributeNames()).length, 0);

      });
      it("All users with the billing extension may read XV.ReturnRelation.", function () {
        assert.isTrue(XM.ReturnRelation.canRead());
      });
      it("XM.ReturnRelation is not editable.", function () {
        assert.isFalse(XM.ReturnRelation.canCreate());
        assert.isFalse(XM.ReturnRelation.canUpdate());
        assert.isFalse(XM.ReturnRelation.canDelete());
      });
      /**
        @member -
        @memberof Return
        @description When the customer changes, the billto information should be populated from
          the customer, along with the salesRep, commission, terms, taxZone, and currency.
          The billto fields will be read-only if the customer does not allow free-form billto.
      */
      it("When the customer changes on XM.Return, the following customer data should be " +
          "populated from the customer: billtoName (= customer.name), billtoAddress1, " +
          "billtoAddress2, billtoAddress3, billtoCity, billtoState, billtoPostalCode, " +
          "billtoCountry should be populated by customer.billingContact.address." +
          "salesRep, commission, taxZone, currency ", function () {
        assert.isUndefined(returnModel.get("billtoName"));
        returnModel.set({customer: ttoys});
        assert.equal(returnModel.get("billtoName"), "Tremendous Toys Incorporated");
        assert.equal(returnModel.get("billtoAddress2"), "101 Toys Place");
        assert.isString(returnModel.getValue("salesRep.number"),
          ttoys.getValue("salesRep.number"));
        assert.equal(returnModel.getValue("taxZone.code"), "VA TAX");
        assert.equal(returnModel.getValue("currency.abbreviation"), "USD");
      });
      it("The following fields will be set to read only if the customer does not allow " +
          "free form billto: billtoName, billtoAddress1, billtoAddress2, billtoAddress3, " +
          "billtoCity, billtoState, billtoPostalCode, billtoCountry", function () {
        assert.isFalse(returnModel.isReadOnly("billtoName"), "TTOYS Name");
        assert.isFalse(returnModel.isReadOnly("billtoAddress3"), "TTOYS Address3");
        returnModel.set({customer: vcol});
        assert.isTrue(returnModel.isReadOnly("billtoName"), "VCOL Name");
        assert.isTrue(returnModel.isReadOnly("billtoAddress3"), "VCOL Address3");
      });
      it("If the customer attribute is empty, the above fields should be unset.", function () {
        assert.isString(returnModel.get("billtoName"));
        returnModel.set({customer: null});
        assert.isUndefined(returnModel.get("billtoName"));
        assert.isUndefined(returnModel.get("billtoAddress2"));
        assert.isNull(returnModel.get("salesRep"));
        assert.isNull(returnModel.get("taxZone"));
        assert.isNull(returnModel.get("currency"));
      });
      /**
        @member -
        @memberof ReturnLine
        @description The price will be recalculated when the units change.
      */
      it("If the quantityUnit or sellingUnit are changed, \"calculatePrice\" should be " +
          "run.", function (done) {
        returnModel.set({customer: ttoys});
        assert.isUndefined(lineModel.get("price"));
        lineModel.set({item: btruck});
        lineModel.set({credited: 10});
        setTimeout(function () {
          assert.equal(lineModel.get("price"), 9.8910);
          done();
        }, 1900);
      });
      /**
        @member -
        @memberof ReturnLine
        @description If price or credited change, extendedPrice should be recalculated.
      */
      it("If price or credited change, extendedPrice should be recalculated.", function () {
        assert.equal(lineModel.get("extendedPrice"), 98.91);
      });
      /**
        @member -
        @memberof ReturnLine
        @description When credited is changed extendedPrice should be recalculated.
      */
      it("When credited is changed extendedPrice should be recalculated", function (done) {
        lineModel.set({credited: 20});
        setTimeout(function () {
          assert.equal(lineModel.get("extendedPrice"), 197.82);
          done();
        }, 1900);
      });
      /**
        @member -
        @memberof Return
        @description When currency or Return date is changed outstanding credit should be
          recalculated.
      */
      it.skip("When currency or return date is changed outstanding credit should be recalculated",
          function (done) {
        // frustratingly nondeterministic
        this.timeout(9000);
        var outstandingCreditChanged = function () {
          if (returnModel.get("outstandingCredit")) {
            // second time, with valid currency
            returnModel.off("change:outstandingCredit", outstandingCreditChanged);
            assert.equal(returnModel.get("outstandingCredit"), 25250303.25);
            done();
          } else {
            // first time, with invalid currency
            returnModel.set({currency: usd});
          }
        };

        returnModel.on("change:outstandingCredit", outstandingCreditChanged);
        returnModel.set({currency: null});
      });
      /**
        @member -
        @memberof Return
        @description AllocatedCredit should be recalculated when XM.ReturnAllocation records
          are added or removed.
      */
      it("AllocatedCredit should be recalculated when XM.ReturnAllocation records " +
          "are added or removed", function () {
        assert.isUndefined(returnModel.get("allocatedCredit"));
        allocationModel.set({currency: usd, amount: 200});
        returnModel.get("allocations").add(allocationModel);
        assert.equal(returnModel.get("allocatedCredit"), 200);
      });
      /**
        @member -
        @memberof Return
        @description When Return date is changed allocated credit should be recalculated.
      */
      it("When the Return date is changed allocated credit should be recalculated", function () {
        allocationModel.set({currency: usd, amount: 300});
        returnModel.set({returnDate: new Date("1/1/2010")});
        assert.equal(returnModel.get("allocatedCredit"), 300);
      });
      /**
        @member -
        @memberof Return
        @description When subtotal, totalTax or miscCharge are changed, the total
          should be recalculated.
      */
      it("When subtotal, totalTax or miscCharge are changed, the total should be recalculated",
          function () {
        assert.equal(returnModel.get("total"), 207.71);
        returnModel.set({miscCharge: 40});
        assert.equal(returnModel.get("total"), 247.71);
      });
      /**
        @member -
        @memberof Return
        @description TotalTax should be recalculated when taxZone changes or
          taxAdjustments are added or removed.
      */
      it("TotalTax should be recalculated when taxZone changes.", function (done) {
        var totalChanged = function () {
          returnModel.off("change:total", totalChanged);
          assert.equal(returnModel.get("taxTotal"), 10.88);
          assert.equal(returnModel.get("total"), 248.70);
          done();
        };

        assert.equal(returnModel.get("taxTotal"), 9.89);
        returnModel.on("change:total", totalChanged);
        returnModel.set({taxZone: nctax});
      });
      it("TotalTax should be recalculated when taxAdjustments are added or removed.",
          function (done) {
        var totalChanged = function () {
          returnModel.off("change:total", totalChanged);
          assert.equal(returnModel.get("taxTotal"), 20.88);
          assert.equal(returnModel.get("total"), 258.70);
          done();
        };

        ReturnTaxModel.set({taxCode: nctaxCode, amount: 10.00});
        returnModel.on("change:total", totalChanged);
        returnModel.get("taxAdjustments").add(ReturnTaxModel);
      });
      it("The document date of the tax adjustment should be the Return date.",
          function () {
        assert.equal(returnModel.get("returnDate"), ReturnTaxModel.get("documentDate"));
      });
      /**
        @member -
        @memberof Return
        @description When an Return is loaded where "isPosted" is true, then the following
          attributes will be made read only:
          lineItems, number, returnDate, terms, salesrep, commission, taxZone, saleType
      */
      it("When an Return is loaded where isPosted is true, then the following " +
          "attributes will be made read only: lineItems, number, returnDate, terms, " +
          "salesrep, commission, taxZone, saleType", function (done) {
        var postedReturn = new XM.Return(),
          statusChanged = function () {
            if (postedReturn.isReady()) {
              postedReturn.off("statusChange", statusChanged);
              assert.isTrue(postedReturn.isReadOnly("lineItems"));
              assert.isTrue(postedReturn.isReadOnly("number"));
              assert.isTrue(postedReturn.isReadOnly("returnDate"));
              assert.isTrue(postedReturn.isReadOnly("salesRep"));
              assert.isTrue(postedReturn.isReadOnly("commission"));
              assert.isTrue(postedReturn.isReadOnly("taxZone"));
              assert.isTrue(postedReturn.isReadOnly("saleType"));
              done();
            }
          };

        postedReturn.on("statusChange", statusChanged);
        postedReturn.fetch({number: "70000"});
      });
      /**
        @member -
        @memberof Return
        @description Balance should be recalculated when total, allocatedCredit, or
          outstandingCredit are changed.
      */
      it("Balance should be recalculated when total, allocatedCredit, or outstandingCredit " +
          "are changed", function () {
        assert.equal(returnModel.get("balance"), 0);
      });
      /**
        @member -
        @memberof Return
        @description When allocatedCredit or lineItems exist, currency should become read only.
      */
      it("When allocatedCredit or lineItems exist, currency should become read only.", function () {
        assert.isTrue(returnModel.isReadOnly("currency"));
      });
      /**
        @member -
        @memberof Return
        @description To save, the Return total must not be less than zero and there must be
          at least one line item.
      */
      it("Save validation: The total must not be less than zero", function () {
        returnModel.set({customer: ttoys, number: "98765"});
        assert.isUndefined(JSON.stringify(returnModel.validate(returnModel.attributes)));
        returnModel.set({total: -1});
        assert.isObject(returnModel.validate(returnModel.attributes));
        returnModel.set({total: 1});
        assert.isUndefined(JSON.stringify(returnModel.validate(returnModel.attributes)));
      });
      it("Save validation: There must be at least one line item.", function () {
        var lineItems = returnModel.get("lineItems");
        assert.isUndefined(JSON.stringify(returnModel.validate(returnModel.attributes)));
        lineItems.remove(lineItems.at(0));
        assert.isObject(returnModel.validate(returnModel.attributes));
      });

      it("XM.Return includes a function calculateAuthorizedCredit", function (done) {
        // TODO test more thoroughly
        /*
        > Makes a call to the server requesting the total authorized credit for a given
          - sales order number
          - in the Return currency
          - using the Return date for exchange rate conversion.
        > Authorized credit should only include authoriztions inside the "CCValidDays" window,
          or 7 days if no CCValidDays is set, relative to the current date.
        > The result should be set on the authorizedCredit attribute
        > On response, recalculate the balance (HINT#: Do not attempt to use bindings for this!)
        */
        assert.isFunction(returnModel.calculateAuthorizedCredit);
        returnModel.calculateAuthorizedCredit();
        setTimeout(function () {
          assert.equal(returnModel.get("authorizedCredit"), 0);
          done();
        }, 1900);
      });

      /**
        @member -
        @memberof Return
        @description Return includes a function "calculateTax" that
          Gathers line item, freight and adjustments
          Groups by and sums and rounds to XT.MONEY_SCALE for each tax code
          Sums the sum of each tax code and sets totalTax to the result
      */
      it.skip("has a calculateTax function that works correctly", function () {
        // TODO: put under test
      });
      /**
        @member -
        @memberof Return
        @description When a customer with non-base currency is selected the following values
          should be displayed in the foreign currency along with the values in base currency
          - Unit price, Extended price, Allocated Credit, Authorized Credit, Margin,
          Subtotal, Misc. Charge, Freight, Total, Balance
      */

      it.skip("When a customer with non-base currency is selected the following values " +
          "should be displayed in the foreign currency along with the values in base currency " +
          " - Unit price, Extended price, Allocated Credit, Authorized Credit, Margin, " +
          "Subtotal, Misc. Charge, Freight, Total, Balance", function () {

        // TODO: put under test (requires postbooks demo to have currency conversion)
      });


    });
    describe("Return List View", function () {
      /**
        @member -
        @memberof Return
        @description A list view should exist called XV.ReturnList. Users can perform the following actions from the list: Delete unposted
          Returns where the user has the MaintainCreditMemos  privilege, Post unposted
          Returns where the user has the "PostARDocuments" privilege, Void posted Returns
          where the user has the "VoidPostedARCreditMemos" privilege, Print Return forms where
          the user has the "PrintCreditMemos" privilege.
      */
      it("Delete unposted Returns where the user has the MaintainCreditMemos privilege",
          function (done) {
        var model = new XM.ReturnListItem();
        model.couldDestroy(function (response) {
          assert.isTrue(response);
          done();
        });
      });
      it("Cannot delete Returns that are already posted", function (done) {
        var model = new XM.ReturnListItem();
        model.set({isPosted: true});
        XT.session.privileges.attributes.MaintainCreditMemos = true;
        model.couldDestroy(function (response) {
          assert.isFalse(response);
          done();
        });
      });
      it("Post unposted Returns where the user has the PostARDocuments privilege",
          function (done) {
        var model = new XM.ReturnListItem();
        model.canPost(function (response) {
          assert.isTrue(response);
          done();
        });
      });
      it("Cannot post Returns that are already posted", function (done) {
        var model = new XM.ReturnListItem();
        model.set({isPosted: true});
        XT.session.privileges.attributes.PostARDocuments = true;
        model.canPost(function (response) {
          assert.isFalse(response);
          done();
        });
      });
      it("Void posted Returns where the user has the VoidPostedARCreditMemos privilege",
          function (done) {
        var model = new XM.ReturnListItem();
        model.set({isPosted: true});
        XT.session.privileges.attributes.VoidPostedARCreditMemos = true;
        model.canVoid(function (response) {
          assert.isTrue(response);
          done();
        });
      });
      it("Cannot void Returns that are not already posted", function (done) {
        var model = new XM.ReturnListItem();
        model.set({isPosted: false});
        XT.session.privileges.attributes.VoidPostedARCreditMemos = true;
        model.canVoid(function (response) {
          assert.isFalse(response);
          done();
        });
      });
      /**
        @member -
        @memberof Return
        @description The Return list should not support multiple selections
      */
      it("The Return list should not support multiple selections", function () {
        var list = new XV.ReturnList();
        assert.isFalse(list.getMultiSelect());
      });
      it("The Return list has a parameter widget", function () {
        /*
          * The Return list should use a parameter widget that has the following options:
            > Returns
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
            > Return Date
              - From Date
              - To Date
        */
        var list = new XV.ReturnList();
        assert.isString(list.getParameterWidget());
      });
      /**
        @member -
        @memberof Return
        @description The ReturnList should be printable
      */
      it("XV.ReturnList should be printable", function () {
        var list = new XV.ReturnList();
        // TODO: implement printing on Returns
        //assert.isTrue(list.getAllowPrint());
      });

    });
    describe("Return workspace", function () {
      it("Has a customer relation model that's mapped correctly", function () {
        // TODO: generalize this into a relation widget test that's run against
        // every relation widget in the app.
        var workspace = new XV.ReturnWorkspace();
        var widgetAttr = workspace.$.customerWidget.attr;
        var attrModel = _.find(XT.session.schemas.XM.attributes.Return.relations,
          function (relation) {
            return relation.key === widgetAttr;
          }).relatedModel;
        var widgetModel = XT.getObjectByName(workspace.$.customerWidget.getCollection())
          .prototype.model.prototype.recordType;
        assert.equal(attrModel, widgetModel);
      });
      /**
        @member -
        @memberof Return
        @description Supports grid-entry of line items on desktop browsers.
      */
      it("Should include line items views where a grid box is used for non-touch devices " +
          "and a list relation editor for touch devices.", function () {
        var workspace;

        enyo.platform.touch = true;
        workspace = new XV.ReturnWorkspace();
        assert.equal(workspace.$.lineItemBox.kind, "XV.ReturnLineItemBox");
        enyo.platform.touch = false;
        workspace = new XV.ReturnWorkspace();
        assert.equal(workspace.$.lineItemBox.kind, "XV.ReturnLineItemGridBox");
      });
      /**
        @member -
        @memberof Return
        @description A Tax adjustments panel should be available. User shold be able to
        add new tax adjustments and remove tax adjustments for unposted Returns
      */
      it.skip("Should include a panel that displays a group box of lists of taxes separated" +
          "headers for taxes by line items, freight, and adjustments. Users should be " +
          "able to add new tax adjustments and remove tax " +
          "adjustments for unposted Returns", function () {
      });
      /**
        @member -
        @memberof Return
        @description A Credit Allocation panel should be available. When 'New'  button is
         selected, user should be allowed to create a minimalized version of cash receipt
         on the fly
      */
      describe.skip("Credit Allocation", function () {
        it("Should include a panel that displays credit allocations", function () {
        });
        it("When clicked a \"new\" button should allow the user to create a new " +
            "minimalized version of cash receipt on-the-fly", function () {
        });
      /**
        @member -
        @memberof Return
        @description The cash receipt need only record the amount, currency, document number,
        document date, distribution date and whether the balance should generate a
        credit memo or a customer deposit, depending on global customer deposit metrics
      */
        it("The cash receipt need only record the amount, currency, document number," +
            "document date, distribution date and whether the balance should generate a" +
            "credit memo or a customer deposit, depending on global" +
            "customer deposit metrics", function () {
        });
      /**
        @member -
        @memberof Return
        @description When clicked, an "allocate" button should present a list of open receivables
         that are credits that can be associated with the Return
      */
        it("When clicked, an \"allocate\" button should present a list of open receivables" +
            "that are credits that can be associated with the Return", function () {
        });
       /**
        @member -
        @memberof Return
        @description The 2 buttons above should only be enabled if the user has
        the "ApplyARMemos" privilege"
      */
        it("The 2 buttons above should only be enabled if the user has" +
            "the \"ApplyARMemos\" privilege", function () {
        });
      });
      /**
        @member -
        @memberof Return
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
        @memberof Return
        @description The customer search list should search only on active customers.
      */
      it.skip("The customer search list should search only on active customers", function () {
        // TODO: put under test
        assert.fail();
      });
      /**
        @member -
        @memberof Return
        @description A child workspace view should exist called XV.ReturnLineWorkspace
          should include: all the attributes on XM.ReturnLine, item cost and item list
          price values, and a read only panel that displays a group box of lists of taxes.
      */
      it.skip("The ReturnLine child workspace", function () {
        // TODO: put under test
        assert.fail();
      });
    });
    describe("Sales Extension", function () {
      /**
        @member -
        @memberof Return
        @description Return will include authorizedCredit, the sum of credit card authorizations
          in the order currency where:
            - The current_timestamp - authorization date is less than CCValidDays || 7
            - The payment status the cc payment (ccpay) record is authorized ("A")
            - The cc payment record is for an order number = the order number specified on
              the Return
          When currency or Return date is changed authorized credit should be recalculated.
      */
      it("authorizedCredit", function () {
        // TODO: better testing
        assert.equal(returnModel.get("authorizedCredit"), 0);
      });
      it.skip("When currency or Return date is changed authorized credit should be" +
        "recalculated.", function () {
      });
      it.skip("When freight is changed the total should be recalculated", function () {
      });
    });
    describe("Project extension", function () {
      /**
        @member -
        @memberof Return
        @description The project attribute will be read-only for posted Returns
      */
      it.skip("project is read-only for posted Returns", function () {
        // TODO: put under test
        assert.fail();
      });
      /**
        @member -
        @memberof Return
        @description The project widget will be added to the Return workspace if the
          UseProjects setting is true.
      */
      it.skip("Add the project widget to the Return workspace if the UseProjects setting is true.",
          function () {
        // TODO: put under test
        assert.fail();
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());

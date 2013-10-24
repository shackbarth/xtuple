/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";


/*
TODO: invoiceLine ORM:

      {
        "name": "salesCategory",
        "toOne": {
          "type": "SalesCategory",
          "column": "invcitem_salescat_id"
        }
      },
*/
  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert;

  exports.additionalTests = function () {
    /**
      @member -
      @memberof Invoice.prototype
      @description There is a setting "Valid Credit Card Days"
      @default 7
    */
    it.skip("The system settings option CCValidDays will default to 7 if not already in the db", function () {
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
      // TODO
    });
    it.skip("A view should be used underlying XM.InvoiceLineTax that does nothing " +
        "after insert, update or delete (existing table triggers for line items will " +
        "take care of populating this data correctly)", function () {
      // TODO
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
      @property {ExtendedPrice} extendedPrice billed * quantityUnitRatio * (price / priceUnitRatio)
      @property {Number} notes
      @property {TaxType} taxType
      @property {Money} taxTotal sum of all taxes
      @property {InvoiceLineTax} taxes
    */
    var invoiceLine = it("A nested only model called XM.InvoiceLine extending XM.Model should exist", function () {
      var lineModel;
      assert.isFunction(XM.InvoiceLine);
      lineModel = new XM.InvoiceLine();
      assert.isTrue(lineModel instanceof XM.Model);
      assert.equal(lineModel.idAttribute, "uuid");
    });
    it.skip("InvoiceLine should include attributes", function () {
      // TODO
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
    var invoiceModel;
    it("prepare invoice model", function (done) {
      var statusChanged = function () {
        if (invoiceModel.isReady()) {
          invoiceModel.off("statusChange", statusChanged);
          done();
        }
      };
      invoiceModel = new XM.Invoice();
      invoiceModel.on("statusChange", statusChanged);
      invoiceModel.initialize(null, {isNew: true});
    });
    var bpaint;
    it("prepare bpaint model", function (done) {
      var statusChanged = function () {
        if (bpaint.isReady()) {
          bpaint.off("statusChange", statusChanged);
          done();
        }
      };
      bpaint = new XM.ItemRelation();
      bpaint.on("statusChange", statusChanged);
      bpaint.fetch({number: "BPAINT1"});
    });
    var btruck;
    it("prepare btruck model", function (done) {
      var statusChanged = function () {
        if (btruck.isReady()) {
          btruck.off("statusChange", statusChanged);
          done();
        }
      };
      btruck = new XM.ItemRelation();
      btruck.on("statusChange", statusChanged);
      btruck.fetch({number: "BTRUCK1"});
    });
    var lineModel;
    it("prepare line model", function (done) {
      var statusChanged = function () {
        if (lineModel.isReady()) {
          lineModel.off("statusChange", statusChanged);
          done();
        }
      };
      lineModel = new XM.InvoiceLine();
      lineModel.on("statusChange", statusChanged);
      lineModel.initialize(null, {isNew: true});
    });
    /**
      @member -
      @memberof InvoiceLine.prototype
      @description When the item is changed the following should be updated from item information:
        sellingUnits, quantityUnit, quantityUnitRatio, priceUnit, priceUnitRatio, unitCost
        and taxType. Then, the price should be recalculated.
    */
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
      @description The price will be recalculated when the units change.
    */
    it("If the quantityUnit or SellingUnit are changed, \"calculatePrice\" should be run.", function () {
      // TODO
    });
    /**
      @member -
      @memberof InvoiceLine.prototype
      @description If price or billing change, extendedPrice should be recalculated.
    */
    it("If price or billing change, extendedPrice should be recalculated.", function () {
      // TODO
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
      @description When billed is changed extendedPrice should be recalculated.
    */
    it.skip("When billed is changed extendedPrice should be recalculated", function () {
      // TODO
      assert.fail();
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
      // TODO
      //HINT: Default tax type must be enforced by a trigger on the database if no privilege.
      assert.fail();
    });
    it("lineNumber must auto-number itself sequentially", function () {
      var dummyModel = new XM.InvoiceLine();
      assert.isUndefined(lineModel.get("lineNumber"));
      invoiceModel.get("lineItems").add(dummyModel);
      invoiceModel.get("lineItems").add(lineModel);
      assert.equal(lineModel.get("lineNumber"), 2);
      // TODO: be more thorough
    });


  };
/*

***** CHANGES MADE TO CORE APPLICATION ******

* When isMiscellaneous is false, item is editable and itemNumber, itemDescription and salesCategory are read only.
* When isMiscellaneous is true, item is read only and itemNumber, itemDescription and salesCategory are editable.
* Validation:
  > If "isMiscellaneous" === true, then an item must be set.
  > If "isMiscellaneous" === false itemNumber, itemDescrciption and salesCategory must be set.

* XM.InvoiceLine should have a "calculatePrice" function that retrieves a price from the customer.itemPrice dispatch function based on the "billed" value.

* XM.InvoiceLine should have a "fetchSellingUnits" function that updates "sellingUnits" based on the item selected.

* A nested only model called XM.InvoiceTax extending XM.Model should exist.
* XM.InvoiceTax should include the following attributes:
  > String "uuid" that is the idAttribute
  > TaxCode "taxCode"
  > Money "amount"

* A nested only model called XM.InvoiceAllocation extending XM.Model should exist.
* XM.InvoiceAllocation should include the following attributes:
  > String "uuid" that is the idAttribute
  > String "invoice"
  > Money "amount"
  > Currency "currency"
* XM.InvoiceAllocation should only be updateable by users with the "ApplyARMemos" privilege.
#HINT: The document type is fixed value "I" on the aropenalloc table which this model should reference

* A model called XM.InvoiceListItem extending XM.Info should exist.
* XM.InvoiceListItem should include the following attributes:
  > String "number" that is the idAttribute
  > Boolean "printed"
  > CustomerRelation "customer"
  > Date "invoiceDate"
XXX  > Money "total"
  > Boolean "isPosted"
XXX  > Boolean "isOpen"
  > Boolean "isVoid"
* Only users that have "ViewMiscInvoices" or "MaintainMiscInvoices" may read XV.InvoiceListItem.
* XM.InvoiceListItem is not editable.
* XM.InvoiceListItem includes a "post" function that dispatches a XM.Invoice.post function to the server
* XM.InvoiceListItem includes a "void" function that dispatches a XM.Invoice.void function to the server


* XM.Invoice should include the following attributes:
    > String "number" that is the documentKey and idAttribute
    > Date "invoiceDate" required default today
    > Boolean "isPosted" required, defaulting to false, read only
    > Boolean "isVoid" required, defaulting to false, read only
    > SalesCustomer "customer" required
    > String "billtoName"
    > String "billtoAddress1"
    > String "billtoAddress2"
    > String "billtoAddress3"
    > String "billtoCity"
    > String "billtoState"
    > String "billtoPostalCode"
    > String "billtoCountry"
    > String "billtoPhone"
    > Currency "currency"
    > Terms "terms"
    > SalesRep "salesRep"
    > Percent "commission" required, default 0
    > SaleType "saleType"
    > String "customerPurchaseOrderNumber"
    > TaxZone "taxZone"
    > String "notes"

    --DONE TO HERE--

    > InvoiceRelation "recurringInvoice"
    > Money "allocatedCredit" the sum of all allocated credits
    > Money "outandingCredit" the sum of all unallocated credits, not including cash receipts pending
    > Money "subtotal" the sum of the extended price of all line items
    > Money "taxTotal" the sum of all taxes inluding line items, freight and tax adjustments
    > Money "miscCharge" read only (will be re-implemented as editable by Ledger)
    > Money "total" the calculated total of subtotal + freight + tax + miscCharge
    > Money "balance" the sum of total - allocatedCredit - authorizedCredit - oustandingCredit.
      - If sum calculates to less than zero, then the balance is zero.
    > InvoiceAllocation "allocations"
    > InvoiceTax "taxAdjustments"
    > InvoiceLine "lineItems"
    > InvoiceCharacteristic "characteristics"
    > InvoiceContact "contacts"
    > InvoiceAccount "accounts"
    > InvoiceCustomer "customers"
    > InvoiceFile "files"
    > InvoiceUrl "urls"
    > InvoiceItem "items"
* Only users that have "ViewMiscInvoices" or "MaintainMiscInvoices" may read XV.Invoice.
* Only users that have "MaintainMiscInvoices" may create, update and delete XV.InvoiceListItem.
* Invoices that are posted may not be deleted.
* When the customer changes on XM.Invoice, the following customer data should be populated from the customer:
  > billtoName (= customer.name)
  > billtoAddress1, billtoAddress2, billtoAddress3, billtoCity, billtoState, billtoPostalCode, billtoCountry should be populated by customer.billingContact.address.
  > salesRep
  > commission
  > terms
  > taxZone
  > currency
  > billtoPhone (= customer.billingContact.phone)
  > The following fields will be set to read only if the customer does not allow free form billto:
    - billtoName
    - billtoAddress1
    - billtoAddress2
    - billtoAddress3
    - billtoCity
    - billtoState
    - billtoPostalCode
    - billtoCountry
    - billtoPhone
  > If the customer attribute is empty, the above fields should be unset.

* When currency or invoice date is changed outstanding credit should be recalculated.
* When invoice date is changed allocated credit should be recalculated.
* When subtotal, totalTax or miscCharge are changed, the total should be recalculated.
* totalTax should be recalculated when taxZone changes or taxAdjustments are added or removed.
* When an invoice is loaded where "isPosted" is true, then the following attributes will be made read only:
  > lineItems
  > number
  > invoiceDate
  > terms
  > salesrep
  > commission
  > taxZone
  > saleType

* balance should be recalculated when total, allocatedCredit, or outstandingCredit are changed.
* allocatedCredit should be recalculated when XM.InvoiceAllocation records are added or removed.
* When allocatedCredit or lineItems exist, currency should become read only.
* XM.Invoice should check the setting for "InvcNumberGeneration" to determine numbering policy.
* Save validation:
  > The total must not be less than zero.
  > There must be at least one line item.

* XM.Invoice includes a function "calculateAuthorizedCredit" that
  > Makes a call to the server requesting the total authorized credit for a given
    - sales order number
    - in the invoice currency
    - using the invoice date for exchange rate conversion.
  > Authorized credit should only include authoriztions inside the "CCValidDays" window, or 7 days if no CCValidDays is set, relative to the current date.
  > The result should be set on the authorizedCredit attribute
  > On response, recalculate the balance (HINT#: Do not attempt to use bindings for this!)

* XM.Invoice includes a function "calculateTax" that
  > Gathers line item, freight and adjustments
  > Groups by and sums and rounds to XT.MONEY_SCALE for each tax code
  > Sums the sum of each tax code and sets totalTax to the result

* A list view should exist called XV.InvoiceList
* XV.InvoiceList should support the following actions
  > Delete unposted invoices where the user has the "MaintainMiscInvoices" privilege
  > Post unposted invoices where the user has the "PostMiscInvoices" privilege
  > Void posted invoices where the user has the "VoidMiscInvoices" privilege
  > Print invoice forms where the user has the "PrintInvoices" privilege.
* The invoice list should support multiple selections
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
* XV.InvoiceList should be printable

* A workspace view should exist called XV.InvoiceWorkspace
  > Should include line items views where a grid box is used for non-touch devieces and a list relation editor for touch devices.
  > Should include a panel that displays a group box of lists of taxes separated headers for taxes by line items, freight, and adjustments. Users should be able to add new tax adjustments, and remove tax adjustments for non-posted invoices.
  > Should include a panel that displays credit allocations.
    - When clicked a "new" button should allow the user to create a new minimalized version of cash receipt on-the-fly. The cash receipt need only record the amount, currency, document number, document date, distribution date and whether the balance should generate a credit memo or a customer deposit, depending on global customer deposit metrics.
    - When clicked, an "allocate" button should present a list of open receivables that are credits that can be associated with the invoice.
    - The 2 buttons above should only be enabled if the user has the "ApplyARMemos" privilege.
  > The bill to addresses available when searching addresses sholud filter on the addresses associated with the customer's account record by default.
  > The customer search list should search only on active customers.

* A child workspace view should exist called XV.InvoiceLineWorkspace should include:
  > All the attributes on XM.InvoiceLine.
  > Item cost and item list price values.
  > A read only panel that displays a group box of lists of taxes.

***** CHANGES MADE BY BILLING EXTENSION ******

* A model called XM.InvoiceRelation extending XM.Info should exist.
* XM.InvoiceRelation should include the following attributes:
  > String "number" that is the idAttribute
  > CustomerRelation "customer"
  > Date "invoiceDate"
  > Boolean "isPosted"
  > Boolean "isOpen"
  > Boolean "isVoid"
* All users with the billing extension may read XV.InvoiceListItem.
* XM.InvoiceListItem is not editable.

* Add "Invoices" list to Billing module
* Add "Invoices" list to Sales modules

***** CHANGES MADE BY CRM EXTENSION ******

* Nested only models should be created according to convention for many-to-many document associations:
  > XM.InvoiceIncident
  > XM.InvoiceOpportunity

* XM.Invoice will include:
  > InvoiceIncident "incidents"
  > InvoiceOpportunity "opportunities"

***** CHANGES MADE BY SALES EXTENSION ******

* A nested only model should be created according to convention for many-to-many document associations:
  > XM.InvoiceSalesOrder

* XM.InvoiceLine will include:
  > SalesOrderLine "salesOrderLine"

* XM.InvoiceListItem will include:
  > String "orderNumber"

* XM.Invoice will include:
  > String "orderNumber"
  > Date "orderDate" default today
  > InvoiceSalesOrder "salesOrders"
  > Money "authorizedCredit" the sum of credit card authorizations in the order currency where:
    - The current_timestamp - authorization date is less than CCValidDays || 7
    - The payment status the cc payment (ccpay) record is authorized ("A")
    - The cc payment record is for an order number = the order number specified on the invoice
* When currency or invoice date is changed authorized credit should be recalculated.
* When freight is changed the total should be recalculated.

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
#HINT: This will likely require creating an alternate dispatchable "post" function that accepts an invoice id _and_ inventory data.

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
  > The following fields will be set to read only if the customer does not allow free form shipnto:
    - shiptoName
    - shiptoAddress1
    - shiptoAddress2
    - shiptoAddress3
    - shiptoCity
    - shiptoState
    - shiptoPostalCode
    - shiptoCountry
    - shiptoPhone
* The inventory extension adds a function to XM.Invoice "copyBilltoToShipto" that does the following
  > Clears the shipto
  > Copies billto name, address fields and phone number to shipto equivilants.
  > Sets the invoice tax zone to the customer tax zone.
* When an invoice is loaded where "isPosted" is true, then the following attributes will be made read only:
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

* If the shipto changes to a value, the following fields should be set based on information from the shipto:
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

* Freight should be read only and zero when the "isCustomerPay" property is false on the ship charge associated with the invoice.

* totalTax should be recalculated when freight changes.

* Add the following to the invoice workspace:
  > When the customer is changed on the XV.InvoiceWorkspace model:
    - customer should be set on shipto relation so that it will search on and select from that customer's shipto addresses.
    - The bill to address should be supplimented with a "Shipto" button that when clicked runs the copyToShipto function ()
    - The copy ship to button should be disabled if the customer does not allow free-form shiptos.
  > The shipto addresses available when searching addresses sholud filter on the addresses associated with the customer's account record by default.

***** CHANGES MADE BY PROJECT EXTENSION ******

* A nested only model should be created according to convention for many-to-many document associations:
  > XM.InvoiceProject

* XM.Invoice will include:
  > ProjectRelation "project"
  > InvoiceProject "projects"

* When an invoice is loaded where "isPosted" is true, then the following attributes will be made read only:
  > project

* Add the project widget to the invoice workspace if the "UseProjects" setting is true.

***** CHANGES MADE BY MANUFACTURING EXTENSION ******

* A nested only model should be created according to convention for many-to-many document associations:
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

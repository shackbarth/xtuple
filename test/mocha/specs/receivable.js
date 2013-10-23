/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert,
    model;

  var additionalTests = function () {
    it("A model called XM.Receivable extending XM.Document should exist in the billing extension",
      function () {
        assert.isDefined(XM.Receivable);
        //assert.isTrue(XM.Receivable instanceof XM.Document);
        model = new XM.Receivable();
        model.initialize(null, {isNew: true});
        assert.isDefined(model);
      });

    it("The numbering policy on XM.Receivable should be XM.Document.AUTO_NUMBER", function () {
      assert.equal(XM.Receivable.numberPolicySetting, XM.Document.AUTO_NUMBER);
    });

    it("XM.Receivable should be extended to include the following contstants:" +
      "XM.Receivable.INVOICE = 'I', XM.Receivable.DEBIT_MEMO = 'D', XM.Receivable.CREDIT_MEMO = 'C'" +
      "XM.Receivable.CUSTOMER_DEPOSIT = 'R'", function () {
        assert.equal(XM.Receivable.INVOICE, "I");
        assert.equal(XM.Receivable.DEBIT_MEMO, "D");
        assert.equal(XM.Receivable.CREDIT_MEMO, "C");
        assert.equal(XM.Receivable.CUSTOMER_DEPOSIT, "R");
      });

    it("The above constants should be added to a static collection called XM.receivableTypes", function () {
      assert.isDefined(XM.receivableTypes);
    });

    it("Currency attribute defaults to base currency", function () {
      assert.equal(model.get("currency"), XT.baseCurrency());
    });

    it("A Mixin called XM.ReceivableMixin should exist", function () {
      assert.isDefined(XM.ReceivableMixin);
    });

    it('XM.Receivable should be extended by XM.ReceivableMixin', function () {
      //assert.isTrue(XM.ReceivableMixin instanceof XM.Receivable);
    });

    it("XM.ReceivableMixin should have a function isDebit " +
      "that returns a boolean true if the value the documentType attribute " +
      "is XM.Receivable.DEBIT_MEMO or XM.Receivable.INVOICE, otherwise false", function () {

        assert.isDefined(XM.ReceivableMixin.isDebit);
        assert.isFalse(model.isDebit());
        model.set("documentType", XM.Receivable.DEBIT_MEMO);
        assert.isTrue(model.isDebit());
      });

    it("XM.ReceivableMixin should have a function isCredit " +
      "that returns a boolean true if the value the documentType attribute " +
      "is XM.Receivable.CREDIT_MEMO or XM.Receivable.CUSTOMER_DEPOSIT, otherwise false.", function () {

        assert.isDefined(XM.ReceivableMixin.isCredit);
        assert.isFalse(model.isCredit());
        model.set("documentType", XM.Receivable.CREDIT_MEMO);
        assert.isTrue(model.isCredit());
      });

    // * A nested only model called XM.ReceivableTax extending XM.Model should be created in the billing extension.
    // * XM.ReceivableTax should include the following attributes:
    //     > String "uuid" that is the idAttribute
    //     > TaxCode "taxCode"
    //     > Money "amount"
    // * XM.ReceivableTax can be created, but not updated or deleted.

    // * A nested only model called XM.ReceivableApplication extending XM.Model should be created in the billing extension.
    // * XM.ReceiavbleApplication should include applications where the parent is both the target and the source.
    // # HINT: Create a view based on a union query to acheive the requirement above.
    // * XM.ReceivableApplication should include the following attributes:
    //     > String "uuid" that is the idAttribute
    //     > String "applicationType"
    //     > String "documentNumber"
    //     > Date "applicationDate"
    //     > Date "distributionDate"
    //     > Money "amount"
    //     > Currency "currency"
    //     > Money "baseAmount"
    // * XM.ReceivableApplications is read only



    // *
    // * XM.Receivable should include the following attributes:

    //     > Currency "currency" required, defaults to base currency

    //     > Money "balance", calculated value of amount - paid
    //     > Money "taxTotal", calculated sum of taxes

    //     > ReceivableTax "taxes"
    //     > ReceivableApplication "applications"

    // * The numbering policy on XM.Receivable should be XM.Document.AUTO_NUMBER.

    // * The order number sequence is "ARMemoNumber"
    // * The "ViewAROpenItems" and "EditAROpenItem" privileges should be added to XM.SalesCustomer read privileges.

    // * A XM.Receivable object can not be created directly. The database view underlying the orm should "do nothing" on insertion.
    // * A XM.Receivable object can not be deleted.  The database view underlying the orm should "do nothing" on deletion.
    // * A dispatchable function should exist on the database called XM.Receivable.createCreditMemo that accepts a JSON credit memo attributes object, including taxes, and posts it.
    // * A dispatchable function should exist on the database called XM.Receivable.createDebitMemo that accepts a JSON debit memo attributes object, including taxes, and posts it.
    // # HINT: On previous two functions you must 1) insert an aropen record 2) insert tax records 3) run the createarcreditmemo or createardebitmemo function that will process all posting activity. Cross check results on the aropen and aropentax tables with the same transaction performed by the Qt client to make sure all columns are populated completely and consistently.
    // * When save is called on the XM.Receivable model and the status is READY_NEW:
    //   > If the documentType is XM.Receivable.CREDIT_MEMO then the function XM.Receivable.createCretidMemo should be dispatched
    //   > If the documentType is XM.Receivable.DEBIT_MEMO then the function XM.Receivable.createDebitMemo should be dispatched
    // * When customer is set on XM.Receivable the terms, currency, and salesRep should be copied from the customer and commission should be recalculated.
    // * When the amount is changed commission should be recalculated as customer.commission * amount.
    // * When the document date or terms is changed the dueDate sholud be recalculated using the terms "calculateDueDate" function.
    // * When the status of a receivable changes to READY_CLEAN, the following attributes should be changed to read only:
    //   > customer
    //   > documentDate
    //   > documentType
    //   > documentNumber
    //   > terms
    // * When child tax records are added or removed, the taxTotal should be recalculated.

    // * Validation
    //   > The amount must be greater than zero.
    //   > The taxTotal may not be greater than the amount.

    // * A model called XM.ReceivableListItem extending XM.Model should exist in the billing extension.
    // * RecievableListItem should include all receivables, unposted invoices, and unposted returns.
    // # Hint: Create a view using a union query to achieve the above requirement
    // * XM.ReceivableListItem should include the following attributes:
    //     > String "uuid" that is the idAttribute
    //     > String "documentType"
    //     > String "documentNumber"
    //     > Boolean "isPosted"
    //     > Boolean "isOpen"
    //     > CustomerRelation "customer"
    //     > Date "documentDate"
    //     > Date "dueDate"
    //     > Money "amount"
    //     > Currency "currency"
    //     > Money "baseAmount"
    //     > Money "amount"
    //     > Currency "currency"
    //     > Money "paid"
    //     > Money "balance",
    //     > Money "baseAmount"
    //     > Money "basePaid"
    //     > String "notes"
    // * XM.ReceivableListItemCollection based on XM.Collection class should exist.
    // * A List view that presents the XM.Receivable collection should exist in the billing extension
    //    > No attribute will be designated as the key
    //    > The list should include headers
    //    > The list should include a footer with a total amount in base currency
    //    > The following action will be included on the list:
    //      - Open Receivable: Only enabled on posted receivables with privileges
    // * The recievable list view will have the following parameter options:
    //   > Receivables
    //     - Number
    //     - As Of - default today
    //   > Show
    //     - Unposted - unchecked by default
    //     - Closed - unchecked by default
    //     - Debits - checked by default
    //     - Credits - checked by default
    //   > Customer
    //     - Number
    //     - Type (picker)
    //     - Type Pattern (text)
    //     - Group
    //   > Due Date
    //     - From Date
    //     - To Date
    //   > Document Date
    //     - From Date
    //     - To Date
    // * The As Of parameter will only be enabled when unposted and closed are unchecked. Otherwise it will be set to the current date and disabled.
    // * When active the As Of parameter will limit query results to receivables where the As Of date is greater than or equal to the document date and is less than or equal to the close date or where the close date is null
    // # HINT: https://github.com/xtuple/xtuple/blob/master/lib/backbone-x/source/collection.js#L63
    // * A Workspace view that presents a XM.Receivable including viewing and editing of taxes (when applicable) should be exist in the billing extension
    //   > The saveText property on the workspace for XM.Receivable will be "Post" when the status of the object is READY_NEW and "Save" for any other status.
    //   > A XV.StickyCheckboxWidget should be visible when the model is in a READY_NEW state that provides the option to "Print on Post."
    //   > When "Print on Post" is checked, a standard form should be printed when posting.
    //   > taxTotal and taxes will be hidden when the receivable is an Invoice type
    // * Clicking the "New" button for the recievable list should reveal multiple menu options including "Credit Memo" and "Debit Memo"
    // * Selecting to create a new Credit Memo or Debit Memo will open the XM.Receivable workspace with the appropriate document type preselected.
    // * There should be a printed report definition for the receivables list.

  };

  exports.additionalTests = additionalTests;
}());

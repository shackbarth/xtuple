/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true, before: true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    crud = require("../lib/crud"),
    assert = require("chai").assert,
    model,
    applicationModel,
    listModel;

  var additionalTests = function () {
    // it.skip("The 'ViewAROpenItems' and 'EditAROpenItem' privileges should be added to XM.SalesCustomer read privileges", function () {
    //   assert.fail(true, true, "not implemented");
    // });

    it('XM.Receivable should match the specifications', function () {

      describe("XM.Receivable",
        function () {
          before(function () {
            assert.isDefined(XM.Receivable);
            model = new XM.Receivable();
            assert.isTrue(model instanceof XM.Document);
            model.initialize(null, {isNew: true});

            // set required fields that were already test in spec
            model.set("uuid", "TestReceivableId" + Math.random());
            model.set("customer", new XM.SalesCustomer());
            model.set("documentDate", new Date());
            model.set("dueDate", new Date());
            model.set("amount", 100);
            model.set("currency", XT.baseCurrency());
            model.set("documentNumber", "DocumentNumber" + Math.random());
          });

          it("A model extending XM.Document should exist in the billing extension",
            function () {
              assert.isDefined(model);
            });

          it("Should has an attribute Money 'balance' which is the calculated " +
             "value of amount minus paid", function () {
              model.set("amount", 30);
              model.set("paid", 20);
              assert.equal(model.get("balance"), 10);
            });

          it("The numbering policy should be XM.Document.AUTO_NUMBER", function () {
            assert.equal(model.numberPolicySetting, XM.Document.AUTO_NUMBER);
          });

          it("Should be extended to include the following constants:" +
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

          it('verify that XM.receivableTypes contains the constants', function () {
            assert.equal(XM.receivableTypes.length, 4);

            var ids = _.pluck(XM.receivableTypes.models, "id");
            assert.include(ids, XM.Receivable.INVOICE);
            assert.include(ids, XM.Receivable.DEBIT_MEMO);
            assert.include(ids, XM.Receivable.CREDIT_MEMO);
            assert.include(ids, XM.Receivable.CUSTOMER_DEPOSIT);
          });

          it("Currency attribute defaults to base currency", function () {
            assert.equal(model.get("currency"), XT.baseCurrency());
          });

          it("A Mixin called XM.ReceivableMixin should exist", function () {
            assert.isDefined(XM.ReceivableMixin);
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

          it.skip("The order number sequence is 'ARMemoNumber'", function () {
            assert.fail(true, true, "not implemented");
          });

          it("Validation: The amount must be greater than zero", function () {
            model.set("amount", 0);
            assert.equal(model.validate().code, "xt1013");
          });

          it("Validation: The taxTotal may not be greater than the amount", function () {
            model.set("amount", 20);
            model.set("taxTotal", 30);
            assert.equal(model.validate().code, "xt2024");
          });

          it.skip("When customer is set, the terms, currency, and salesRep should be copied from the customer and commission should be recalculated", function () {
            assert.fail(true, true, "not implemented");
          });

          it.skip("When the amount is changed, commission should be recalculated as customer.commission * amount", function () {
            assert.fail(true, true, "not implemented");
          });

          it.skip("When the document date or terms is changed, the dueDate sholud be recalculated using the terms 'calculateDueDate' function", function () {
            assert.fail(true, true, "not implemented");
          });

          it.skip("When child tax records are added or removed, the taxTotal should be recalculated", function () {
            assert.fail(true, true, "not implemented");
          });

          it.skip("XM.Receivable should have an attribute 'taxTotal' which is the calculated sum of taxes", function () {
            assert.fail(true, true, "not implemented");
          });

          it.skip("XM.Receivable object can not be created directly", function () {});

          it.skip("XM.Receivable object can not be deleted", function () {});

          // # HINT: On previous two functions you must 1) insert an aropen record 2) insert tax records 3)
          // run the createarcreditmemo or createardebitmemo function that will process all posting activity.
          // Cross check results on the aropen and aropentax tables with the same transaction performed by the
          // Qt client to make sure all columns are populated completely and consistently.
          it.skip("A dispatchable function should exist on the database called XM.Receivable.createCreditMemo " +
           "that accepts a JSON credit memo attributes object, including taxes, and posts it.", function () {});
          it.skip("A dispatchable function should exist on the database called XM.Receivable.createDebitMemo " +
            "that accepts a JSON debit memo attributes object, including taxes, and posts it.", function () {});

          it.skip("When save is called on the XM.Receivable model and the status is READY_NEW: ", function () {
            it.skip("If the documentType is XM.Receivable.CREDIT_MEMO then the function XM.Receivable.createCreditMemo " +
              "should be dispatched", function () {
                assert.isFunction(model.createCreditMemo);
              });
            it.skip("If the documentType is XM.Receivable.DEBIT_MEMO then the function XM.Receivable.createDebitMemo " +
              "should be dispatched", function () {
                assert.isFunction(model.createDebitMemo);
              });
          });
        });
    });

    describe("XM.ReceivableTax", function () {
      var taxModel;

      before(function () {
        assert.isDefined(XM.ReceivableTax);
        taxModel = new XM.Receivable();
        taxModel.initialize(null, {isNew: true});
      });

      it("A nested only model should be created in the billing extension", function () {
        assert.isDefined(XM.ReceivableTax);
      });

      it("Has 'uuid' as its idAttribute", function () {
        assert.equal("uuid", taxModel.idAttribute);
      });

      it("Should include the following attributes", function () {
        _.each(["uuid", "taxCode", "amount"], function (attr) {
          it("XM.ReceivableTax contains the " + attr + " attribute", function () {
            assert.include(XM.ReceivableTax.getAttributeNames(), attr);
          });
        });
      });

      it.skip("Can be created, but not updated or deleted", function () {
        assert.fail(true, true, "not implemented");
      });

      it("Extends XM.Model", function () {
        assert.isTrue(taxModel instanceof XM.Model);
      });
    });

    describe("XM.ReceivableApplication", function () {
      var applicationModel;

      before(function (done) {
        assert.isDefined("XM.ReceivableApplication");
        applicationModel = new XM.ReceivableApplication();
        applicationModel.fetch({uuid: "19455450-47b6-44a5-a4f6-6cc88881362a", success: done()});
      });

      it("A nested only model called XM.ReceivableApplication should be created in the billing extension", function () {
        assert.isDefined(applicationModel);
      });

      it("XM.ReceivableApplication extends XM.Model", function () {
        assert.isTrue(applicationModel instanceof XM.Model);
      });

      it.skip("XM.ReceivableApplication should include applications where the parent is both the target and the source", function () {
        // HINT: Create a view based on a union query to acheive the requirement above.
        assert.fail(true, true, "not implemented");
      });

      it("XM.ReceivableApplication has 'uuid' as its idAttribute", function () {
        assert.equal(applicationModel.idAttribute, "uuid");
      });

      it.skip("XM.ReceivableApplication should include the following attributes", function () {
        var attrs = ["uuid",
          "applicationType",
          "documentNumber",
          "applicationDate",
          "distributionDate",
          "amount",
          "currency"];

        _.each(attrs, function (attr) {
          it("XM.ReceivableApplication contains the " + attr + " attribute", function () {
            assert.include(applicationModel.getAttributeNames(), attr);
          });
        });
      });

      it.skip("XM.ReceivableApplications is read only", function () {
        assert.fail(true, true, "not implemented");
      });
    });

    describe("XM.ReceivableListItem", function () {
      var listModelCollection;

      before(function (done) {
        assert.isDefined(XM.ReceivableListItem);
        listModel = new XM.ReceivableListItem();
        listModel.fetch({uuid: "6087", success: done()});

        listModelCollection = new XM.ReceivableListItemCollection();
      });

      it("A model called XM.ReceivableListItem should exist in the billing extension", function () {
        assert.isDefined(listModel);
      });

      it("XM.ReceivableListItem extends XM.Model", function () {
        assert.isTrue(listModel instanceof XM.Model);
        assert.isTrue(listModel instanceof XM.Info); // need this in order to create a new workspace
      });

      it.skip("RecievableListItem should include all receivables, unposted invoices, and unposted returns", function () {
        // TODO: not sure how to test this yet
        assert.fail(true, true, "not implemented");
      });

      it("XM.ReceivableListItem should include the following attributes", function () {
        var attrs = ["uuid",
          "documentType",
          "documentNumber",
          "isPosted",
          "isOpen",
          "customer",
          "documentDate",
          "dueDate",
          "amount",
          "currency",
          "paid",
          "balance",
          "baseAmount",
          "basePaid",
          "notes"];

        _.each(attrs, function (attr) {
          it("XM.ReceivableListItem contains the " + attr + " attribute", function () {
            assert.include(XM.ReceivableListItem.getAttributeNames(), attr);
          });
        });
      });

      it("XM.ReceivableListItemCollection based on XM.Collection class should exist", function () {
        assert.isDefined(listModelCollection);
        assert.isTrue(listModelCollection instanceof XM.Collection);
      });

    });

    describe("XV.ReceivableList", function () {
      var listView;

      before(function () {
        assert.isDefined(XV.ReceivableList);
        listView = new XV.ReceivableList();
      });

      it("A List view that represents the XV.ReceivableListItem collection should exist in the billing extension", function () {
        assert.equal(listView.collection, "XM.ReceivableListItemCollection");
      });

      it("No attribute will be designated as the key", function () {
        assert.isUndefined(_.find(listView.$, function (item) { return item.isKey; }));
      });

      it.skip("Clicking the 'New' button for the recievable list should reveal multiple menu options including 'Credit Memo' and 'Debit Memo'", function () {
        assert.isDefined(listView.newActions);
        var actions = _.pluck(listView.newActions, "label");
        assert.include(actions, "Misc. Credit Memo");
        assert.include(actions, "Misc. Debit Memo");
      });

      it.skip("Selecting to create a new Credit Memo or Debit Memo will open the XM.Receivable workspace " +
        " with the appropriate document type preselected.", function () {

      });

      it.skip("The list should include headers", function () {});
      it.skip("The list should include a footer with a total amount in base currency", function () {});

      it.skip("The following action will be included on the list: " +
        "Open Receivable: Only enabled on posted receivables with privileges", function () {});

      it("The receivable list view will include the following parameter options:", function () {
        assert.isDefined(XV.ReceivableListParameters);
        var parameterWidget = new XV.ReceivableListParameters();
        assert.isDefined(parameterWidget);

        var params = [
          //"asOfDate",
          "number",
          "showUnposted",
          "showClosed",
          "showDebits",
          "showCredits",
          "customer",
          "customerType",
          // customer type pattern,
          "toDate",
          "fromDate",
          "toDocDate",
          "fromDocDate"
        ];
        _.each(params, function (param) {
          assert.isDefined(parameterWidget.$[param]);
        });
      });

      it.skip("The As Of parameter will only be enabled when unposted and closed are unchecked. Otherwise it will be set to the current date and disabled.", function () {});

      it.skip("When active the As Of parameter will limit query results to receivables where the As Of date is greater than or equal to the document date" +
       "and is less than or equal to the close date or where the close date is null", function () {
        //HINT: https://github.com/xtuple/xtuple/blob/master/lib/backbone-x/source/collection.js#L63
      });
    });

    it("XV.ReceivableWorkspace", function () {
      var receivableWorkspace;

      before(function () {
        assert.isDefined(XV.ReceivableWorkspace);
        receivableWorkspace = new XV.ReceivableWorkspace();
      });

      it.skip("A Workspace view that represents a XM.Receivable including viewing and editing of taxes should exist in the billing extension", function () {
        // attributes: ["documentDate", "customer", "dueDate",
        //   "terms", "salesRep", "documentType", "documentNumber", "orderNumber",
        //   "reasonCode", "amount", "currency", "paid", "notes", "taxes", "balance",
        //   "taxTotal", "commission"],
        // TODO: "applications"],
        //        _.each(attributes, function (param) {
        // assert.isDefined(receivableWorkspace.$[param]);
        //});
      });

      it.skip("The saveText property on the workspace for XM.Receivable will be 'Post' when " +
        " the status of the object is READY_NEW and 'Save' for any other status.", function () {
          assert.equal(receivableWorkspace.saveText, "_post".loc());
        });

      it("A Picker for selecting the DocumentType should exist in the workspace", function () {
        assert.isDefined(XV.ReceivableTypePicker);
      });

      it.skip("A XV.StickyCheckboxWidget should be visible when the model is in a READY_NEW state " +
        "that provides the option to 'Print on Post.'", function () {});

      it.skip("When 'Print on Post' is checked, a standard form should be printed when posting", function () {});

      it.skip("TaxTotal and taxes will be hidden when the receivable is an Invoice type", function () {});

      it.skip("There should be a printed report definition for the receivables list", function () {});
    });
  };

  exports.additionalTests = additionalTests;
}());

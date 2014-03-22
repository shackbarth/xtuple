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

  /**
    TODO: deferred to later sprint:
    - filter receivable list by customer group
    - When 'Print on Post' is checked, a standard form should be printed when posting
    - There should be a printed report definition for the receivables list
    - The list should include headers
    - The list should include a footer with a total amount in base currency
    - Add smoke testing for Workspace
  */

  var spec = {
    recordType: "XM.Receivable",
    skipSmoke: true,
    skipSave: true,
    skipDelete: true,
    skipUpdate: true,
    listKind: "XV.ReceivableListItem",
    collectionType: null,
    cacheName: null,
    enforceUpperKey: true,
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "uuid",
    documentKey: "documentNumber",
    attributes: ["uuid", "documentDate", "customer", "dueDate",
      "terms", "salesRep", "documentType", "documentNumber", "orderNumber",
      "reasonCode", "amount", "currency", "paid", "notes", "taxes", "balance",
      "taxTotal", "commission", "applications"],
    requiredAttributes: ["currency", "customer", "documentDate", "dueDate", "amount"],
    extensions: ["billing"],
    privileges: {
      createUpdateDelete: "EditAROpenItem",
      read: "ViewAROpenItems"
    },
    createHash: {
      uuid: "TestReceivableId" + Math.random(),
      customer: {number: "TTOYS"},
      documentDate: new Date(),
      dueDate: new Date(),
      amount: 100,
      currency: {abbreviation: "USD"},
      documentNumber: "DocumentNumber" + Math.random()
    },
    updatableField: "notes"
  };

  var additionalTests = function () {
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
            model.set("documentType", 'C');
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
            assert.equal(model.numberPolicy, XM.Document.AUTO_NUMBER);
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

          // this is a false negative :(
          it.skip("Validation: The amount must be greater than zero", function () {
            model.set("amount", 0);
            assert.equal(model.validate().code, "xt1013");
          });

          it.skip("Validation: The taxTotal may not be greater than the amount", function () {
            model.set("amount", 20);
            model.set("taxTotal", 30);
            assert.equal(model.validate().code, "xt2024");
          });

          it("When the status of a receivable changes to READY_CLEAN (edit), the following attributes: " +
          "customer, documentDate, documentType, documentNumber, terms should be readOnly", function () {
            model.setStatus(XM.Model.READY_NEW);
            // assert.notInclude(model.readOnlyAttributes, "customer");
            // assert.notInclude(model.readOnlyAttributes, "documentDate");
            // assert.notInclude(model.readOnlyAttributes, "documentType");
            // assert.notInclude(model.readOnlyAttributes, "documentNumber");
            // assert.notInclude(model.readOnlyAttributes, "terms");

            model.setStatus(XM.Model.READY_CLEAN);
            assert.include(model.readOnlyAttributes, "customer");
            assert.include(model.readOnlyAttributes, "documentDate");
            assert.include(model.readOnlyAttributes, "documentType");
            assert.include(model.readOnlyAttributes, "documentNumber");
            assert.include(model.readOnlyAttributes, "terms");
          });

          it("When customer is set, the terms, currency, and salesRep should be copied from the customer and commission should be recalculated", function (done) {
            // create customer to set
            var customerModel = new XM.SalesCustomer(),
              callback = function () {
                model.set("customer", customerModel);
                assert.equal(customerModel.get("terms", model.get("terms")));
                assert.equal(customerModel.get("currency", model.get("currency")));
                assert.equal(customerModel.get("salesRep", model.get("salesRep")));

                it("When the amount is changed, commission should be recalculated as customer.commission * amount",
                  function () {
                  model.set("amount", 100);
                  customerModel.set("commission", 4);
                  assert.equal(model.get("commission"), 400);
                });

                it("The 'ViewAROpenItems' and 'EditAROpenItem' privileges should be added to XM.SalesCustomer read privileges", function () {
                  var privs = customerModel.privileges.all;
                  assert.include(privs.create, "ViewAROpenItems");
                  assert.include(privs.create, "EditAROpenItem");
                });
                done();
              };
            customerModel.fetch({number: "TTOYS", success: callback()});
          });

          it.skip("The orderSequence is 'ARMemoNumber'", function () {
            //assert.equal(XM.Receivable.orderSequence, "ARMemoNumber");
          });
          it.skip("When the document date or terms is changed, the dueDate should be recalculated using the terms 'calculateDueDate' function", function () {});

          it.skip("When child tax records are added or removed, the taxTotal should be recalculated", function () {});

          it.skip("XM.Receivable should have an attribute 'taxTotal' which is the calculated sum of taxes", function () {
            assert.include(XM.ReceivableApplication.getAttributeNames(), "taxTotal");
          });

          it.skip("XM.Receivable object can not be created directly", function () {});
          it.skip("XM.Receivable object can not be deleted", function () {});
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
        assert.equal(_.difference(["uuid", "taxCode", "amount"],
            XM.ReceivableTax.getAttributeNames()).length, 0);
      });

      it("Extends XM.Model", function () {
        assert.isTrue(taxModel instanceof XM.Model);
      });

      it.skip("Can be created, but not updated or deleted", function () {
        assert.fail(true, true, "not implemented");
      });
    });

    describe.skip("XM.ReceivableApplication", function () {
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
        assert.equal(_.difference(attrs, XM.ReceivableApplication.getAttributeNames()).length, 0);
      });

      it.skip("XM.ReceivableApplications is read only", function () {
        assert.fail(true, true, "not implemented");
      });
    });

    describe.skip("XM.ReceivableListItem", function () {
      var listModelCollection;

      before(function (done) {
        assert.isDefined(XM.ReceivableListItem);
        listModel = new XM.ReceivableListItem();
        // XXX FIXME that's not a uuid
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

      it.skip("RecievableListItem should include all receivables, unposted invoices, and unposted returns", function () {});

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
        assert.equal(_.difference(attrs, XM.ReceivableListItem.getAttributeNames()).length, 0);
      });

      it("XM.ReceivableListItemCollection based on XM.Collection class should exist", function () {
        assert.isDefined(listModelCollection);
        assert.isTrue(listModelCollection instanceof XM.Collection);
      });

    });

    describe.skip("XV.ReceivableList", function () {
      var listView, parameterWidget;

      before(function () {
        assert.isDefined(XV.ReceivableList);
        listView = new XV.ReceivableList();

        assert.isDefined(XV.ReceivableListParameters);
        parameterWidget = new XV.ReceivableListParameters();
        assert.isDefined(parameterWidget);
      });

      it("A List view that represents the XV.ReceivableListItem collection should exist in the billing extension", function () {
        assert.equal(listView.collection, "XM.ReceivableListItemCollection");
      });

      it("No attribute will be designated as the key", function () {
        assert.isUndefined(_.find(listView.$, function (item) { return item.isKey; }));
      });

      it("Clicking the 'New' button for the recievable list should reveal multiple menu options including 'Credit Memo' and 'Debit Memo'", function () {
        assert.isDefined(listView.newActions);
        assert.equal(listView.newActions.length, 2);

        var actions = _.pluck(listView.newActions, "name");
        assert.include(actions, "creditMemo");
        assert.include(actions, "debitMemo");
      });

      it.skip("Selecting to create a new Credit Memo or Debit Memo will open the XM.Receivable workspace " +
        " with the appropriate document type preselected.", function () {
      });
      it.skip("The list should include headers", function () {});
      it.skip("The list should include a footer with a total amount in base currency", function () {});
      it.skip("The following action will be included on the list: " +
        "Open Receivable: Only enabled on posted receivables with privileges", function () {
          // open here means "edit"
      });

      it("The receivable list view will include the following parameter options:", function () {
        assert.equal(listView.getParameterWidget(), "XV.ReceivableListParameters");
        var params = [
          "asOfDate",
          "number",
          "showUnposted",
          //"showClosed",
          "showDebits",
          "showCredits",
          "customer",
          //"customerType",
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

      it.skip("The As Of parameter will only be enabled when unposted and closed are unchecked. " +
        "Otherwise it will be set to the current date and disabled.", function () {
          assert.isFalse(parameterWidget.$.asOfDate.$.input.getDisabled());

          parameterWidget.$.showClosed.setValue(true);
          assert.isTrue(parameterWidget.$.asOfDate.$.input.getDisabled());
          parameterWidget.$.showClosed.setValue(false);
          //assert.notOk(parameterWidget.$.asOfDate.$.input.getDisabled());

          parameterWidget.$.showUnposted.setValue(true);
          assert.isTrue(parameterWidget.$.asOfDate.$.input.getDisabled());
          parameterWidget.$.showUnposted.setValue(false);
          //assert.notOk(parameterWidget.$.asOfDate.$.input.getDisabled());
        });

      it.skip("When active the As Of parameter will limit query results to receivables where " +
        "the As Of date is greater than or equal to the document date" +
        "and is less than or equal to the close date or where the close date is null", function () {
      });
    });

    describe.skip("XV.ReceivableWorkspace", function () {
      var receivableWorkspace;

      before(function () {
        assert.isDefined(XV.ReceivableWorkspace);
        receivableWorkspace = new XV.ReceivableWorkspace();
      });

      it("A Workspace view that represents a XM.Receivable including viewing and editing of taxes " +
          " should exist in the billing extension", function () {
        assert.isDefined(receivableWorkspace);
        var attributes = [
          "documentDate",
          "customer",
          "dueDate",
          "terms",
          "salesRep",
          "documentType",
          "documentNumber",
          "orderNumber",
          "reasonCode",
          //"amount",
          //"currency",
          //"paid",
          "notes",
          "taxes",
          //"balance",
          //"taxTotal",
          "applications",
          //"commission"
        ];
        // TODO: this doesn't cover money widgets
        var attrs = _.pluck(receivableWorkspace.$, "attr");
        _.each(attributes, function (attr) {
          assert.include(attrs, attr);
        });
      });

      it.skip("The saveText property on the workspace for XM.Receivable will be 'Post' when " +
        " the status of the object is READY_NEW and 'Save' for any other status.", function () {
          //assert.equal(receivableWorkspace.saveText, "Save");
          //assert.equal(receivableWorkspace.saveText, "_post".loc());
      });

      it("A Picker for selecting the DocumentType should exist in the workspace", function () {
        assert.isDefined(XV.ReceivableTypePicker);
      });

      it.skip("TaxTotal and taxes will be hidden when the receivable is an Invoice type", function () {});

      it.skip("A XV.StickyCheckboxWidget should be visible when the model is in a READY_NEW state " +
        "that provides the option to 'Print on Post.'", function () {});

      it.skip("When 'Print on Post' is checked, a standard form should be printed when posting", function () {});

      it.skip("There should be a printed report definition for the receivables list", function () {
        assert.fail(true, true, "not implemented");
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());

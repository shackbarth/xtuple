/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, Globalize:true */

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountContactsBox",
    kind: "XV.ListRelationsBox",
    title: "_contacts".loc(),
    parentKey: "account",
    listRelations: "XV.ContactListRelations",
    searchList: "XV.ContactList"
  });

  // ..........................................................
  // CREDIT CARD
  //

  enyo.kind({
    name: "XV.CreditCardBox",
    kind: "XV.ListRelationsBox",
    title: "_creditCards".loc(),
    parentKey: "customer",
    listRelations: "XV.CreditCardListRelations",
    searchList: "XV.CreditCardList",
    events: {
      onPopupWorkspace: ""
    },
    handlers: {
      onValueChange: "selectionChanged"
    },
    create: function () {
      this.inherited(arguments);
      this.$.attachButton.hide();
      this.$.detachButton.hide();
      this.$.openButton.hide();
      this.createComponent({
        kind: "XV.InputWidget",
        name: "ccv",
        addBefore: this.$.buttonsPanel,
        label: "_ccv".loc(),
        showing: XT.session.settings.get("CCRequireCCV")
      });
      this.createComponent({
        kind: "XV.InputWidget",
        name: "creditCardAmount",
        addBefore: this.$.buttonsPanel,
        label: "_amount".loc()
      });
      this.$.buttonsPanel.createComponent({
        kind: "onyx.Button",
        name: "processButton",
        showing: false,
        ontap: "processCreditCard",
        classes: "onyx-affirmative",
        content: "_process".loc()
      }, {owner: this});
      this.$.buttonsPanel.createComponent({
        kind: "onyx.Button",
        name: "authorizeButton",
        showing: false,
        ontap: "processCreditCard",
        content: "_authorize".loc()
      }, {owner: this});

      // don't want to show inactive credit cards
      this.$.list.setSuppressInactive(true);
    },
    newItem: function (options) {
      options = options || {};
      var that = this,
        customer = that.parent.parent.getValue().getValue("customer"),
        creditCardCollection = customer.get("creditCards"),
        creditCardModel = new XM.CreditCard(),
        popupTheWorkspace = function () {
          that.doPopupWorkspace({
            message: "_enterNew".loc(),
            workspace: "XV.CreditCardsEditor",
            model: creditCardModel,
            callback: workspaceCallback
          });
        },
        // when we add a credit card we're really making the change
        // to customer. Sales Order don't care. Fetch customer so
        // we have a fresh and locked record we can save.
        customerFetched = function () {
          var effective,
            lockMessage;

          if (customer.getStatus() === XM.Model.READY_CLEAN) {
            customer.off('statusChange', customerFetched);
            if (!customer.hasLockKey()) {
              effective = Globalize.format(new Date(customer.lock.effective), "t");
              lockMessage = "_lockInfo".loc()
                .replace("{user}", customer.lock.username)
                .replace("{effective}", effective);

              that.doNotify({message: lockMessage});
              return;
            }
            creditCardModel.initialize(null, {isNew: true});
            creditCardCollection.add(creditCardModel);

            popupTheWorkspace();
          }
        },
        // save the customer when the user is finished with the popup
        workspaceCallback = function (model) {
          var validationError,
            errorMessage;

          if (model === false) {
            // the user has clicked to cancel, so get rid of the credit card model
            creditCardCollection.remove(creditCardModel);
          }
          customer.on('statusChange', releaseCustomerLock);
          validationError = customer.validate(customer.attributes);
          if (validationError) {
            errorMessage = validationError.message ? validationError.message() : "Error";
            that.doNotify({message: validationError.message(), type: XM.Model.CRITICAL});
            return;
          }
          customer.save();
        },
        releaseCustomerLock = function () {
          if (customer.getStatus() === XM.Model.READY_CLEAN) {
            customer.off('statusChange', releaseCustomerLock);
            customer.releaseLock();
            if (options.success) {
              options.success();
            }
          }
        };

      if (options.overrideData) {
        // stomp on the popping up if we already have data
        popupTheWorkspace = function () {
          creditCardModel.set(options.overrideData);
          workspaceCallback();
        };
      }

      customer.on('statusChange', customerFetched);
      customer.fetch();
    },
    /**
      If get get data from a magstripe to all the normal step to create
      a new credit card but stomp on the bit that opens a popup workspace
     */
    newItemWithData: function (data) {
      var that = this;

      this.newItem({
        overrideData: data,
        success: function () {
          that.$.list.getSelection().select(that.$.list.count - 1);
          if (that.$.ccv.showing) {
            that.$.ccv.focus();
          } else {
            that.$.creditCardAmount.focus();
          }
        }
      });
    },
    processCreditCard: function (inSender, inEvent) {
      var that = this,
        list = this.$.list,
        creditCard = list.getModel(list.getFirstSelected()),
        action = inEvent.originator.name.replace("Button", ""),
        amount = this.$.creditCardAmount.value,
        ccv = this.$.ccv.value,
        payload = {},
        success = function () {
          that.doNotify({message: "_transactionSuccessful".loc()});
        },
        error = function (error) {
          var message = error && error.message && error.message() ? error.message() : "_error".loc();
          that.doNotify({message: message});
        },
        process = function () {
          payload.creditCard = creditCard.id;
          payload.action = action;
          payload.amount = amount;
          payload.ccv = ccv;
          payload.orderNumber = that.parent.parent.getValue().id;
          payload.customerNumber = that.parent.parent.getValue().getValue("customer.id");
          that.$.authorizeButton.setShowing(false);
          that.$.processButton.setShowing(false);
          XT.dataSource.callRoute("credit-card", payload, {success: success, error: error});
        };

      if (creditCard && amount && (ccv || !XT.session.settings.get("CCRequireCCV"))) {
        this.doNotify({
          type: XM.Model.QUESTION,
          message: "_confirmAction".loc(),
          callback: function (response) {
            if (response.answer) {
              process();
            }
          }
        });
      }
    },
    /**
      Show the process button if the user has entered all the necessary inputs.
      Totally different than the original design.
    */
    selectionChanged: function (inSender, inEvent) {
      var list = this.$.list,
        creditCard = list.getModel(list.getFirstSelected()),
        ccv = this.$.ccv.value,
        amount = this.$.creditCardAmount.value;

      this.$.processButton.setShowing(creditCard && amount && (ccv || !XT.session.settings.get("CCRequireCCV")));
      this.$.authorizeButton.setShowing(creditCard && amount && (ccv || !XT.session.settings.get("CCRequireCCV")));
      return true;
    }
  });

  // ..........................................................
  // CUSTOMER GROUP CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerGroupCustomerBox",
    kind: "XV.ListGroupRelationsBox",
    title: "_customers".loc(),
    parentKey: "customerGroup",
    groupItemKey: "customer",
    searchList: "XV.CustomerList",
    listRelations: "XV.CustomerGroupCustomerListRelations"
  });

  // ..........................................................
  // CUSTOMER QUOTE
  //

  enyo.kind({
    name: "XV.CustomerQuoteListRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_quotes".loc(),
    parentKey: "customer",
    listRelations: "XV.CustomerQuoteListRelations"
  });

  // ..........................................................
  // CUSTOMER SALES ORDER
  //

  enyo.kind({
    name: "XV.CustomerSalesOrderListRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_salesOrders".loc(),
    parentKey: "customer",
    listRelations: "XV.CustomerSalesOrderListRelations" // not a bug
  });

  // ..........................................................
  // EMPLOYEE GROUP EMPLOYEE
  //

  enyo.kind({
    name: "XV.EmployeeGroupEmployeeBox",
    kind: "XV.ListGroupRelationsBox",
    title: "_employees".loc(),
    parentKey: "employeeGroup",
    groupItemKey: "employee",
    searchList: "XV.EmployeeList",
    listRelations: "XV.EmployeeGroupEmployeeListRelations"
  });

  // ..........................................................
  // EMPLOYEE GROUP GROUP
  //

  enyo.kind({
    name: "XV.EmployeeGroupGroupBox",
    kind: "XV.ListGroupRelationsBox",
    title: "_groups".loc(),
    parentKey: "employee",
    groupItemKey: "employeeGroup",
    searchList: "XV.EmployeeGroupList",
    listRelations: "XV.EmployeeGroupGroupListRelations"
  });

  // ..........................................................
  // INCIDENT HISTORY
  //

  enyo.kind({
    name: "XV.IncidentHistoryRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_history".loc(),
    listRelations: "XV.IncidentHistoryListRelations",
    canOpen: false
  });

  // ..........................................................
  // INVOICE ALLOCATIONS
  //

  enyo.kind({
    name: "XV.InvoiceAllocationsBox",
    kind: "XV.ListRelationsBox",
    parentKey: "invoice",
    title: "_allocations".loc(),
    listRelations: "XV.InvoiceAllocationListRelations"
  });

  // ..........................................................
  // INVOICE LINE TAX
  //

  enyo.kind({
    name: "XV.InvoiceLineTaxBox",
    kind: "XV.ListRelationsBox",
    title: "_taxes".loc(),
    listRelations: "XV.InvoiceLineTaxListRelations",
    canOpen: false
  });

  // ..........................................................
  // ITEM GROUP ITEM
  //

  enyo.kind({
    name: "XV.ItemGroupItemBox",
    kind: "XV.ListGroupRelationsBox",
    title: "_items".loc(),
    parentKey: "itemGroup",
    groupItemKey: "item",
    searchList: "XV.ItemList",
    listRelations: "XV.ItemGroupItemListRelations"
  });

  // ..........................................................
  // LOCATION ITEMS
  //

  enyo.kind({
    name: "XV.LocationItemRelationBox",
    kind: "XV.ListGroupRelationsBox",
    title: "_allowableItems".loc(),
    parentKey: "location",
    groupItemKey: "item",
    searchList: "XV.ItemList",
    listRelations: "XV.LocationItemListRelations"
  });

}());

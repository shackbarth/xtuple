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
    newItem: function () {
      var that = this,
        // TODO: parent.parent is hackish
        customer = that.parent.parent.getValue().getValue("customer"),
        creditCardCollection = customer.get("creditCards"),
        creditCardModel = new XM.CreditCard(),
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
            // XXX we could wait until this is done before popping up the workspace

            that.doPopupWorkspace({
              message: "_enterNew".loc(),
              workspace: "XV.CreditCardsEditor",
              model: creditCardModel,
              callback: workspaceCallback
            });
          }
        },
        // save the customer when the user is finished with the popup
        workspaceCallback = function (model) {
          if (model === false) {
            // the user has clicked to cancel, so get rid of the credit card model
            creditCardCollection.remove(creditCardModel);
          }
          customer.on('statusChange', releaseCustomerLock);
          customer.save();
        },
        releaseCustomerLock = function () {
          if (customer.getStatus() === XM.Model.READY_CLEAN) {
            customer.off('statusChange', releaseCustomerLock);
            customer.releaseLock();
          }
        };

      customer.on('statusChange', customerFetched);
      customer.fetch();
    },
    processCreditCard: function (inSender, inEvent) {
      var that = this,
        list = this.$.list,
        creditCard = list.getModel(list.getFirstSelected()),
        action = inEvent.originator.name.replace("Button", ""),
        amount = this.$.creditCardAmount.value,
        payload = {},
        success = function () {
          that.doNotify({message: "_success".loc()});
        },
        error = function () {
          that.doNotify({message: "_error".loc()});
        };

      // TODO: notify
      if (creditCard && amount) {
        payload.creditCard = creditCard.id;
        payload.action = action;
        payload.amount = amount;
        payload.orderNumber = this.parent.parent.getValue().id;
        payload.customerNumber = this.parent.parent.getValue().getValue("customer.id");
        this.$.authorizeButton.setShowing(false);
        this.$.processButton.setShowing(false);
        XT.dataSource.callRoute("credit-card", payload, {success: success, error: error});
      }
    },
    /**
      Show the process button if the user has entered all the necessary inputs.
      Totally different than the original design.
    */
    selectionChanged: function (inSender, inEvent) {
      var list = this.$.list,
        creditCard = list.getModel(list.getFirstSelected()),
        amount = this.$.creditCardAmount.value;

      this.$.processButton.setShowing(creditCard && amount);
      this.$.authorizeButton.setShowing(creditCard && amount);
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

  // ..........................................................
  // OPPORTUNITY QUOTE
  //

  enyo.kind({
    name: "XV.OpportunityQuoteListRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_quotes".loc(),
    parentKey: "opportunity",
    listRelations: "XV.OpportunityQuoteListRelations",
    searchList: "XV.QuoteList"
  });

  // ..........................................................
  // OPPORTUNITY SALES ORDER
  //

  enyo.kind({
    name: "XV.OpportunitySalesOrderListRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_salesOrders".loc(),
    parentKey: "opportunity",
    listRelations: "XV.OpportunityQuoteListRelations", // not a bug
    searchList: "XV.SalesOrderList"
  });

  // ..........................................................
  // PROSPECT QUOTE
  //

  enyo.kind({
    name: "XV.ProspectQuoteListRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_quotes".loc(),
    parentKey: "customer", // not a bug
    listRelations: "XV.CustomerQuoteListRelations" // not a bug
  });

}());

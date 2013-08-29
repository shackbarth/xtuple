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
    },
    newItem: function () {
      this.doNotify({message: "TODO: open popup workspace"});
    },
    processCreditCard: function (inSender, inEvent) {
      var that = this,
        list = this.$.list,
        creditCard = list.getModel(list.getFirstSelected()),
        amount = this.$.creditCardAmount.value,
        payload = {},
        success = function () {
          that.doNotify({message: "_success".loc()});
        },
        error = function () {
          that.doNotify({message: "_error".loc()});
        };

      if (creditCard && amount) {
        payload.creditCard = creditCard.id;
        payload.amount = amount;
        this.$.processButton.setShowing(false);
        XT.dataSource.callRoute("credit-card", payload, {success: success, error: error});
      }
    },
    /**
      Totally different than the original design
    */
    selectionChanged: function (inSender, inEvent) {
      var list = this.$.list,
        creditCard = list.getModel(list.getFirstSelected()),
        amount = this.$.creditCardAmount.value;

      this.$.processButton.setShowing(creditCard && amount);
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

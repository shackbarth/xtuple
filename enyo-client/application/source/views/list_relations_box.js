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
    listRelations: "XV.CustomerQuoteListRelations" // not a bug
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

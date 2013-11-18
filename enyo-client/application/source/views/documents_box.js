/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  enyo.kind({
    name: "XV.AccountDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "account"
  });

  enyo.kind({
    name: "XV.ContactDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "contact"
  });

  enyo.kind({
    name: "XV.CustomerDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "customer"
  });

  enyo.kind({
    name: "XV.IncidentDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "incident"
  });

  enyo.kind({
    name: "XV.InvoiceDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "invoice"
  });

  enyo.kind({
    name: "XV.ItemDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "item"
  });

  enyo.kind({
    name: "XV.OpportunityDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "opportunity"
  });

  enyo.kind({
    name: "XV.QuoteDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "quote"
  });

  enyo.kind({
    name: "XV.ToDoDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "toDo"
  });

  enyo.kind({
    name: "XV.SalesOrderDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "salesOrder"
  });

}());

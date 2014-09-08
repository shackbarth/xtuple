/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.SalesHistoryTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.SalesHistoryCollection",
    chartTitle: "_salesHistoryLast30Days".loc(),
    groupByOptions: [
      { name: "" },
      { name: "customer" },
      { name: "salesRep" }
    ],
    query: {
      parameters: [{
        attribute: "shipDate",
        operator: ">=",
        value: XT.date.applyTimezoneOffset(XV.DateWidget.prototype.textToDate("-30"), true)
      }]
    },
    dateField: "shipDate",
    totalField: "totalPrice"
  });

  enyo.kind({
    name: "XV.SalesOrderTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.SalesOrderListItemCollection",
    chartTitle: "_bookingsNext30Days".loc(),
    groupByOptions: [
      { name: "" },
      { name: "customer" },
      { name: "salesRep" }
    ],
    query: {
      parameters: [{
        attribute: "orderDate",
        operator: ">=",
        value: XT.date.applyTimezoneOffset(XV.DateWidget.prototype.textToDate("0"), true)
      }, {
        attribute: "orderDate",
        operator: "<=",
        value: XT.date.applyTimezoneOffset(XV.DateWidget.prototype.textToDate("+30"), true)
      }]
    },
    dateField: "orderDate",
    totalField: "total"
  });

  /*
  enyo.kind({
    name: "XV.QuoteTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.QuoteListItemCollection",
    chartTitle: "_quotes".loc(),
    groupByOptions: [
      { name: "" },
      { name: "customer" },
      { name: "salesRep" }
    ],
    dateField: "quoteDate",
    totalField: "total",
  });
  */

}());

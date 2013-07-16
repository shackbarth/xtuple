/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {


/*
unused and out of date. if we want to use this, add correct parameters to
filter options
  enyo.kind({
    name: "XV.SalesHistoryBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.SalesHistoryCollection",
    chartTitle: "_salesHistory".loc(),
    drillDownAttr: "orderNumber",
    drillDownRecordType: "XM.SalesOrderRelation",
    filterOptions: [
      { name: "today" },
      { name: "thisWeek" },
      { name: "thisMonth" },
      { name: "thisYear" },
      { name: "twoYears" },
      { name: "fiveYears" }
    ],
    groupByOptions: [
      { name: "customer" },
      { name: "salesRep" }
    ],
    totalField: "totalPrice",
    filterData: filterData
  });
*/

  enyo.kind({
    name: "XV.SalesHistoryTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.SalesHistoryCollection",
    chartTitle: "_salesHistory".loc(),
    groupByOptions: [
      { name: "" },
      { name: "customer" },
      { name: "salesRep" }
    ],
    dateField: "shipDate",
    totalField: "totalPrice"
  });

  enyo.kind({
    name: "XV.SalesOrderTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.SalesOrderListItemCollection",
    chartTitle: "_bookings".loc(),
    groupByOptions: [
      { name: "" },
      { name: "customer" },
      { name: "salesRep" }
    ],
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

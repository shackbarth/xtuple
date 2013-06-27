/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.SalesHistoryBarChart",
    kind: "XV.BarChart",
    collection: "XM.SalesHistoryCollection",
    chartTitle: "_salesHistory".loc(),
    filterOptions: [
      {content: "_today".loc(), name: "today"},
      {content: "_thisWeek".loc(), name: "thisWeek"},
      {content: "_thisMonth".loc(), name: "thisMonth"},
      {content: "_thisYear".loc(), name: "thisYear"}
    ],
    groupByOptions: [
      {content: "_customer".loc(), name: "customer" },
      {content: "_salesRep".loc(), name: "salesRep" }
    ]
  });

  enyo.kind({
    name: "XV.SalesDashboard",
    published: {
      label: "_dashboard".loc(),
    },
    components: [
      {kind: "XV.SalesHistoryBarChart" }
    ]
  });

}());

/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.SalesDashboard",
    kind: "XV.Dashboard",
    collection: "XM.UserChartCollection",
    // title is what show in the "add chart" picker on the
    // dashboard and the chart is the widget to be added
    // this tells the default query what extension to pull charts for
    extension: "sales",
    charts: [
      {title: "_salesHistory".loc(), chart: "XV.SalesHistoryTimeSeriesChart"},
      {title: "_bookings".loc(), chart: "XV.SalesOrderTimeSeriesChart"}
    ]
  });

}());

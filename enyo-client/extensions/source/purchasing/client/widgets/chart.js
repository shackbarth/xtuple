/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  XT.extensions.purchasing.initCharts = function () {

    enyo.kind({
      name: "XV.PurchaseOrderBarChart",
      kind: "XV.DrilldownBarChart",
      collection: "XM.PurchaseOrderListItemCollection",
      chartTitle: "_unclosedPurchaseOrders".loc(),
      groupByOptions: [
        { name: "status" },
        { name: "agent" },
        { name: "site" }
      ],
      // filter out closed p/o's
      query: {
        parameters: [{
          "attribute": "status",
          "operator": "!=",
          "value": "C"
        }]
      },
      totalField: "total"
    });
  };

}());



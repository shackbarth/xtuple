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
    drillDownAttr: "orderNumber",
    drillDownRecordType: "XM.SalesOrderRelation",
    filterOptions: [
      { name: "today" },
      { name: "thisWeek" },
      { name: "thisMonth" },
      { name: "thisYear" }
    ],
    groupByOptions: [
      { name: "customer" },
      { name: "salesRep" }
    ],
    totalField: "totalPrice",
    filterData: function (rawData) {
      var that = this;

      return _.filter(rawData, function (datum) {
        var shipDate = datum.shipDate.getTime(),
          now = new Date().getTime(),
          timespan = 0,
          oneDay = 1000 * 60 * 60 * 24;

        // XXX use YTD etc.?
        switch (that.getFilterField()) {
        case "today":
          timespan = oneDay;
          break;
        case "thisWeek":
          timespan = 7 * oneDay;
          break;
        case "thisMonth":
          timespan = 30 * oneDay;
          break;
        case "thisYear":
          timespan = 365 * oneDay;
          break;
        }
        return shipDate + timespan >= now;
      });
    }
  });

  enyo.kind({
    name: "XV.SalesDashboard",
    kind: "XV.Dashboard",
    components: [
      {kind: "XV.SalesHistoryBarChart" }
    ]
  });

}());

/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {


  enyo.kind({
    name: "XV.SalesDashboard",
    published: {
      collection: "XM.SalesHistoryCollection",
      data: null,
      value: null
    },
    create: function () {
      this.inherited(arguments);

      var that = this,
        collection = this.getCollection(),
        Klass = collection ? XT.getObjectByName(collection) : false;

      if (!Klass) {
        console.log("Error: cannot find collection", collection);
        return;
      }

      this.setValue(new Klass());
      this.getValue().fetch({
        success: function (collection, results) {
          that.setData(results);
        },
        error: function () {
          console.log("error", arguments);
        }
      });
    },
    dataChanged: function () {
      var div = this.hasNode();
      var exampleData = [{
        key: "Unit costs",
        values: _.map(this.getData().slice(0, 10), function (datum) {
          return {label: datum.orderNumber, value: datum.unitPrice};
        })
      }];

      nv.addGraph(function () {
        var chart = nv.models.discreteBarChart()
          .x(function (d) { return d.label; })
          .y(function (d) { return d.value; })
          .staggerLabels(true)
          .tooltips(false)
          .showValues(true);

        d3.select(div)
          .append("svg")
          .datum(exampleData)
          .transition().duration(500)
          .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      });
    }
  });

}());

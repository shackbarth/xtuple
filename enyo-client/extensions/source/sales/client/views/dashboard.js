/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {


  enyo.kind({
    name: "XV.SalesDashboard",
    published: {
      aggregatedData: null,
      collection: "XM.SalesHistoryCollection",
      rawData: null,
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
          that.setRawData(results);
        },
        error: function () {
          console.log("error", arguments);
        }
      });
    },
    aggregatedDataChanged: function () {
      var div = this.hasNode();
      var exampleData = [{
        key: "Sales",
        values: _.map(this.getAggregatedData(), function (datum) {
          return {label: datum.key, value: datum.total};
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
    },
    rawDataChanged: function () {
      // where would I be without underscore...
      var groupedData = _.toArray(_.groupBy(this.getRawData(), function (datum) {
        return datum.customer;
      }));
      var aggregatedData = _.map(groupedData, function (datum) {
        return _.reduce(datum, function (memo, row) {
          return {key: row.customer, total: memo.total + row.unitPrice * row.quantityShipped};
        }, {total: 0});
      });

      this.setAggregatedData(aggregatedData);
    }
  });

}());

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
      label: "_dashboard".loc(),
      groupByField: "",
      timeFrameField: "",
      rawData: null,
      value: null
    },
    components: [
      {name: "chart"},
      {kind: "enyo.FittableColumns", components: [
        {kind: "onyx.PickerDecorator", onSelect: "timeFrameSelected", components: [
          {content: "_timeFrame".loc()},
          {kind: "onyx.Picker", components: [
            {content: "_today".loc(), name: "today"},
            {content: "_thisWeek".loc(), name: "thisWeek"},
            {content: "_thisMonth".loc(), name: "thisMonth"},
            {content: "_thisYear".loc(), name: "thisYear"}
          ]}
        ]},
        {kind: "onyx.PickerDecorator", onSelect: "groupBySelected", components: [
          {content: "_groupBy".loc()},
          {kind: "onyx.Picker", components: [
            {content: "_customer".loc(), name: "customer"},
            {content: "_salesRep".loc(), name: "salesRep" }
          ]}
        ]}
      ]}
    ],
    aggregateData: function () {
      var that = this,
        filteredData, groupedData, aggregatedData;

      // where would I be without underscore...
      filteredData = _.filter(this.getRawData(), function (datum) {
        var shipDate = datum.shipDate.getTime(),
          now = new Date().getTime(),
          timespan = 0,
          oneDay = 1000 * 60 * 60 * 24;

        // XXX use YTD etc.?
        switch (that.getTimeFrameField()) {
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

      groupedData = _.toArray(_.groupBy(filteredData, function (datum) {
        return datum[that.getGroupByField()];
      }));

      aggregatedData = _.map(groupedData, function (datum) {
        return _.reduce(datum, function (memo, row) {
          return {key: row[that.getGroupByField()], total: memo.total + row.unitPrice * row.quantityShipped};
        }, {total: 0});
      });

      this.setAggregatedData(aggregatedData);
    },
    aggregatedDataChanged: function () {
      if (this.getAggregatedData() &&
          this.getTimeFrameField() &&
          this.getGroupByField()) {
        this.plot();
      }
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
        }
      });
    },
    groupByFieldChanged: function () {
      this.aggregateData();
    },
    groupBySelected: function (inSender, inEvent) {
      this.setGroupByField(inEvent.originator.name);
    },
    plot: function () {
      var div = this.$.chart.hasNode(),
        chartData = [{
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
          .datum(chartData)
          .transition().duration(500)
          .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      });

    },
    rawDataChanged: function () {
      this.aggregateData();
    },
    timeFrameFieldChanged: function () {
      this.aggregateData();
    },
    timeFrameSelected: function (inSender, inEvent) {
      this.setTimeFrameField(inEvent.originator.name);
    },
  });

}());

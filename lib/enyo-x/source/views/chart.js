/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {


  enyo.kind({
    name: "XV.BarChart",
    published: {
      aggregatedData: null,
      collection: "",
      groupByField: "",
      timeFrameField: "",
      rawData: null,
      value: null
    },
    events: {
      onSearch: "",
      onWorkspace: ""
    },
    style: "padding-left: 30px; padding-top: 30px; color: white;", // TODO: put in LESS
    /*
    components: [
      {content: "_salesHistory".loc(), style: "color: white; margin-left: 100px; " },
      {name: "chart", components: [
        {name: "svg", tag: "svg"} // this is the DOM element that d3 will take over
      ]},
      {kind: "enyo.FittableColumns", components: [
        {content: "_timeFrame".loc() + ": ", classes: "xv-picker-label",
          style: "color: white"},
        {kind: "onyx.PickerDecorator", onSelect: "timeFrameSelected",
            classes: "xv-input-decorator", components: [
          {content: "_timeFrame".loc()},
          {kind: "onyx.Picker", components: [
            {content: "_today".loc(), name: "today"},
            {content: "_thisWeek".loc(), name: "thisWeek"},
            {content: "_thisMonth".loc(), name: "thisMonth"},
            {content: "_thisYear".loc(), name: "thisYear", active: true}
          ]}
        ]},
        {content: "_groupBy".loc() + ": ", classes: "xv-picker-label",
          style: "color: white"},
        {kind: "onyx.PickerDecorator", onSelect: "groupBySelected", components: [
          {content: "_chooseOne".loc()},
          {kind: "onyx.Picker", components: [
            {content: "_customer".loc(), name: "customer" },
            {content: "_salesRep".loc(), name: "salesRep" }
          ]}
        ]}
      ]}
    ],
    */
    /**
      Take the raw data and aggregate it according to the speficiations
      dictated by the pickers.
     */
    aggregateData: function () {
      if (!this.getRawData() ||
          !this.getTimeFrameField() ||
          !this.getGroupByField()) {
        return;
      }
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
        if (!datum[that.getGroupByField()]) {
          return null;
        } else if (typeof datum[that.getGroupByField()] === 'object') {
          // TODO: generalize past customer for nested group-bys
          return datum[that.getGroupByField()].number;
        } else {
          return datum[that.getGroupByField()];
        }
      }));

      aggregatedData = _.map(groupedData, function (datum) {
        console.log(datum);
        var debug = _.reduce(datum, function (memo, row) {
          var key;

          if (!row[that.getGroupByField()]) {
            key = null;
          } else if (typeof row[that.getGroupByField()] === 'object') {
            // TODO: generalize past customer for nested group-bys
            key = row[that.getGroupByField()].number;
          } else {
            key = row[that.getGroupByField()];
          }
          return {
            key: memo.key || key,
            total: memo.total + row.unitPrice * row.quantityShipped
          };
        }, {total: 0});
        console.log(debug);
        return debug;
      });

      this.setAggregatedData(aggregatedData);
    },
    aggregatedDataChanged: function () {
      this.plot();
    },
    /**
      Kick off the fetch on the collection as soon as we start.
     */
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
    /**
      If the user clicks on a bar we open up the SalesHistory list with the appropriate
      filter. When the user clicks on an list item we drill down further into the sales
      order.
     */
    drillDown: function (field, key) {
      var that = this,
        params = [{
          name: field,
          value: key
        }],
        callback = function (value) {
          var orderNumber = value.get("orderNumber");
          if (orderNumber) {
            that.doWorkspace({workspace: "XV.SalesOrderWorkspace", id: orderNumber});
          }
          // TODO: do anything if the history has no order number?
        };

      this.doSearch({
        list: "XV.SalesHistoryList",
        searchText: "",
        callback: callback,
        parameterItemValues: params,
        conditions: [],
        query: null
      });
    },
    groupByFieldChanged: function () {
      this.aggregateData();
    },
    groupBySelected: function (inSender, inEvent) {
      this.setGroupByField(inEvent.originator.name);
    },
    /**
      Make the chart using v3 and nv.d3, working off our this.aggregatedData.
     */
    plot: function () {
      var that = this,
        div = this.$.svg.hasNode(),
        divHasChildren = div && div.children && div.children.length > 0,
        chartData = [{
          key: "Sales",
          values: _.map(this.getAggregatedData(), function (datum) {
            return {
              label: datum.key || "_none".loc(),
              value: datum.total
            };
          })
        }];

      //nv.addGraph(function () {
      var chart = nv.models.discreteBarChart()
        .x(function (d) { return d.label; })
        .y(function (d) { return d.value; })
        .valueFormat(d3.format(',.0f'))
        .staggerLabels(true)
        .tooltips(false)
        .showValues(true)
        .width(400);

      chart.yAxis
        .tickFormat(d3.format(',.0f'));
      chart.margin({left: 80});

      d3.select(div)
        .datum(chartData)
        .transition().duration(500)
        .call(chart);

      d3.selectAll(".nv-bar").on("click", function (bar, index) {
        that.drillDown(that.getGroupByField(), bar.label);
      });

        //nv.utils.windowResize(chart.update);
        //return chart;
      //});
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

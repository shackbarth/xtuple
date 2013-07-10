/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  /*
    Generic Grid Arranger with column width/height set
      for each tile
  */
  enyo.kind({
    name: "ChartsArranger",
    kind: "GridArranger",
    // These values determine how big of an area is allocated
    // for this tile. If this is smaller than the size of the
    // item, then the next tile will overlap.
    colHeight: "250",
    colWidth: "520"
  });

  /**
    Generic Panels with a Grid Arranger for showing several charts on
      a dashboard.
  */
  enyo.kind({
      name: "ChartsPanels",
      kind: "Panels",
      arrangerKind: "ChartsArranger",
      handlers: {
        onChartRemoved: "removeChart"
      },
      fit: true,
      wrap: true,
      classes: "charts-panels",
      panelCount: 0,
      /**
        Destroys the chart that has been removed
      */
      removeChart: function (inSender, inEvent) {
        var panel = inSender;
        if (panel) {
          panel.destroy();
        }
        this.reflow();
        this.render();
      }
    });

  /**
    Dashboard with menu for choosing charts to display
    in the arranger
  */
  enyo.kind({
    name: "XV.Dashboard",
    kind: "FittableRows",
    fit: true,
    published: {
      label: "_dashboard".loc(),
      value: null,
      collection: null,
      filterDescription: null,
      query: null,
      extension: null
    },
    classes: "dashboard",
    charts: [],
    components: [
      {kind: "onyx.Toolbar", components: [
        {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
          {content: "_addChart".loc(), kind: "onyx.Button", components: [
            {content: "_addChart".loc()},
            {tag: "span", classes: "icon-caret-down menu-icon"}
          ]},
          {kind: "onyx.Menu", name: "menu"}
        ]},
        // {kind: "onyx.Button", name: "applyButton", disabled: true,
        //   content: "_apply".loc(), onclick: "apply"},
        {kind: "onyx.Button", name: "saveButton",
          disabled: true, classes: "save",
          content: "_save".loc(), onclick: "saveAndClose"}
      ]},
      {name: "panels", kind: "ChartsPanels"}
    ],
    /**
      Add a chart to the Panels
    */
    addChart: function (kind) {
      var p = this.$.panels,
        component = {kind: kind, removeIconShowing: true},
        newPanel = p.createComponent(component),
        // keep track of how many panels
        i = this.$.panels.panelCount++;
      newPanel.render();
      p.reflow();
      p.render();
    },
    /**
      Set the value of the kind to the collection specified
      in the child kind.
     */
    collectionChanged: function () {
      var collection = this.getCollection(),
        Klass = collection ? XT.getObjectByName(collection) : false;

      if (Klass) {
        this.setValue(new Klass());
      } else {
        this.setValue(null);
      }
    },
    create: function () {
      this.inherited(arguments);
      this.collectionChanged();

      // fill add chart picker with available charts
      for (var i = 0; i < this.charts.length; i++) {
        var c = this.charts[i];
        this.$.menu.createComponent({content: c.title, chart: c.chart});
      }

      // set the default filters
      this.setQuery({
        parameters: [{
          attribute: "username",
          operator: "MATCHES",
          value: XT.session.details.username
        },
        {
          attribute: "extension",
          operator: "MATCHES",
          value: this.getExtension()
        }]
      });
    },
    /**
     Get the list of applicable charts from the database
      and load the panels with charts.
     */
    fetch: function (options) {
      var that = this,
        options = options ? _.clone(options) : {},
        query = this.getQuery();

      _.extend(options, {
        success: function (collection, results) {
          // for each itme in the results,
          // add a new chart to the panels
          _.each(results, function (item) {
            that.addChart(item.chartname);
          }, this);
        },
        query: query || {}
      }, that);

      this.getValue().fetch(options);
    },
    /**
      When a menu item is selected, calls addChart
    */
    itemSelected: function (inSender, inEvent) {
      if (inEvent.originator.content) {
        this.addChart(inEvent.originator.chart);
      }
    }
  });

  /**
    Generic implementation of customizable bar chart.
    You can pull in a filtered fetch on the
    backing collection for this chart. Then you can apply another arbitrary filter of your
    choice by means of a picker, and choose a group-by field. The kind will
    display a bar chart given the requirements. The "total" can be a count or
    a sum of a field of your choice. You can click on a bar to see a list of the
    items that comprise it, and drill down into an individual workspace from
    that list.

    Uses nvd3 for SVG rendering.
  */
  enyo.kind(
    /** @lends XV.SelectableChart */{
    name: "XV.SelectableChart",
    published: {
      // these published fields should not be overridden
      processedData: null,
      groupByField: undefined,
      filterField: "",
      value: null, // the backing collection
      removeIconShowing: false, // show "x" icon to remove chart

      // these ones can/should be overridden (although some have sensible defaults)
      chartTitle: "_chartTitle".loc(),
      collection: "", // {String} e.g. "XM.IncidentListItemCollection"
      drillDownRecordType: "",
      drillDownAttr: "",
      filterOptions: [], // these filters will be applied within the browser to the raw data from the fetch
      groupByOptions: [],
      query: { parameters: [] }, // if we want an initial filter on the collection fetch
      totalField: "" // what are we summing up in the bar chart (empty means just count)
    },
    classes: "selectable-chart",
    components: [
      {name: "chartTitleBar", classes: "chart-title-bar", components: [
        {name: "chartTitle", classes: "chart-title"},
        {kind: "onyx.IconButton", name: "removeIcon",
          src: "/assets/remove-icon.png", ontap: "chartRemoved",
          classes: "remove-icon", showing: false}
      ]},

      {name: "chartWrapper", classes: "chart-bottom", components: [
        {name: "chart", components: [
          {name: "svg", tag: "svg"} // this is the DOM element that d3 will take over
        ]},
        {kind: "enyo.FittableColumns", components: [
          {content: "_filterOn".loc() + ": ", classes: "xv-picker-label", name: "filterPickerLabel"},
          {kind: "onyx.PickerDecorator",
            name: "filterPickerDecorator",
            onSelect: "filterSelected",
            classes: "xv-input-decorator",
            components: [{content: "_chooseOne".loc()}, {kind: "onyx.Picker", name: "filterPicker"}]
          },
          {content: "_groupBy".loc() + ": ", classes: "xv-picker-label"},
          {kind: "onyx.PickerDecorator", onSelect: "groupBySelected", components: [
            {content: "_chooseOne".loc()},
            {kind: "onyx.Picker", name: "groupByPicker"}
          ]}
        ]}
      ]}
    ],
    events: {
      onChartRemoved: "",
      onSearch: "",
      onWorkspace: ""
    },
    /**
      Get the grouped data in the JSON format the chart wants. Up to the implementation.
     */
    aggregateData: function (groupedData) {
      return groupedData;
    },
    /**
      Remove this chart from it's parent (if applicable)
    */
    chartRemoved: function (inSender, inEvent) {
      this.doChartRemoved(inEvent);
    },
    /**
      Kick off the fetch on the collection as soon as we start.
     */
    create: function () {
      this.inherited(arguments);

      var that = this,
        collection = this.getCollection(),
        Klass = collection ? XT.getObjectByName(collection) : false;

      //
      // Show/Hide remove icon
      //
      this.$.removeIcon.setShowing(this.removeIconShowing);

      //
      // Set the chart title
      //
      this.$.chartTitle.setContent(this.getChartTitle());

      //
      // Make and fetch the collection
      //
      if (!Klass) {
        console.log("Error: cannot find collection", collection);
        return;
      }

      this.setValue(new Klass());
      this.getValue().fetch({
        query: this.getQuery(),
        success: function (collection, results) {
          //
          // Populate the filter picker
          //
          _.each(that.getFilterOptions(), function (item) {
            item.content = item.content || ("_" + item.name).loc(); // default content
            if (that.getFilterOptions().length === 1) {
              // if there's only one option, no need to show the picker
              that.$.filterPickerLabel.setShowing(false);
              that.$.filterPickerDecorator.setShowing(false);
              that.setFilterField(item.name);
            }
            that.$.filterPicker.createComponent(item);
          });
          // set the value with the saved value, if applicable

          //
          // Populate the groupBy picker
          //
          _.each(that.getGroupByOptions(), function (item) {
            item.content = item.content || ("_" + (item.name || "all")).loc(); // default content
            that.$.groupByPicker.createComponent(item);
          });
          // set the value with the saved value, if applicable

          //
          // Save the data results
          //
          that.processData();
        }
      });
    },
    /**
      It is up to the subkinds to implement whatever filter they see fit
      based on the backing collection and the choice of this.getFilterField().
    */
    filterData: function (data, callback) {
      callback(data);
    },
    filterFieldChanged: function () {
      this.processData();
    },
    filterSelected: function (inSender, inEvent) {
      this.setFilterField(inEvent.originator.name);
    },
    groupByFieldChanged: function () {
      this.processData();
    },
    groupBySelected: function (inSender, inEvent) {
      this.setGroupByField(inEvent.originator.name);
    },
    /**
      Make the chart using v3 and nv.d3, working off our this.processedData.
     */
    plot: function () {
      // up to the implementation
    },
    /**
      Take the raw data and process it according to the specifiations
      dictated by the pickers.
     */
    processData: function () {
      if (!this.getValue().length ||
          !this.getFilterField() ||
          this.getGroupByField() === undefined) {
        // not ready to aggregate
        return;
      }
      var that = this;

      // apply arbitrary filter as defined by subkind (async)
      this.filterData(this.getValue().models, function (filteredData) {
        var groupedData, aggregatedData;

        // Group on the selected group-by field. This gets tricky
        // if the field is a submodel.
        groupedData = _.groupBy(filteredData, function (datum) {
          if (!that.getGroupByField() || !datum.get(that.getGroupByField())) {
            return null;
          } else if (typeof datum.get(that.getGroupByField()) === 'object') {
            return datum.get(that.getGroupByField()).id;
          } else {
            return datum.get(that.getGroupByField());
          }
        });

        // data aggregation will be different for each implementation
        aggregatedData = that.aggregateData(groupedData);

        that.setProcessedData(aggregatedData);
      });
    },
    processedDataChanged: function () {
      this.plot();
    },
    /**
      After render, replot the charts.
    */
    rendered: function () {
      this.inherited(arguments);
      this.processData();
    }
  });

  enyo.kind({
    name: "XV.DrilldownBarChart",
    kind: "XV.SelectableChart",
    filterOptions: [
      { name: "all", parameters: [] }
    ],
    aggregateData: function (groupedData) {
      var that = this,
        aggregatedData = _.map(groupedData, function (datum, key) {
          var reduction = _.reduce(datum, function (memo, row) {
            // if the total field is not specified, we just count.
            var increment = that.getTotalField() ? row.get(that.getTotalField()) : 1;
            return {
              label: memo.label === 'null' ? "_none".loc() : memo.label || "_none".loc(),
              value: memo.value + increment
            };
          }, {label: key, value: 0});
          return reduction;
        });
      return [{values: aggregatedData}];
    },
    /**
      If the user clicks on a bar we open up the SalesHistory list with the appropriate
      filter. When the user clicks on an list item we drill down further into the sales
      order.
     */
    drillDown: function (field, key) {
      var that = this,
        recordType = this.getValue().model.prototype.recordType,
        listKind = XV.getList(recordType),
        params = [{
          name: field,
          value: key
        }],
        callback = function (value) {
          // unless explicitly specified, we assume that we want to drill down
          // into the same model that is fuelling the report
          var drillDownRecordType = that.getDrillDownRecordType() ||
              that.getValue().model.prototype.recordType,
            drillDownAttribute = that.getDrillDownAttr() ||
              XT.getObjectByName(drillDownRecordType).prototype.idAttribute,
            id = value.get(drillDownAttribute);

          if (id) {
            that.doWorkspace({workspace: XV.getWorkspace(drillDownRecordType), id: id});
          }
          // TODO: do anything if id is not present?
        };

      // TODO: the parameter widget sometimes has trouble finding our query requests
      this.doSearch({
        list: listKind,
        searchText: "",
        callback: callback,
        parameterItemValues: params,
        conditions: _.union(this.getQuery().parameters, this.getFilterOptionParameters()),
        query: null
      });
    },
    filterData: function (data, callback) {
      var that = this,
        doubleFilteredQuery = JSON.parse(JSON.stringify(this.getQuery())),
        optionParameters = this.getFilterOptionParameters();

      doubleFilteredQuery.parameters = _.union(doubleFilteredQuery.parameters, optionParameters);

      this.getValue().fetch({
        query: doubleFilteredQuery,
        success: function (collection, results) {
          callback(collection.models);
        },
        error: function () {
          console.log("error in double-filtered query", arguments);
        }
      });
    },
    getFilterOptionParameters: function () {
      var that = this,
        filterOption = _.find(this.getFilterOptions(), function (option) {
          return option.name === that.getFilterField();
        });

      return filterOption.parameters;
    },
    /**
      Make the chart using v3 and nv.d3, working off our this.processedData.
     */
    plot: function () {
      var that = this,
        div = this.$.svg.hasNode();

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
        .datum(this.getProcessedData())
        .transition().duration(500)
        .call(chart);

      d3.selectAll(".nv-bar").on("click", function (bar, index) {
        that.drillDown(that.getGroupByField(), bar.label);
      });

        //nv.utils.windowResize(chart.update);
        //return chart;
      //});
    }
  });

  enyo.kind({
    name: "XV.TimeSeriesChart",
    kind: "XV.SelectableChart",
    published: {
      dateField: ""
    },
    filterOptions: [
      { name: "thisWeek" },
      { name: "thisMonth" },
      { name: "thisYear" },
      { name: "twoYears" },
      { name: "fiveYears" }
    ],
    /**
      This looks really complicated! I'm just binning the
      data into a histogram.
     */
    aggregateData: function (groupedData) {
      var that = this,
        now = new Date().getTime(),
        earliestDate = now, // won't be now for long
        dataPoints = _.reduce(groupedData, function (memo, group) {
          _.each(group, function (item) {
            var dateInt = item.get(that.getDateField()).getTime();
            earliestDate = Math.min(earliestDate, dateInt);
          });
          return memo + group.length;
        }, 0),
        binCount = Math.ceil(Math.sqrt(dataPoints)),
        binWidth = Math.ceil((now - earliestDate) / binCount),
        histoGroup = _.map(groupedData, function (group, groupKey) {
          var binnedData, summedData, hole, findHole, foundData;

          binnedData = _.groupBy(group, function (item) {
            var binNumber = Math.floor((item.get(that.getDateField()).getTime() - earliestDate) / binWidth);
            // we actually want to return the timestamp at the start of the bin, for later use
            return (binNumber * binWidth) + earliestDate;
          });
          summedData = _.map(binnedData, function (bin, binKey) {
            var binTotal = _.reduce(bin, function (memo, value, key) {
              return memo + value.get(that.getTotalField());
            }, 0);
            return {x: binKey, y: binTotal};
          });
          // plug in zeros for missing data. Necessary for nvd3 stacking.
          findHole = function (datum) {
            return datum.x === String(hole);
          };
          for (hole = earliestDate; hole <= now; hole += binWidth) {
            foundData = _.find(summedData, findHole);
            if (!foundData) {
              summedData.push({x: String(hole), y: 0});
            }
          }
          summedData = _.sortBy(summedData, function (data) {
            return data.x;
          });
          groupKey = groupKey === 'null' ? "_none".loc() : groupKey || "_none".loc();
          return {key: groupKey, values: summedData};
        });

      return histoGroup;
    },
    filterData: function (data, callback) {
      var that = this;

      callback(_.filter(data, function (datum) {
        var shipDate = datum.get(that.getDateField()).getTime(),
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
        case "twoYears":
          timespan = 2 * 365 * oneDay;
          break;
        case "fiveYears":
          timespan = 5 * 365 * oneDay;
          break;
        }
        return shipDate + timespan >= now;
      }));
    },
    /**
      Make the chart using v3 and nv.d3, working off our this.processedData.
     */
    plot: function () {
      var that = this,
        div = this.$.svg.hasNode();

      var chart = nv.models.multiBarChart()
        .stacked(true);

      chart.xAxis
        .tickFormat(function (d) { return d3.time.format('%b %d %y')(new Date(Number(d))); });

      chart.yAxis
        .tickFormat(d3.format(',.0f'));
      chart.margin({left: 80});

      d3.select(div)
        .datum(this.getProcessedData())
        .transition().duration(500)
        .call(chart);
    },
  });

  // This one ended up not looking good for sales history, but it might
  // be useful somewhere else
  /*
  enyo.kind({
    name: "XV.TimeSeriesLineChart",
    kind: "XV.SelectableChart",
    published: {
      dateField: ""
    },
    aggregateData: function (groupedData) {
      var that = this;

      return _.map(groupedData, function (group, key) {
        var groupValues = _.map(group, function (modelData) {
          return {
            x: modelData.get(that.getDateField()).getTime(),
            y: modelData.get(that.getTotalField())
          };
        });

        return {
          key: key,
          values: groupValues
        };
      });
    },
    plot: function () {
      var that = this,
        div = this.$.svg.hasNode();

      var chart = nv.models.lineChart();
      chart.xAxis
        .tickFormat(function (d) { return d3.time.format('%b %d %y')(new Date(d)); });

      d3.select(div)
        .datum(this.getProcessedData())
        .transition().duration(500)
        .call(chart);
    },
  });
  */
}());

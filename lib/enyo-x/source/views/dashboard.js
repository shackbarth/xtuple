/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.Dashboard",
    published: {
      label: "_dashboard".loc(),
    }
  });

  /**
    Generic implementation of customizable bar chart.
    You can pull in a filtered fetch of a collection of your choice into the
    raw data for this chart. Then you can apply another arbitrary filter of your
    choice by means of a picker, and choose a group-by field. The kind will
    display a bar chart given the requirements. The "total" can be a count or
    a sum of a field of your choice. You can click on a bar to see a list of the
    items that comprise it, and drill down into an individual workspace from
    that list.

    Uses nvd3 for SVG rendering.
  */
  enyo.kind(
    /** @lends XV.BarChart */{
    name: "XV.BarChart",
    published: {
      // these published fields should not be overridden
      aggregatedData: null,
      groupByField: "",
      filterField: "",
      rawData: null,
      value: null,

      // these ones can/should be overridden (although some have sensible defaults)
      chartTitle: "_chartTitle".loc(),
      collection: "", // {String} e.g. "XM.IncidentListItemCollection"
      drillDownRecordType: "",
      drillDownAttr: "",
      filterOptions: [], // these filters will be applied within the browser to the raw data from the fetch
      groupByOptions: [],
      query: {}, // if we want an initial filter on the collection fetch
      totalField: "" // what are we summing up in the bar chart (empty means just count)
    },
    components: [
      {name: "chartTitle", style: "color: white; margin-left: 100px; " },
      {name: "chart", components: [
        {name: "svg", tag: "svg"} // this is the DOM element that d3 will take over
      ]},
      {kind: "enyo.FittableColumns", components: [
        {content: "_filterOn".loc() + ": ", classes: "xv-picker-label",
          style: "color: white"},
        {kind: "onyx.PickerDecorator", onSelect: "filterSelected",
            classes: "xv-input-decorator", components: [
          {content: "_chooseOne".loc()},
          {kind: "onyx.Picker", name: "filterPicker" }
        ]},
        {content: "_groupBy".loc() + ": ", classes: "xv-picker-label",
          style: "color: white"},
        {kind: "onyx.PickerDecorator", onSelect: "groupBySelected", components: [
          {content: "_chooseOne".loc()},
          {kind: "onyx.Picker", name: "groupByPicker" }
        ]}
      ]}
    ],
    events: {
      onSearch: "",
      onWorkspace: ""
    },
    style: "padding-left: 30px; padding-top: 30px; color: white;", // TODO: put in LESS
    /**
      Take the raw data and aggregate it according to the speficiations
      dictated by the pickers.
     */
    aggregateData: function () {
      if (!this.getRawData() ||
          !this.getFilterField() ||
          !this.getGroupByField()) {
        // not ready to aggregate
        return;
      }
      var that = this,
        filteredData, groupedData, aggregatedData;

      // apply arbitrary filter as defined by subkind
      filteredData = this.filterData(this.getRawData());

      // Group on the selected group-by field. This gets tricky
      // if the field is a submodel.
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

      // groupedData is really just an intermediate step to our
      // goal, which is aggregatedData.
      aggregatedData = _.map(groupedData, function (datum) {
        var debug = _.reduce(datum, function (memo, row) {
          var key,
            increment;

          if (!row[that.getGroupByField()]) {
            key = null;
          } else if (typeof row[that.getGroupByField()] === 'object') {
            // TODO: generalize past customer for nested group-bys
            key = row[that.getGroupByField()].number;
          } else {
            key = row[that.getGroupByField()];
          }
          // if the total field is not specified, we just count.
          increment = that.getTotalField() ? row[that.getTotalField()] : 1;
          return {
            key: memo.key || key,
            total: memo.total + increment
          };
        }, {total: 0});
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
            that.$.filterPicker.createComponent(item);
          });

          //
          // Populate the groupBy picker
          //
          _.each(that.getGroupByOptions(), function (item) {
            item.content = item.content || ("_" + item.name).loc(); // default content
            that.$.groupByPicker.createComponent(item);
          });

          //
          // Save the data results
          //
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

      if (this.getQuery().parameters) {
        // apply the query filter(s) to the search list
        params = _.union(params, this.getQuery().parameters);
      }

      // TODO: the search list will be filtered by the group-by selection
      // and the query filter, but it needs to be also filtered by the filter selection

      // TODO: the parameter widget sometimes has trouble finding our query requests
      this.doSearch({
        list: listKind,
        searchText: "",
        callback: callback,
        parameterItemValues: params,
        conditions: [],
        query: null
      });
    },
    /**
      It is up to the subkinds to implement whatever filter they see fit
      based on the rawData and the choice of this.getFilterField().
    */
    filterData: function (rawData) {
      return rawData;
    },
    filterFieldChanged: function () {
      this.aggregateData();
    },
    filterSelected: function (inSender, inEvent) {
      this.setFilterField(inEvent.originator.name);
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
        chartData = [{
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
  });

}());

/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true */

(function () {


  enyo.kind({
    name: "XV.SalesDashboard",
    content: "goo",
    plot: function () {
      var exampleData = function () {
        return  [{
          key: "Cumulative Return",
          values: [
            {
              "label" : "CDS / Options",
              "value" : -29.765957771107
            },
            {
              "label" : "Cash",
              "value" : 0
            },
            {
              "label" : "Corporate Bonds",
              "value" : 32.807804682612
            },
            {
              "label" : "Equity",
              "value" : 196.45946739256
            },
            {
              "label" : "Index Futures",
              "value" : 0.19434030906893
            },
            {
              "label" : "Options",
              "value" : -98.079782601442
            },
            {
              "label" : "Preferred",
              "value" : -13.925743130903
            },
            {
              "label" : "Not Available",
              "value" : -5.1387322875705
            }
          ]
        }];
      };
      var div = this.hasNode();

      console.log("div is", div);

      nv.addGraph(function () {
        var chart = nv.models.discreteBarChart()
          .x(function (d) { return d.label; })
          .y(function (d) { return d.value; })
          .staggerLabels(true)
          .tooltips(false)
          .showValues(true);

        d3.select(div)
          .datum(exampleData())
          .transition().duration(500)
          .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      });

    }
    /*
    kind: "XV.List",
    label: "_salesHistory".loc(),
    collection: "XM.SalesHistoryCollection",
    query: {orderBy: [
      {attribute: 'id'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "id", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "shipDate"}
          ]}
        ]}
      ]}
    ]*/
  });

}());

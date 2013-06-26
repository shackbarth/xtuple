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

nv.addGraph(function () {
   var chart = nv.models.lineChart();

   chart.xAxis
       .axisLabel('Time (ms)')
       .tickFormat(d3.format(',r'));

   chart.yAxis
       .axisLabel('Voltage (v)')
       .tickFormat(d3.format('.02f'));

   d3.select(div)
        .append("svg")
       .datum(sinAndCos())
     .transition().duration(500)
       .call(chart);

   nv.utils.windowResize(function () { d3.select(div).call(chart) });

   return chart;
 });




 /**************************************
  * Simple test data generator
  */


 function sinAndCos() {
   var sin = [],
       cos = [];

   for (var i = 0; i < 100; i++) {
     sin.push({x: i, y: Math.sin(i/10)});
     cos.push({x: i, y: .5 * Math.cos(i/10)});
   }

   return [
     {
       values: sin,
       key: 'Sine Wave',
       color: '#ff7f0e'
     },
     {
       values: cos,
       key: 'Cosine Wave',
       color: '#2ca02c'
     }
   ];
 }
      /*
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

      var sampleSVG = d3.select(div)
        .append("svg")
        .attr("width", 100)
        .attr("height", 100);

      sampleSVG.append("circle")
        .style("stroke", "gray")
        .style("fill", "white")
        .attr("r", 40)
        .attr("cx", 50)
        .attr("cy", 50)
        .on("mouseover", function () {
          d3.select(this).style("fill", "aliceblue");
        })
        .on("mouseout", function () {
          d3.select(this).style("fill", "white");
        });

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
      */
    }
  });

}());

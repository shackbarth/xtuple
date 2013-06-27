/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.SalesHistoryBarChart",
    kind: "XV.BarChart",
    published: {
      collection: "XM.SalesHistoryCollection"
    },
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
            {content: "_thisYear".loc(), name: "thisYear"}
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
    ]
  });

  enyo.kind({
    name: "XV.SalesDashboard",
    published: {
      label: "_dashboard".loc(),
    },
    components: [
      {kind: "XV.SalesHistoryBarChart" }
    ]
  });

}());

/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.ProjectBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.ProjectListItemCollection",
    chartTitle: "_projects".loc(),
    groupByOptions: [
      { name: "projectStatus", content: "_status".loc() },
      { name: "projectType", content: "_type".loc() },
      { name: "owner" },
      { name: "assignedTo" }
    ]
  });
}());

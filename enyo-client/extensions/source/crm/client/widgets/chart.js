/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.OpenIncidentBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.IncidentListItemCollection",
    chartTitle: "_openIncidents".loc(),
    filterOptions: [
      { name: "all", parameters: [] },
      { name: "highPriority", parameters: [
        { attribute: "priorityOrder", operator: "<", value: 2 } // XXX magical 2
      ]}
    ],
    groupByOptions: [
      { name: "assignedTo" },
      { name: "category" },
      { name: "priority" },
      { name: "project" }
    ],
    // suppress closed incidents
    query: {
      parameters: [{
        attribute: "status",
        operator: "!=",
        value: "L"
      }],
    }
  });

  enyo.kind({
    name: "XV.OpportunityBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.OpportunityListItemCollection",
    chartTitle: "_opportunities".loc(),
    groupByOptions: [
      { name: "opportunityStage", content: "_stage".loc() },
      { name: "opportunitySource", content: "_source".loc() },
      { name: "opportunityType", content: "_type".loc() },
      { name: "owner" },
      { name: "assignedTo" },
      { name: "priority" }
    ],
    totalField: "amount"
  });
}());

/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {
  
  // ..........................................................
  // ACCOUNT
  //
  
  enyo.kind({
    name: "XV.AccountOpportunityListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: 'priorityOrder'},
      {attribute: 'targetClose'},
      {attribute: 'name'},
      {attribute: 'id'}
    ],
    parentKey: "account",
    workspace: "XV.OpportunityWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "targetClose", fit: true,
                formatter: "formatTargetClose",
                placeholder: "_noCloseTarget".loc(),
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "name"}
          ]}
        ]}
      ]}
    ],
    formatTargetClose: XV.OpportunityList.prototype.formatTargetClose
  });

}());

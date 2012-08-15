/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
  enyo.kind({
    name: "XV.UserAccountWorkspaceBox",
    kind: "XV.RepeaterBox",
    published: {
      recordType: "XM.privileges",
      columns: [
        {kind: "XV.Input", name: "grantedPrivileges.name" },
      ]
    }



    //kind: "XV.WorkspaceBox",
    //components: [
    //  {kind: "onyx.GroupboxHeader", content: "_crm".loc()},
    //  {kind: "List", fit: true, count: 10, onSetupItem: "setupItem", components: [
    //    {kind: "XV.CheckboxWidget", name: "isActive"}
    //  ]}
    //],
    //setupItem: function (inSender, inEvent) {
    //  var index = inEvent.index;
    //}
  });
}());

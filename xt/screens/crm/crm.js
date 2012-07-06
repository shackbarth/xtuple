/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true*/
/*global XT:true, enyo:true*/

(function () {
  "use strict";

  enyo.kind({
    name: "XT.Crm",
    kind: "XT.ModuleScreen",
    menuItems: [{
      name: "accounts",
      label: "_accounts".loc(),
      collectionType: "XM.AccountInfoCollection",
      listType: "XT.AccountInfoList",
      query: { orderBy: '"number"' }
    }, {
      name: "contacts",
      label: "_contacts".loc(),
      collectionType: "XM.ContactInfoCollection",
      listType: "XT.ContactInfoList",
      query: { orderBy: '"lastName", "firstName"' }
    }, {
      name: "opportunities",
      label: "_opportunities".loc(),
      collectionType: "XM.OpportunityInfoCollection",
      listType: "XT.OpportunityInfoList"
    }, {
      name: "incidents",
      label: "_incidents".loc(),
      collectionType: "XM.IncidentInfoCollection",
      listType: "XT.IncidentInfoList"
    }, {
      name: "projects",
      label: "_projects".loc(),
      collectionType: "XM.ProjectInfoCollection",
      listType: "XT.ProjectInfoList",
      query: { orderBy: '"number"' }
    }],
    firstTime: true,
    didBecomeActive: function () {
      if (this.firstTime) {
        this.selectSubModule("accounts");
        this.firstTime = false;
      }
    }
  });

}());
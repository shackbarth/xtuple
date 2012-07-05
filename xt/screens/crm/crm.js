/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true*/
/*global XT:true, enyo:true*/

(function () {
  "use strict";

  enyo.kind({
    name: "XT.Crm",
    kind: "XT.ModuleScreen",
    menuItems: [{
      name: "contacts",
      label: "Contacts".loc(),
      collectionType: "XM.ContactInfoCollection",
      listType: "XT.ContactInfoList",
      query: { orderBy: '"lastName", "firstName"' }
    }, {
      name: "opportunities",
      label: "Opportunities".loc(),
      collectionType: "XM.OpportunityInfoCollection",
      listType: "XT.OpportunityInfoList"
    }, {
      name: "incidents",
      label: "Incidents".loc(),
      collectionType: "XM.IncidentInfoCollection",
      listType: "XT.IncidentInfoList"
    }, {
      name: "projects",
      label: "Projects".loc(),
      collectionType: "XM.ProjectInfoCollection",
      listType: "XT.ProjectInfoList"
    }],
    firstTime: true,
    didBecomeActive: function () {
      if (this.firstTime) {
        this.selectSubModule("contacts");
        this.firstTime = false;
      }
    }
  });

}());
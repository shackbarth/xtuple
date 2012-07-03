/*jslint indent:2 */
/*global XT:true, enyo:true*/

(function () {
  "use strict";
  
  enyo.kind({
    name: "XT.Crm",
    kind: "XT.ModuleScreen",
    menuItems: [{
      name: "incidents",
      label: "Incidents"
    }, {
      name: "contacts",
      label: "Contacts",
      collectionType: "XM.ContactInfoCollection",
      listType: "XT.ContactInfoList",
      query: { rowLimit: 30 }
    }, {
      name: "projects",
      label: "Projects",
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

enyo.kind({
  name: "XT.Crm",
  kind: "XT.ModuleScreen",
  menuItems: [
    { name: "incidents", label: "Incidents" },
    { name: "contacts", label: "Contacts", collectionType: "XM.ContactInfoCollection",
      listType: "XT.ContactInfoList", query: { rowLimit: 100 } },
    { name: "projects", label: "Projects", collectionType: "XM.ProjectInfoCollection", 
      listType: "XT.ProjectInfoList" }
  ],
  didBecomeActive: function() {
    this.selectSubModule("contacts");
  }
});
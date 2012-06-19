
enyo.kind({
  name: "XT.Crm",
  kind: "XT.ModuleScreen",
  menuItems: [
    { name: "incidents", label: "Incidents" },
    { name: "contacts", label: "Contacts" },
    { name: "projects", label: "Projects", collectionType: "XM.ProjectInfoCollection", 
      listType: "XT.ProjectInfoList" }
  ],
  didBecomeActive: function() {
    this.selectSubModule("projects");
  }
});
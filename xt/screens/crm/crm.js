
enyo.kind({
  name: "XT.Crm",
  kind: "XT.ModuleScreen",
  menuItems: [
    { name: "incidents", label: "Incidents" },
    { name: "contacts", label: "Contacts", collectionType: "XM.ContactInfoCollection",
      listType: "XT.ContactInfoList", query: { rowLimit: 30 } },
    { name: "projects", label: "Projects", collectionType: "XM.ProjectInfoCollection", 
      listType: "XT.ProjectInfoList" }
  ],
  didBecomeActive: function() {
    if (!this._firstTime) {
      this.selectSubModule("contacts");
      this._firstTime = true;
    }
  }
});
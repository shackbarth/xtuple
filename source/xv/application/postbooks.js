
enyo.kind({
  name: "XV.Postbooks",
  kind: "Panels",
  arrangerKind: "CardArranger",
  draggable: false,
  classes: "xt-postbooks enyo-unselectable",
  handlers: {
    onPrevious: "previous",
    onSearch: "search",
    onWorkspace: "addWorkspacePanel"
  },
  components: [
    {name: "startup", classes: "xv-startup-panel", style: "background: #333;",
      components: [
      {classes: "xv-startup-divider", content: "Loading application data..."},
      {name: "startupProgressBar", kind: "onyx.ProgressBar",
        classes: "xv-startup-progress", progress: 0}
    ]},
    {name: "navigator", kind: "XV.Navigator", modules: [
      {name: "welcome", label: "_welcome".loc(), hasSubmenu: false, 
        panels: [
        {name: "welcomePage", content: "Welcome"
          //tag: '<iframe src="http://www.xtuple.com/beta"></iframe>'
          }
      ]},
      {name: "crm", label: "_crm".loc(), panels: [
        {name: "accountList", kind: "XV.AccountList"},
        {name: "contactList", kind: "XV.ContactList"},
        {name: "toDoList", kind: "XV.ToDoList"},
        {name: "opportunityList", kind: "XV.OpportunityList"},
        {name: "incidentList", kind: "XV.IncidentList"},
        {name: "projectList", kind: "XV.ProjectList"}
      ]},
      {name: "setup", label: "_setup".loc(), panels: [
        {name: "userAccountList", kind: "XV.UserAccountList"},
        {name: "userAccountRoleList", kind: "XV.UserAccountRoleList"},
        {name: "stateList", kind: "XV.StateList"},
        {name: "countryList", kind: "XV.CountryList"},
        {name: "priorityList", kind: "XV.PriorityList"},
        {name: "honorificList", kind: "XV.HonorificList"},
        {name: "incidentCategoryList", kind: "XV.IncidentCategoryList"},
        {name: "incidentResoulutionList", kind: "XV.IncidentResolutionList"},
        {name: "incidentSeverityList", kind: "XV.IncidentSeverityList"},
        {name: "opportunitySourceList", kind: "XV.OpportunitySourceList"},
        {name: "opportunityStageList", kind: "XV.OpportunityStageList"},
        {name: "opportunityTypeList", kind: "XV.OpportunityTypeList"}
      ]}
    ]}
  ],
  addWorkspacePanel: function (inSender, inEvent) {
    var panel;
    if (inEvent.workspace) {
      panel = this.createComponent({kind: "XV.WorkspaceContainer"});
      panel.render();
      this.reflow();
      panel.setWorkspace(inEvent.workspace, inEvent.id, inEvent.callback);
      this.next();
    }
  },
  getNavigator: function () {
    return this.$.navigator;
  },
  getStartupProgressBar: function () {
    return this.$.startupProgressBar;
  },
  previous: function () {
    // Stock implementation is screwy, do our own
    var last = this.getActive(),
      previous = this.getPanels().length - 1;
    this.setIndex(previous);
    last.destroy();
  },
  search: function (inSender, inEvent) {
    var panel;
    if (inEvent.list) {
      panel = this.createComponent({kind: "XV.SearchContainer"});
      panel.render();
      this.reflow();
      //panel.setList(inEvent.workspace, inEvent.id, inEvent.callback);
      this.next();    
    }
  }

});

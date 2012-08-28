/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.Postbooks",
    kind: "Panels",
    arrangerKind: "CardArranger",
    draggable: false,
    classes: "xt-postbooks enyo-unselectable",
    handlers: {
      onPrevious: "previous",
      onSearch: "addSearch",
      onWorkspace: "addWorkspacePanel"
    },
    published: {
      modules: [
        {name: "welcome", label: "_welcome".loc(), hasSubmenu: false,
          panels: [
          {name: "welcomePage", content: "Welcome"
            //tag: '<iframe src="http://www.xtuple.com/beta"></iframe>'
            }
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
      ]
    },
    components: [
      {name: "startup", classes: "xv-startup-panel", style: "background: #333;",
        components: [
        {classes: "xv-startup-divider", content: "Loading application data..."},
        {name: "startupProgressBar", kind: "onyx.ProgressBar",
          classes: "xv-startup-progress", progress: 0}
      ]},
      {name: "navigator", kind: "XV.Navigator"}
    ],
    addSearch: function (inSender, inEvent) {
      var panel;
      if (inEvent.list) {
        panel = this.createComponent({kind: "XV.SearchContainer"});
        panel.render();
        this.reflow();
        panel.setList(inEvent.list);
        panel.setSearchText(inEvent.searchText);
        panel.setCallback(inEvent.callback);
        panel.fetch();
        this.next();
      }
    },
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
    create: function () {
      this.inherited(arguments);
      var modules = this.getModules();
      this.$.navigator.setModules(modules);
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
    }

  });

  // Class methods
  enyo.mixin(XV.Postbooks, {
    addModule: function (module, index) {
      var modules = this.prototype.published.modules,
        count = modules.length;
      index = index || count;
      modules.splice(index, 0, module);
    }
  });

}());

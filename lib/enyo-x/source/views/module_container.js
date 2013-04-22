/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.ModuleContainer",
    kind: "Panels",
    arrangerKind: "CardArranger",
    draggable: false,
    classes: "xv-postbooks enyo-unselectable",
    handlers: {
      onPrevious: "previous",
      onSearch: "addSearch",
      onWorkspace: "addWorkspacePanel",
      onChildWorkspace: "addChildWorkspacePanel"
    },
    published: {
      modules: null
    },
    components: [
      {name: "startup", classes: "xv-startup-panel", style: "background: #333;",
        components: [
        {name: "startupText", classes: "xv-startup-divider",
          content: "_loadingSessionData".loc() + "..."},
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
        panel.setList(inEvent);
        panel.fetch();
        this.next();
      } else {
        XT.log("No list associated with this model for searching. Are you sure you've registered it?");
      }
      return true;
    },
    /**
      Do the exact same thing as addWorkspacePanel, just use a ChildWorkspaceContainer
      instead of a WorkspaceContainer.
     */
    addChildWorkspacePanel: function (inSender, inEvent) {
      this.addWorkspacePanel(inSender, inEvent, "XV.ChildWorkspaceContainer");
    },
    /**
      Create and drill down into a new workspace as defined by the inEvent object
     */
    addWorkspacePanel: function (inSender, inEvent, workspaceContainerKind) {
      var panel;

      workspaceContainerKind = workspaceContainerKind || "XV.WorkspaceContainer"; // default

      if (inEvent.workspace) {
        panel = this.createComponent({kind: workspaceContainerKind});
        panel.render();
        this.reflow();
        panel.setWorkspace(inEvent);
        this.next();
      }
      return true;
    },
    /**
      Add panels to a module. If any are found to already
      exist by the same name they will be ignored.

      @param {String} Module name
      @param {Array} Panels
    */
    appendPanels: function (moduleName, panels) {
      var modules = this.getModules(),
        module = _.find(modules, function (mod) {
          return mod.name === moduleName;
        }),
        existing = _.pluck(module.panels, "name"),
        i;
      for (i = 0; i < panels.length; i++) {
        if (!_.contains(existing, panels[i].name)) {
          module.panels.push(panels[i]);
        }
      }
      if (module.sortAlpha) {
        // keep these alphabetically sorted
        module.panels = _.sortBy(module.panels, function (panel) {
          return panel.name;
        })
      }
      this._setModules();
    },
    create: function () {
      this.inherited(arguments);
      this._setModules();
    },
    getNavigator: function () {
      return this.$.navigator;
    },
    getStartupProgressBar: function () {
      return this.$.startupProgressBar;
    },
    getStartupText: function () {
      return this.$.startupText;
    },
    /**
      Insert a new `module` at `index`. If index is
      not defined the module will be appended to the
      end of the menu.

      @param {Object} Module
      @param {Number} Index
    */
    insertModule: function (module, index) {
      var modules = this.getModules(),
        count = modules.length;
      index = index || count;
      modules.splice(index, 0, module);
      this._setModules();
    },
    previous: function () {
      // Stock implementation is screwy, do our own
      var last = this.getActive(),
        previous = this.index - 1;
      this.setIndex(previous);
      last.destroy();
    },
    _setModules: function () {
      var modules = this.getModules();
      this.$.navigator.setModules(modules);
    }

  });

}());

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
    classes: "xv-postbooks enyo-unselectable",
    handlers: {
      onPrevious: "previous",
      onSearch: "addSearch",
      onWorkspace: "addWorkspacePanel"
    },
    published: {
      modules: [
        {name: "welcome", label: "_welcome".loc(), hasSubmenu: false,
          panels: [
          {name: "welcomePage",
            tag: "iframe",
						style: "border: none;",
            attributes: {src: "lib/enyo-x/assets/splash/index.html"}}
        ]},
        {name: "setup", label: "_setup".loc(), panels: [
          {name: "userAccountList", kind: "XV.UserAccountList"},
          {name: "userAccountRoleList", kind: "XV.UserAccountRoleList"}
        ]}
      ]
    },
    components: [
      {name: "startup", classes: "xv-startup-panel", style: "background: #333;",
        components: [
        {name: "startupText", classes: "xv-startup-divider",
          content: "_loadingSessionData".loc() + ".."},
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
      }
    },
    addWorkspacePanel: function (inSender, inEvent) {
      var panel;
      if (inEvent.workspace) {
        panel = this.createComponent({kind: "XV.WorkspaceContainer"});
        panel.render();
        this.reflow();
        panel.setWorkspace(inEvent);
        this.next();
      }
    },
    /**
      Add panels to a module. If any are found to already
      exist by the same name they will be ignored.

      @param {String} Module name
      @param {Array} Panels
    */
    appendPanels: function (moduleName, panels) {
      var modules = this.published.modules,
        module = _.find(modules, function (mod) {
          return mod.name === moduleName;
        }),
        existing = _.pluck(module, "name"),
        i;
      for (i = 0; i < panels.length; i++) {
        if (!_.contains(existing, panels[i].name)) {
          module.panels.push(panels[i]);
        }
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
      var modules = this.published.modules,
        count = modules.length;
      index = index || count;
      modules.splice(index, 0, module);
      this._setModules();
    },
    previous: function () {
      // Stock implementation is screwy, do our own
      var last = this.getActive(),
        previous = this.getPanels().length - 1;
      this.setIndex(previous);
      last.destroy();
    },
    _setModules: function () {
      var modules = this.getModules();
      this.$.navigator.setModules(modules);
    }

  });

}());

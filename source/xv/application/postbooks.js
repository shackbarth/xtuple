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
          {name: "userAccountRoleList", kind: "XV.UserAccountRoleList"}
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
    /**
      Add panels to a module. If any are found to already
      exist by the same name they will be ignored.
      
      @param {String} Module name
      @param {Array} Panels
    */
    appendPanels: function (moduleName, panels) {
      var modules = this.prototype.published.modules,
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
    },
    
    /**
      Insert a new `module` at `index`. If index is
      not defined the module will be appended to the
      end of the menu.
      
      @param {Object} Module
      @param {Number} Index
    */
    insertModule: function (module, index) {
      var modules = this.prototype.published.modules,
        count = modules.length;
      index = index || count;
      modules.splice(index, 0, module);
    }
  });

}());

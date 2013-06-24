/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {
  
  /**
    @class
    @name XV.ModuleContainer
    @extends enyo.Panels
    */
  enyo.kind(/** @lends XV.ModuleContainer# */{
    name: "XV.ModuleContainer",
    kind: "Panels",
    arrangerKind: "CardArranger",
    draggable: false,
    classes: "xv-postbooks enyo-unselectable",
    handlers: {
      onPrevious: "previous",
      onSearch: "addSearch",
      onWorkspace: "addWorkspacePanel",
      onChildWorkspace: "addChildWorkspacePanel",
      onNotify: "notify"
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
      {kind: "onyx.Popup", name: "notifyPopup", centered: true,
        modal: true, floating: true, scrim: true, components: [
        {name: "notifyMessage"},
        {tag: "br"},
        {kind: "onyx.Button", content: "_ok".loc(), name: "notifyOk", ontap: "notifyTap",
          classes: "onyx-blue xv-popup-button", showing: false},
        {kind: "onyx.Button", content: "_yes".loc(), name: "notifyYes", ontap: "notifyTap",
          classes: "onyx-blue xv-popup-button", showing: false},
        {kind: "onyx.Button", content: "_no".loc(), name: "notifyNo", ontap: "notifyTap",
          classes: "xv-popup-button", showing: false},
        {kind: "onyx.Button", content: "_cancel".loc(), name: "notifyCancel", ontap: "notifyTap",
          classes: "xv-popup-button", showing: false}
      ]},
      {name: "navigator", kind: "XV.Navigator"}
    ],
    activate: function () {
      this.goToNavigator();
      this.$.navigator.activate();
    },
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
        // this workspace is now the last panel. Go to it.
        this.setIndex(this.getPanels().length - 1);
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
        });
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
    goToNavigator: function () {
      var that = this;

      _.each(this.getPanels(), function (panel, index) {
        if (panel.name === 'navigator') {
          that.setIndex(index);
        }
      });
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
    /**
      The model wants to ask the user something.
     */
    notify: function (inSender, inEvent) {
      var typeToButtonMap = {};
      typeToButtonMap[String(XM.Model.NOTICE)] = ["notifyOk"];
      typeToButtonMap[String(XM.Model.WARNING)] = ["notifyOk"];
      typeToButtonMap[String(XM.Model.CRITICAL)] = ["notifyOk"];
      typeToButtonMap[String(XM.Model.QUESTION)] = ["notifyYes", "notifyNo"];
      typeToButtonMap[String(XM.Model.YES_NO_CANCEL)] = ["notifyYes", "notifyNo", "notifyCancel"];

      this.$.notifyMessage.setContent(inEvent.message);
      this._notifyCallback = inEvent.callback;

      // events are of type NOTICE by default
      inEvent.type = inEvent.type || XM.Model.NOTICE;

      // show the appropriate buttons
      _.each(this.$.notifyPopup.children, function (component) {
        if (component.kind !== "onyx.Button") {
          // not a button: do nothing.
        } else if (_.indexOf(typeToButtonMap[String(inEvent.type)], component.name) >= 0) {
          // in the show-me array, so show
          component.setShowing(true);
        } else {
          // not in the show-me array, so hide
          component.setShowing(false);
        }
      });

      this.$.notifyPopup.render();
      this.$.notifyPopup.show();
      this.$.notifyPopup.applyStyle("opacity", 1); // XXX not sure why this hack is necessary.
    },
    /**
      The OK button has been clicked from the notification popup. Close the popup and call
      the callback with the appropriate parameter if the callback exists.
     */
    notifyTap: function (inSender, inEvent) {
      var notifyParameter;

      if (typeof this._notifyCallback === 'function') {
        switch (inEvent.originator.name) {
        case 'notifyOk':
          notifyParameter = undefined;
          break;
        case 'notifyYes':
          notifyParameter = true;
          break;
        case 'notifyNo':
          notifyParameter = false;
          break;
        case 'notifyCancel':
          notifyParameter = undefined;
          break;
        }
        // the callback might make its own popup, which we do not want to hide.
        this.$.notifyPopup.hide();
        this._notifyCallback({answer: notifyParameter});
      } else {
        this.$.notifyPopup.hide();
      }
    },
    /**
      Go back to the previous panel. Note the implementation
      here means that we can't just put components anywhere
      we want in the component array. The navigator has to
      be the last one, so we can simply go "back" to it coming
      back out of a workspace.
     */
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

/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, _:true, enyo:true*/

(function () {

  /**
    @class
    @name XV.ModuleContainer
    @extends enyo.Panels
    */
  enyo.kind(
    /** @lends XV.ModuleContainer# */{
    name: "XV.ModuleContainer",
    kind: "Panels",
    arrangerKind: "CardArranger",
    draggable: false,
    classes: "enyo-fit",
    handlers: {
      onPrevious: "previous",
      onSearch: "addSearch",
      onTransactionList: "addTransactionList",
      onWorkspace: "addWorkspace",
      onChildWorkspace: "addChildWorkspacePanel",
      onPopupWorkspace: "popupWorkspace",
      onNotify: "notify",
      onTransitionFinish: "handleNotify"
    },
    published: {
      modules: null
    },
    components: [
      {name: "startup", classes: "xv-startup-panel",
        components: [
        {name: "startupText", classes: "xv-startup-divider",
          content: "_loadingSessionData".loc() + "..."},
        {name: "startupProgressBar", kind: "onyx.ProgressBar",
          classes: "xv-startup-progress  onyx-progress-button", progress: 0}
      ]},
      {kind: "onyx.Popup", name: "notifyPopup", classes: "xv-popup", centered: true,
        onHide: "notifyHidden",
        modal: true, floating: true, scrim: true, components: [
        {name: "notifyMessage", classes: "message"},
        {classes: "xv-buttons", name: "notifyButtons", components: [
          {kind: "onyx.Button", content: "_ok".loc(), name: "notifyOk", ontap: "notifyTap",
            showing: false, classes: "text"},
          {kind: "onyx.Button", content: "_yes".loc(), name: "notifyYes", ontap: "notifyTap",
            showing: false, classes: "text"},
          {kind: "onyx.Button", content: "_no".loc(), name: "notifyNo", ontap: "notifyTap",
            showing: false, classes: "text"},
          {kind: "onyx.Button", content: "_cancel".loc(), name: "notifyCancel", ontap: "notifyTap",
            showing: false, classes: "text"}
        ]}
      ]},
      {kind: "onyx.Popup", name: "popupWorkspace", classes: "xv-popup xv-groupbox-popup", centered: true,
        autoDismiss: false, modal: true, floating: true, scrim: true},
      {name: "navigator", kind: "XV.Navigator"}
    ],
    resizeHandler: function () {
      this.inherited(arguments);
      if (this.$.notifyPopup.showing) {
        // This is a fix for an enyo bug that renders the popup as clear
        this.$.notifyPopup.applyStyle("opacity", 1);
      }
    },
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
      Do the exact same thing as addWorkspace, just use a ChildWorkspaceContainer
      instead of a WorkspaceContainer.
     */
    addChildWorkspacePanel: function (inSender, inEvent) {
      this.addWorkspace(inSender, inEvent, "XV.ChildWorkspaceContainer");
    },
    addTransactionList: function (inSender, inEvent) {
      var panel = this.createComponent({kind: inEvent.kind}),
        order = panel.$.parameterWidget.$.order;

      panel.setCallback(inEvent.callback);
      panel.render();
      this.reflow();
      if (inEvent.key) {
        order.setValue(inEvent.key);
        order.setDisabled(true);
      }
      this.setIndex(this.getPanels().length - 1);

      return true;
    },
    /**
      Create and drill down into a new workspace as defined by the inEvent object
     */
    addWorkspace: function (inSender, inEvent, workspaceContainerKind) {
      var panel;

      workspaceContainerKind = workspaceContainerKind || "XV.WorkspaceContainer"; // default

      if (inEvent.workspace) {
        panel = this.createComponent({kind: workspaceContainerKind});
        panel.render();
        this.reflow();
        panel.setWorkspace(inEvent);
        // this workspace is now the last panel. Go to it.
        this.setIndex(this.getPanels().length - 1);
      } else if (inEvent.kind) {
        if (inEvent.model) {
          panel = this.createComponent({kind: inEvent.kind, model: inEvent.model});
        } else {
          panel = this.createComponent({kind: inEvent.kind});
        }
        panel.render();
        this.reflow();
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
      @param {Boolean} Append panels first
    */
    appendPanels: function (moduleName, panels, first) {
      var modules = this.getModules(),
        module = _.find(modules, function (mod) {
          return mod.name === moduleName;
        }),
        existing,
        i;

      if (!module) {
        // crash coming soon!
        XT.log("Error: trying to insert panel into nonexistent module", moduleName);
      }
      existing = _.pluck(module.panels, "name");

      for (i = 0; i < panels.length; i++) {
        if (!_.contains(existing, panels[i].name)) {
          if (first) {
            module.panels.unshift(panels[i]);
          }
          else {
            module.panels.push(panels[i]);
          }
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
    getNotifyButtons: function () {
      return this.$.notifyButtons.controls;
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
    handleNotify: function () {
      if (this._pendingNotify) {
        this.notify(
          this._pendingNotify.inSender,
          this._pendingNotify.inEvent
        );
        delete this._pendingNotify;
      }
    },
    /**
      Insert a new `module`. `Index` is currently ignored,
      but may be used in the future. The modules are appended to the
      end of the menu (before setup) based on extension load order.

      @param {Object} Module
      @param {Number} Index
    */
    insertModule: function (module, index) {
      var modules = this.getModules(),
        count = modules.length;
      index = count;
      modules.splice(index - 1, 0, module);
      this._setModules();
    },
    isNotifyPopupShowing: function () {
      return this.$.notifyPopup.showing;
    },
    /**
      The model wants to ask the user something.
     */
    notify: function (inSender, inEvent) {
      var that = this,
        customComponentControls,
        typeToButtonMap = {};

      // If we're still animating, then we'll do this when
      // that's done via `handleNotify`. Otherwise the popup
      // will get tangled up in events and lost.
      if (this.transitionPoints.length) {
        this._pendingNotify = {
          inSender: inSender,
          inEvent: inEvent
        };
        return;
      }

      typeToButtonMap[String(XM.Model.NOTICE)] = ["notifyOk"];
      typeToButtonMap[String(XM.Model.WARNING)] = ["notifyOk"];
      typeToButtonMap[String(XM.Model.CRITICAL)] = ["notifyOk"];
      typeToButtonMap[String(XM.Model.QUESTION)] = ["notifyYes", "notifyNo"];
      typeToButtonMap[String(XM.Model.OK_CANCEL)] = ["notifyOk", "notifyCancel"];
      typeToButtonMap[String(XM.Model.YES_NO_CANCEL)] = ["notifyYes", "notifyNo", "notifyCancel"];

      this.$.notifyMessage.setContent(inEvent.message);
      this._notifyCallback = inEvent.callback;
      this._notifyOptions = inEvent.options;

      // events are of type NOTICE by default
      inEvent.type = inEvent.type || XM.Model.NOTICE;

      // show the appropriate buttons
      _.each(this.getNotifyButtons(), function (component) {
        component.setShowing(_.indexOf(typeToButtonMap[String(inEvent.type)], component.name) >= 0);
      });

      // allow custom button text
      this.$.notifyYes.setContent(inEvent.yesLabel || "_yes".loc());
      this.$.notifyNo.setContent(inEvent.noLabel || "_no".loc());
      this.$.notifyOk.setContent(inEvent.okLabel || "_ok".loc());
      this.$.notifyCancel.setContent(inEvent.cancelLabel || "_cancel".loc());

      // highlight the index active button
      // it's the OK button unless it's a 2- or 3- way question, in which case it's YES
      this._activeNotify = inEvent.type === XM.Model.QUESTION || inEvent.type === XM.Model.YES_NO_CANCEL ? 1 : 0;
      _.each(this.getNotifyButtons(), function (button, index) {
        button.addRemoveClass("selected", index === that._activeNotify);
      });

      // delete out any previously added customComponents/customComponentControls
      if (this.$.notifyPopup.$.customComponent) {
        this.$.notifyPopup.removeComponent(this.$.notifyPopup.$.customComponent);

        customComponentControls = _.filter(that.$.notifyPopup.controls, function (control) {
          return control.name === "customComponent";
        });

        if (customComponentControls) {
          _.each(customComponentControls, function (control) {
            that.$.notifyPopup.removeControl(control);
          });
        }
      }

      // Add the custom component
      if (inEvent.component) {
        inEvent.component.name = "customComponent";
        // can add styling class here instead of inline css
        inEvent.component.addBefore = this.$.notifyButtons;
        this.$.notifyPopup.createComponent(inEvent.component);
        if (inEvent.componentModel) {
          this.$.notifyPopup.$.customComponent.setValue(inEvent.componentModel);
        }
      }

      this._notifyDone = false;
      this.$.notifyPopup.render();
      this.$.notifyPopup.show();
      // Without this fix, the popup renders transparent
      this.$.notifyPopup.applyStyle("opacity", 1);
    },
    notifyHidden: function () {
      if (!this._notifyDone) {
        this.$.notifyPopup.show();
      }
    },
    notifyKey: function (keyCode, isShift) {
      var activeIndex = this._activeNotify,
        notifyButtons = this.getNotifyButtons(),
        nextShowing;

      if (keyCode === 13) {
        //enter
        this.notifyTap(null, {originator: notifyButtons[activeIndex]});

      } else if (keyCode === 37 || (keyCode === 9 && isShift)) {
        // left or shift-tab
        notifyButtons[activeIndex].removeClass("selected");
        for (nextShowing = activeIndex - 1; nextShowing >= 0; nextShowing--) {
          if (nextShowing === 0 && !notifyButtons[nextShowing].showing) {
            // there are no showing buttons to the left
            nextShowing = undefined;
            break;
          }
          if (notifyButtons[nextShowing].showing) {
            break;
          }
        }
        if (nextShowing && nextShowing >= 0) {
          activeIndex = nextShowing;
        }
        this._activeNotify = activeIndex;
        notifyButtons[activeIndex].addClass("selected");

      } else if (keyCode === 39 || keyCode === 9) {
        // right or tab
        notifyButtons[activeIndex].removeClass("selected");
        for (nextShowing = activeIndex + 1; nextShowing < notifyButtons.length; nextShowing++) {
          if (nextShowing + 1 === notifyButtons.length && !notifyButtons[nextShowing].showing) {
            // there are no showing buttons to the right
            nextShowing = undefined;
            break;
          }
          if (notifyButtons[nextShowing].showing) {
            break;
          }
        }
        if (nextShowing && nextShowing < notifyButtons.length) {
          activeIndex = nextShowing;
        }
        this._activeNotify = activeIndex;

        notifyButtons[activeIndex].addClass("selected");
      }
    },
    /**
      The OK button has been clicked from the notification popup. Close the popup and call
      the callback with the appropriate parameter if the callback exists.
     */
    notifyTap: function (inSender, inEvent) {
      var notifyParameter,
        callbackObj = {},
        that = this,
        optionsObj = this._notifyOptions || {};

      this._notifyDone = true;
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
          notifyParameter = null;
          break;
        }
        // the callback might make its own popup, which we do not want to hide.
        this.$.notifyPopup.hide();
        callbackObj.answer = notifyParameter;
        if (this.$.notifyPopup.$.customComponent) {
          if (this.$.notifyPopup.$.customComponent.getValueAsync) {
            this.$.notifyPopup.$.customComponent.getValueAsync(function (result) {
              callbackObj.componentValue = result;
              that._notifyCallback(callbackObj, optionsObj);
            });
            return;
          }
          callbackObj.componentValue = this.$.notifyPopup.$.customComponent.getValue();
        }
        this._notifyCallback(callbackObj, optionsObj);
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
        previous = this.index - 1,
        active;
      this.setIndex(previous);

      // Provide a way to let panels or their children know they have been activated
      active = this.getActive();
      active.waterfallDown("onActivatePanel", {activated: active});

      last.destroy();
    },
    popupWorkspaceNotify: function (inSender, inEvent) {
      this.notify(inSender, inEvent);
    },
    popupWorkspace: function (inSender, inEvent) {
      this._popupWorkspaceCallback = inEvent.callback;

      this.$.popupWorkspace.destroyClientControls();
      this.$.popupWorkspace.createComponent({content: inEvent.message});
      this.$.popupWorkspace.createComponent({
        kind: "enyo.Scroller",
        name: "popupScroller",
        maxHeight: "400px",
        horizontal: "hidden"
      }, {owner: this});
      this.$.popupWorkspace.createComponent({name: "workspace", kind: inEvent.workspace,
        container: this.$.popupScroller});
      // TODO: inline css - git rid of it!
      this.$.popupWorkspace.$.workspace.addStyles("color:black;");
      this.$.popupWorkspace.$.workspace.setValue(inEvent.model);
      // create button bar
      this.$.popupWorkspace.createComponent({classes: "xv-buttons", name: "workspaceButtons"}, {owner: this});
      this.$.workspaceButtons.createComponents([{
        kind: "onyx.Button",
        content: "_save".loc(),
        name: "popupWorkspaceSave",
        ontap: "popupWorkspaceTap",
        classes: "selected text"
      },
      {
        kind: "onyx.Button",
        content: "_cancel".loc(),
        name: "popupWorkspaceCancel",
        ontap: "popupWorkspaceTap",
        classes: "text"
      }], {owner: this});
      this.$.popupWorkspace.render();
      this.$.popupWorkspace.show();
      // Without this fix, the popup renders transparent
      this.$.popupWorkspace.applyStyle("opacity", 1);
    },
    popupWorkspaceTap: function (inSender, inEvent) {
      var model = this.$.popupWorkspace.$.workspace.value,
        response = inEvent.originator.name === 'popupWorkspaceCancel' ? false : model,
        validationError,
        errorMessage;

      if (response) {
        validationError = model.validate(model.attributes);
        if (validationError) {
          errorMessage = validationError.message ? validationError.message() : "Error";
          this.notify(null, {message: validationError.message(), type: XM.Model.CRITICAL});
          return;
        }
      }
      this.$.popupWorkspace.hide();
      this._popupWorkspaceCallback(response);
    },
    _setModules: function () {
      var modules = this.getModules();
      this.$.navigator.setModules(modules);
    }

  });

}());

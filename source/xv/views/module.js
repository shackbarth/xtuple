/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {
  var FETCH_TRIGGER = 100;
  var MODULE_MENU = 0;
  var PANEL_MENU = 1;

  enyo.kind({
    name: "XV.Module",
    kind: "Panels",
    classes: "app enyo-unselectable",
    published: {
      label: "",
      modules: []
    },
    events: {
      onListAdded: "",
      onTogglePullout: ""
    },
    handlers: {
      onParameterChange: "requery",
      onScroll: "scrolled",
      onListItemTapped: "listItemTapped"
    },
    showPullout: true,
    arrangerKind: "CollapsingArranger",
    components: [
      {kind: "FittableRows", classes: "left", components: [
        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "onyx.Button", name: "backButton", content: "_logout".loc(),
            ontap: "backTapped"},
          {kind: "Group", name: "iconButtonGroup",
            defaultKind: "onyx.IconButton", tag: null, components: [
            {name: "historyIconButton", src: "assets/menu-icon-bookmark.png",
              ontap: "showHistory"},
            {name: "searchIconButton", src: "assets/menu-icon-search.png",
              ontap: "showParameters"}
          ]},
          {name: "leftLabel"},
          {kind: "onyx.Popup", name: "logoutPopup", centered: true,
            modal: true, floating: true, components: [
            {content: "_logoutConfirmation".loc() },
            {tag: "br"},
            {kind: "onyx.Button", content: "_ok".loc(), ontap: "logout"},
            {kind: "onyx.Button", content: "_cancel".loc(),
              ontap: "closeLogoutPopup", classes: "onyx-blue"}
          ]}
        ]},
        {name: "menuPanels", kind: "Panels", draggable: false, fit: true,
          components: [
          {name: "moduleMenu", kind: "List", touch: true,
              onSetupItem: "setupModuleMenuItem",
              components: [
            {name: "moduleItem", classes: "item enyo-border-box",
              ontap: "moduleItemTap"}
          ]},
          {name: "panelMenu", kind: "List", touch: true,
             onSetupItem: "setupPanelMenuItem", components: [
            {name: "listItem", classes: "item enyo-border-box",
              ontap: "menuItemTap"}
          ]},
          {} // Why do panels only work when there are 3+ objects?
        ]}
      ]},
      {kind: "FittableRows", components: [
        {kind: "onyx.MoreToolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {name: "rightLabel", style: "text-align: center"},
          {kind: "onyx.InputDecorator", style: "float: right;", components: [
            {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
              placeholder: "Search", onchange: "inputChanged"},
            {kind: "Image", src: "assets/search-input-search.png"}
          ]},
          {kind: "onyx.Button", content: "_new".loc(), ontap: "newRecord",
            style: "float: right;" }
        ]},
        {name: "contentPanels", kind: "Panels", arrangerKind: "LeftRightArranger",
           margin: 0, fit: true, panelCount: 0, onTransitionFinish: "finishedTransition"}
      ]},
      {kind: "Signals", onModelSave: "refreshInfoObject"}
    ],
    fetched: {},
    activate: function () {
      this.setMenuPanel(MODULE_MENU);
    },
    backTapped: function () {
      var index = this.$.menuPanels.getIndex();
      if (index === MODULE_MENU) {
        this.warnLogout();
      } else {
        this.setMenuPanel(MODULE_MENU);
      }
    },
    create: function () {
      this.inherited(arguments);
      var modules = this.getModules() || [],
        label = this.getLabel(),
        panels,
        panel,
        i,
        n;
      this.$.leftLabel.setContent(label);

      // Build panels
      for (i = 0; i < modules.length; i++) {
        panels = modules[i].panels || [];
        for (n = 0; n < panels.length; n++) {
          // Keep track of where this panel is being placed for later reference
          panels[n].index = this.$.contentPanels.panelCount++;
          panel = this.$.contentPanels.createComponent(panels[n]);
          if (panel instanceof XV.List) {
            // Bubble parameter widget up to pullout
            this.doListAdded(panel);
          }
        }
      }
      this.$.moduleMenu.setCount(modules.length);
    },
    finishedTransition: function (inSender, inEvent) {
      this.setContentPanel(inSender.index);
    },
    getSelectedModule: function (index) {
      return this._selectedModule;
    },
    inputChanged: function (inSender, inEvent) {
      var index = this.$.contentPanels.getIndex(),
        list = this.panels[index].name;
      this.fetched = {};
      this.fetch(list);
    },
    listItemTapped: function (inSender, inEvent) {
      var list = this.$.contentPanels.getActive(),
        workspace = list.getWorkspace(),
        id = list.getModel(inEvent.index).id;

      // Transition to workspace view, including the model id payload
      this.bubble("workspace", {
        eventName: "workspace",
        workspace: workspace,
        id: id
      });
      return true;
    },
    fetch: function (index, options) {
      index = index || this.$.contentPanels.getIndex();
      var panel = this.$.contentPanels.getPanels()[index],
        name = panel ? panel.name : "",
        query,
        input,
        parameterWidget,
        parameters;
      if (!panel instanceof XV.List) { return; }
      query = panel.getQuery() || {};
      input = this.$.searchInput.getValue();
      parameterWidget = XT.app ? XT.app.getPullout().getItem(name) : null;
      parameters = parameterWidget ? parameterWidget.getParameters() : [];
      options = options ? _.clone(options) : {};
      options.showMore = _.isBoolean(options.showMore) ?
        options.showMore : false;

      // Build parameters
      if (input || parameters.length) {
        query.parameters = [];

        // Input search parameters
        if (input) {
          query.parameters = [{
            attribute: panel.getSearchableAttributes(),
            operator: 'MATCHES',
            value: this.$.searchInput.getValue()
          }];
        }

        // Advanced parameters
        if (parameters) {
          query.parameters = query.parameters.concat(parameters);
        }
      } else {
        delete query.parameters;
      }

      panel.setQuery(query);
      panel.fetch(options);
      this.fetched[index] = true;
    },
    newRecord: function (inSender, inEvent) {
      var list = this.$.contentPanels.getActive(),
        workspace = list.getWorkspace();
      this.bubble("workspace", {
        eventName: "workspace",
        workspace: workspace
      });
      return true;
    },
    menuItemTap: function (inSender, inEvent) {
      this.setContentPanel(inEvent.index);
    },
    moduleItemTap: function (inSender, inEvent) {
      //this.setModule(inEvent.index);
    },
    requery: function (inSender, inEvent) {
      this.fetch();
    },
    scrolled: function (inSender, inEvent) {
      if (inEvent.originator instanceof XV.List === false) { return; }
      var list = inEvent.originator,
        max = list.getScrollBounds().maxTop - list.rowHeight * FETCH_TRIGGER,
        options = {};
      if (list.getIsMore() && list.getScrollPosition() > max && !list.getIsFetching()) {
        list.setIsFetching(true);
        options.showMore = true;
        this.fetch(list.name, options);
      }
    },
    setContentPanel: function (index) {
      var module = this.getSelectedModule(),
        panelIndex = module && module.panels ? module.panels[index].index : -1,
        panel = panelIndex > -1 ? this.$.contentPanels.getPanels()[panelIndex] : null,
        label = panel ? panel.getLabel() : "";
      if (!panel) { return; }

      // Select panelMenu
      if (!this.$.panelMenu.isSelected(index)) {
        this.$.panelMenu.select(index);
      }

      // Select list
      if (this.$.contentPanels.getIndex() !== panelIndex) {
        this.$.contentPanels.setIndex(panelIndex);
      }
      this.$.rightLabel.setContent(label);
      if (panel.fetch && !this.fetched[panelIndex]) {
        this.fetch(panelIndex);
      }
    },
    setMenuPanel: function (index) {
      var label = index ? "_back".loc() : "_logout".loc();
      this.$.menuPanels.setIndex(index);
      this.$.menuPanels.getActive().select(0);
      this.setContentPanel(0);
      this.$.backButton.setContent(label);
    },
    setModule: function (index) {
      var module = this.getModules()[index],
        panels = module.panels || [];
      if (module !== this._selectedModule) {
        this._selectedModule = module;
        if (panels.length) {
          this.$.panelMenu.setCount(panels.length);
          this.setMenuPanel(PANEL_MENU);
        }
      }
    },
    setupModuleMenuItem: function (inSender, inEvent) {
      var index = inEvent.index,
        label = this.modules[index].label,
        isSelected = inSender.isSelected(index);
      this.$.moduleItem.setContent(label);
      this.$.moduleItem.addRemoveClass("onyx-selected", isSelected);
      if (isSelected) { this.setModule(index); }
    },
    setupPanelMenuItem: function (inSender, inEvent) {
      var module = this.getSelectedModule(),
        panel;
      panel =  module.panels[inEvent.index].name;
      this.$.listItem.setContent(this.$.contentPanels.$[panel].getLabel());
      this.$.listItem.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
    },
    showHistory: function (inSender, inEvent) {
      var panel = {name: 'history'};
      this.doTogglePullout(panel);
    },
    showParameters: function (inSender, inEvent) {
      var panel = this.$.contentPanels.getActive();
      this.doTogglePullout(panel);
    },
    /**
     * If a model has changed, check the panels of this module to see if we can
     * update the info object in the list.
     * XXX if there are multiple modules alive then all of them will catch
     * XXX the signal, which isn't ideal for performance
     */
    refreshInfoObject: function (inSender, inPayload) {
      // obnoxious massaging. Can't think of an elegant way to do this.
      // salt in wounds: in setup we massage by adding List on the end, but with
      // crm we massage by adding List on the end. This is horrible.
      // XXX not sustainable
      var listBase = XV.util.stripModelNamePrefix(inPayload.recordType).camelize(),
        listName = this.name === "setup" ? listBase + "List" : listBase + "List",
        list = this.$.contentPanels.$[listName];


      /**
       * If the update model is part of a cached collection, refresh the cache
       * XXX This string massaging should be refactored into intelligence within
       * the collection itself.
       * XXX this part will happen for each living module. But it only needs to
       * be refreshed once. Moving away from signals would solve this. Or we
       * could create a dedicated signal event.
       */
      var cacheName;
      if (listBase.charAt(listBase.length - 1) === 'y') {
        cacheName = listBase.substring(0, listBase.length - 1) + 'ies';
      } else {
        cacheName = listBase + 's';
      }
      if (XM[cacheName]) {
        XM[cacheName].fetch();
        // no need to fetch the model itself, but we do want to tell the
        // module that contains the list to refresh that list by setting
        // the fetched property to false

        if (this.fetched[listName]) {
          this.fetched[listName] = false;
        }

        return;
      }

      /**
       * Update the model itself
       */
      if (!list) {
        // we don't have this model on our list. No need to update
        return;
      }
      var model = _.find(list.collection.models, function (model) {
        return model.id === inPayload.id;
      });
      if (!model) {
        // this model isn't in the list. No need to update
        return;
      }
      model.fetch();
    },

    /**
      Logout management. We show the user a warning popup before we log them out.
    */
    warnLogout: function () {
      this.$.logoutPopup.show();
    },
    closeLogoutPopup: function () {
      this.$.logoutPopup.hide();
    },
    logout: function () {
      this.$.logoutPopup.hide();
      XT.session.logout();
    },

    /**
      Manually set one of the icon buttons to be active. Note passing null
      as the parameter will disactivate all icons.
    */
    setActiveIconButton: function (buttonName) {
      var activeIconButton = null;
      if (buttonName === 'search') {
        activeIconButton = this.$.searchIconButton;
      } else if (buttonName === 'history') {
        activeIconButton = this.$.historyIconButton;
      }
      this.$.iconButtonGroup.setActive(activeIconButton);
    }

  });

}());

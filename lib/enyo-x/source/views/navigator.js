/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true, window:true */

(function () {
  var MODULE_MENU = 0;
  var PANEL_MENU = 1;

  /**
    @name XV.Navigator
    @class Contains a set of panels for navigating the app and modules within the app.<br />
    Navigation within the app is accomplished by elements within the menu tool bar, such as history, search, the back button or logout.<br />
	Navigation within modules in the app is accomplished with a list within the panel menu which displays the menu items for each context.<br />
	The root menu (module menu) contains the list of modules and the logout.<br />
	Only three menus are cached at one time.<br />
	Layout: Collapsing Arranger.<br />
    Use to implement the high-level container of all business object lists.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.Panels">enyo.Panels</a>.
    @extends enyo.Panels
   */
  enyo.kind(/** @lends XV.Navigator# */{
    name: "XV.Navigator",
    kind: "Panels",
    classes: "app enyo-unselectable",
    /**
      Published fields
      @type {Object}

      @property {Array} modules A DOM-free representation of all of the modules
         contained in the navigator. The details of these module objects will
         inform the creation of the panel components.

      @property {Object} panelCache A hashmap of cached panels where the key is
         the global ID of the panel and the value is the enyo panel component.
    */
    published: {
      modules: [],
      panelCache: {}
    },
    events: {
      onListAdded: "",
      onNavigatorEvent: "",
      onNotify: "",
      onWorkspace: ""
    },
    handlers: {
      onDeleteTap: "showDeletePopup",
      onListItemMenuTap: "showListItemMenu",
      onParameterChange: "requery",
      onItemTap: "itemTap"
    },
    showPullout: true,
    arrangerKind: "CollapsingArranger",
    components: [
      {kind: "FittableRows", classes: "left", components: [
        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "onyx.Button", name: "backButton", content: "_logout".loc(),
              ontap: "backTapped"},
          {kind: "Group", name: "iconButtonGroup", tag: null, components: [
            {kind: "XV.IconButton", name: "historyIconButton",
               src: "/assets/menu-icon-bookmark.png",
               ontap: "showHistory", content: "_history".loc()},
            {kind: "XV.IconButton", name: "searchIconButton",
               src: "/assets/menu-icon-search.png",
               ontap: "showParameters", content: "_advancedSearch".loc(), showing: false}
          ]},
          {kind: "onyx.MenuDecorator", style: "margin: 0;", onSelect: "actionSelected", components: [
            {kind: "XV.IconButton", src: "/assets/menu-icon-gear.png",
							content: "_actions".loc()},
            {kind: "onyx.Menu", name: "gearMenu", components: [
              {name: "printItem", content: "_print".loc(), showing: false},
              {name: "exportItem", content: "_export".loc(), showing: false},
              {name: "myAccountItem", content: "_changePassword".loc()},
              {name: "helpItem", content: "_help".loc()},
              {name: "aboutItem", content: "_about".loc()},
              {name: "newTabItem", content: "_openNewTab".loc()}
            ]}
          ]},
          {kind: "onyx.Popup", name: "aboutPopup", centered: true,
            modal: true, floating: true, scrim: true, components: [
            {content: "Copyright xTuple 2013" },
            {name: "aboutVersion", allowHtml: true },
            {kind: "onyx.Button", content: "_ok".loc(), ontap: "closeAboutPopup"}
          ]}
        ]},
        {name: "loginInfo", content: "", classes: "xv-navigator-header"},
        {name: "menuPanels", kind: "Panels", draggable: false, fit: true,
          margin: 0, components: [
          {name: "moduleMenu", kind: "List", touch: true,
              onSetupItem: "setupModuleMenuItem", ontap: "menuTap",
              components: [
            {name: "moduleItem", classes: "item enyo-border-box"}
          ]},
          {name: "panelMenu", kind: "List", touch: true,
             onSetupItem: "setupPanelMenuItem", ontap: "panelTap", components: [
            {name: "listItem", classes: "item enyo-border-box"}
          ]},
          {} // Why do panels only work when there are 3+ objects?
        ]}
      ]},
      {kind: "FittableRows", components: [
				// the onyx-menu-toolbar class keeps the popups from being hidden
        {kind: "onyx.MoreToolbar", name: "contentToolbar",
          classes: "onyx-menu-toolbar", movedClass: "xv-toolbar-moved", components: [
          {kind: "onyx.Grabber"},
          {name: "rightLabel", style: "width: 180px"},
          // The MoreToolbar is a FittableColumnsLayout, so this spacer takes up all available space
          {name: "spacer", content: "", fit: true},
          {name: "newButton", kind: "XV.IconButton",
            src: "/assets/menu-icon-new.png", content: "_new".loc(),
            ontap: "newRecord", showing: false},
          {name: "refreshButton", kind: "XV.IconButton",
            src: "/assets/menu-icon-refresh.png", content: "_refresh".loc(),
            ontap: "requery", showing: false},
          {name: "search", kind: "onyx.InputDecorator",
            showing: false, components: [
            {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
              placeholder: "_search".loc(), onchange: "inputChanged"},
            {kind: "Image", src: "/assets/search-input-search.png",
              name: "searchJump", ontap: "jump"}
          ]}
        ]},
        {name: "header", content: "", classes: ""},
        {name: "contentPanels", kind: "Panels", margin: 0, fit: true,
          draggable: false, panelCount: 0},
        {name: "myAccountPopup", kind: "XV.MyAccountPopup"},
        {name: "listItemMenu", kind: "onyx.Menu", floating: true, onSelect: "listActionSelected",
          maxHeight: 500, components: []
        }
      ]}
    ],
    /**
      Keeps track of whether any list has already been fetched, to avoid unnecessary
      refetching.
     */
    fetched: {},
    actionSelected: function (inSender, inEvent) {
      switch (inEvent.originator.name)
      {
      case 'printItem':
        this.printList();
        break;
      case 'exportItem':
        this.exportList();
        break;
      case 'helpItem':
        this.showHelp();
        break;
      case 'aboutItem':
        this.$.aboutPopup.show();
        break;
      case 'newTabItem':
        window.open(XT.getOrganizationPath() + '/app', '_newtab');
        break;
      case 'myAccountItem':
        this.showMyAccount();
        break;
      }
    },
    activate: function () {
      this.setMenuPanel(MODULE_MENU);
    },
    /**
      The back button is a logout button if you're at the root menu. Otherwise it's a
      back button that takes you to the root menu.
     */
    backTapped: function () {
      var index = this.$.menuPanels.getIndex();
      if (index === MODULE_MENU) {
        var inEvent = {
          originator: this,
          type: XM.Model.QUESTION,
          callback: function (response) {
            if (response.answer) {
              XT.logout();
            }
          },
          message: "_logoutConfirmation".loc()
        };
        this.doNotify(inEvent);
      } else {
        this.setHeaderContent("");
        this.setMenuPanel(MODULE_MENU);
      }
    },
    /**
      The navigator only keeps three panels in the DOM at a time. Anything extra panels
      will be periodically cached into the panelCache published field and removed from the DOM.
     */
    cachePanels: function () {
      var contentPanels = this.$.contentPanels,
        panelToCache,
        globalIndex,
        pertinentModule,
        panelReference,
        findPanel = function (panel) {
          return panel.index === globalIndex;
        },
        findModule = function (module) {
          var panel = _.find(module.panels, findPanel);
          return panel !== undefined;
        };

      while (contentPanels.children.length > 3) {
        panelToCache = contentPanels.children[0];
        globalIndex = panelToCache.index;

        // Panels are abstractly referenced in this.getModules().
        // Find the abstract panel of the panelToCache
        // XXX this would be cleaner if we kept a backwards reference
        // from the panel to its containing module (and index therein)
        pertinentModule = _.find(this.getModules(), findModule);
        panelReference = _.find(pertinentModule.panels, findPanel);

        contentPanels.removeChild(panelToCache);
        contentPanels.render();
        panelReference.status = "cached";
        this.getPanelCache()[globalIndex] = panelToCache;
      }
    },
    closeAboutPopup: function () {
      this.$.aboutPopup.hide();
    },
    getSelectedModule: function () {
      return this._selectedModule;
    },
    listActionSelected: function (inSender, inEvent) {
      var that = this,
        list = this.$.contentPanels.getActive(),
        index = list.getSelection().lastSelected,
        originator = inEvent.originator,
        notifyEvent = {},
        action = originator.action,
        method = action.method,
        callback = function () {
          list.resetActions(index);
          list.renderRow(index);
        },
        confirmed = function (event, action) {
          var model = event.model;
          if (action.isViewMethod) {
            that._listItemEvent.originator.parent.doActionSelected({model: model, action: action});

          // If the list item model doesn't have the function being asked for, try the editable version
          } else if (model instanceof XM.Info && !model[method]) {
            XT.getObjectByName(model.editableModel)[method](model, callback);

          } else {
            event.model[method](callback);
          }
        };

      if (originator.action.notify !== false) { // default to true if not specified
        // if the action requires a user OK, ask the user
        notifyEvent.originator = this;
        notifyEvent.type = XM.Model.QUESTION;
        notifyEvent.message = action.notifyMessage || "_confirmAction".loc();
        notifyEvent.callback = function (response) {
          if (response.answer) {
            confirmed(that._listItemEvent, action);
          }
        };
        this.doNotify(notifyEvent);

      } else {
        // if the action does not require a user OK, just do the event
        confirmed(this._listItemEvent, originator.action);
      }
      return true;
    },
    /**
      Exports the contents of a list to CSV. Note that it will export the entire
      list, not just the part that's been lazy-loaded. Of course, it will apply
      the filter criteria as selected. Goes to the server for this.
      Avoids websockets or AJAX because the server will prompt the browser to download
      the file by setting the Content-Type of the response, which is not possible with
      those technologies.
     */
    exportList: function (inSender, inEvent) {
      this.openExportTab('export');
    },
    printList: function (inSender, inEvent) {
      this.openExportTab('report');
    },
    openExportTab: function (routeName) {
      var list = this.$.contentPanels.getActive(),
        recordType = list.value.model.prototype.recordType,
        query = JSON.parse(JSON.stringify(list.getQuery())); // clone

      delete query.rowLimit;
      delete query.rowOffset;

      // sending the locale information back over the wire saves a call to the db
      window.open(XT.getOrganizationPath() +
        '/%@?details={"nameSpace":"%@","type":"%@","query":%@,"locale":%@}'
        .f(routeName,
          recordType.prefix(),
          recordType.suffix(),
          JSON.stringify(query),
          JSON.stringify(XT.session.locale.toJSON())),
        '_newtab');
    },
    /**
      Fetch a list.
     */
    fetch: function (options) {
      options = options ? _.clone(options) : {};
      var index = this.$.contentPanels.getIndex(),
        list = this.$.contentPanels.getPanels()[index],
        name = list ? list.name : "",
        query,
        input,
        parameterWidget,
        parameters,
        filterDescription;
      if (list instanceof XV.List === false) { return; }
      query = list.getQuery() || {};
      input = this.$.searchInput.getValue();
      parameterWidget = XT.app ? XT.app.$.pullout.getItem(name) : null;
      parameters = parameterWidget ? parameterWidget.getParameters() : [];
      options.showMore = _.isBoolean(options.showMore) ?
        options.showMore : false;

      filterDescription = this.formatQuery(parameterWidget ? parameterWidget.getSelectedValues() : null, input);
      list.setFilterDescription(filterDescription);
      this.setHeaderContent(filterDescription);

      // Build parameters
      if (input || parameters.length) {
        query.parameters = [];

        // Input search parameters
        if (input) {
          query.parameters = [{
            attribute: list.getSearchableAttributes(),
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

      list.setQuery(query);
      list.fetch(options);
    },
    formatQuery: function (advancedSearch, simpleSearch) {
      var key,
        formattedQuery = "";

      for (key in advancedSearch) {
        formattedQuery += (key + ": " + advancedSearch[key] + ", ");
      }

      if (simpleSearch && formattedQuery) {
        formattedQuery += "_match".loc() + ": " + simpleSearch;
      } else if (simpleSearch) {
        formattedQuery += simpleSearch;
      }

      if (formattedQuery) {
        formattedQuery = "_filterBy".loc() + ": " + formattedQuery;
      }

      if (formattedQuery.lastIndexOf(", ") + 2 === formattedQuery.length) {
        // chop off trailing comma
        formattedQuery = formattedQuery.substring(0, formattedQuery.length - 2);
      }

      return formattedQuery;
    },
    inputChanged: function (inSender, inEvent) {
      this.fetched = {};
      this.fetch();
    },
    /**
      Drills down into a workspace if a user clicks a list item.
     */
    itemTap: function (inSender, inEvent) {
      var list = inEvent.list,
        workspace = list ? list.getWorkspace() : null,
        model = list.getModel(inEvent.index),
        canNotRead = model.couldRead ? !model.couldRead() : !model.getClass().canRead(),
        id = model && model.id ? model.id : false;

      // Check privileges first
      if (canNotRead) {
        this.showError("_insufficientViewPrivileges".loc());
        return true;
      }

      // Bubble requset for workspace view, including the model id payload
      if (workspace) { this.doWorkspace({workspace: workspace, id: id}); }
      return true;
    },
    jump: function () {
      var index = this.$.contentPanels.getIndex(),
         list = this.$.contentPanels.getPanels()[index],
         workspace = list ? list.getWorkspace() : null,
         Klass = list.getValue().model,
         upper = this._getModelProperty(Klass, 'enforceUpperKey'),
         input = this.$.searchInput.getValue(),
         that = this,
         options = {},
         key = this._getModelProperty(Klass, 'documentKey'),
         model,
         attrs = {};
      if (this._busy  || !input || !key) { return; }
      this._busy = true;

      // First find a matching id
      options.success = function (id) {
        var options = {};
        if (id) {

          // Next fetch the model, see if we have privs
          options.success = function () {
            var canNotRead = model.couldRead ?
              !model.couldRead() : !model.getClass().canRead();

            // Check privileges first
            if (canNotRead) {
              this.showError("_insufficientViewPrivileges".loc());
            } else {

              // Bubble requset for workspace view, including the model id payload
              if (workspace) { that.doWorkspace({workspace: workspace, id: id}); }
            }
            that._busy = false;
          };
          attrs[Klass.prototype.idAttribute] = id;
          model = Klass.findOrCreate(attrs);
          model.fetch(options);
        } else {
          that.showError("_noDocumentFound".loc());
          that.$.searchInput.clear();
          that._busy = false;
        }
      };
      input = upper ? input.toUpperCase() : input;
      Klass.findExisting(key, input, options);
    },
    loginInfo: function () {
      return this.$.loginInfo;
    },
    /**
      Handles additive changes only
    */
    modulesChanged: function () {
      var modules = this.getModules() || [],
        existingModules = this._modules || [],
        existingModule,
        existingPanel,
        panels,
        panel,
        i,
        n,
        findExistingModule = function (name) {
          return _.find(existingModules, function (module) {
            return module.name === name;
          });
        },
        findExistingPanel = function (panels, name) {
          return _.find(panels, function (panel) {
            return panel.name === name;
          });
        };

      // Build panels
      for (i = 0; i < modules.length; i++) {
        panels = modules[i].panels || [];
        existingModule = findExistingModule(modules[i].name);
        for (n = 0; n < panels.length; n++) {

          // If the panel already exists, move on
          if (existingModule) {
            existingPanel = findExistingPanel(existingModule.panels, panels[n].name);
            if (existingPanel) { continue; }
          }

          // Keep track of where this panel is being placed for later reference
          panels[n].index = this.$.contentPanels.panelCount++;

          // XXX try this: only create the first three
          if (panels[n].index < 3) {
            panels[n].status = "active";

            // Default behavior for Lists is toggle selections
            // So we can perform actions on rows. If not a List
            // this property shouldn't hurt anything
            if (panels[n].toggleSelected === undefined) {
              panels[n].toggleSelected = true;
            }
            panel = this.$.contentPanels.createComponent(panels[n]);
            if (panel instanceof XV.List) {

              // Bubble parameter widget up to pullout
              this.doListAdded(panel);
            }
          } else {
            panels[n].status = "unborn";
          }
        }
      }
      this.$.moduleMenu.setCount(modules.length);
      // Cache a deep copy
      this._modules = JSON.parse(JSON.stringify(modules));
      this.render();
    },
    /**
      Fired when the user clicks the "New" button. Takes the user to a workspace
      backed by an empty object of the type displayed in the current list.
     */
    newRecord: function (inSender, inEvent) {
      var list = this.$.contentPanels.getActive(),
        workspace = list instanceof XV.List ? list.getWorkspace() : null,
        Model,
        canCreate,
        callback;

      if (!list instanceof XV.List) {
        return true;
      }

      // Check privileges
      Model = list.getValue().model;
      canCreate = Model.couldCreate ? Model.couldCreate() : Model.canCreate();
      if (!canCreate) {
        this.showError("_insufficientCreatePrivileges".loc());
        return true;
      }

      // Callback options on commit of the workspace
      // Fetch the corresponding list model and add
      callback = function (model) {
        if (!model) { return; }
        var Model = list.getValue().model,
          attrs = {},
          value,
          options = {silent: true};
        attrs[Model.prototype.idAttribute] = model.id;
        value = Model.findOrCreate(attrs);
        options.success = function () {
          list.getValue().add(value);
          list.setCount(list.getValue().length);
          list.refresh();
        };
        value.fetch(options);
      };
      if (workspace) {
        this.doWorkspace({
          workspace: workspace,
          callback: callback
        });
      }
      return true;
    },
    popupHidden: function (inSender, inEvent) {
      if (!this._popupDone) {
        inEvent.originator.show();
      }
    },
    requery: function (inSender, inEvent) {
      this.fetch();
    },
    /**
      Determines whether the advanced search or the history icon (or neither) is
      lit.
     */
    setActiveIconButton: function (buttonName) {
      var activeIconButton = null;
      // Null deactivates both
      if (buttonName === 'search') {
        activeIconButton = this.$.searchIconButton;
      } else if (buttonName === 'history') {
        activeIconButton = this.$.historyIconButton;
      }
      this.$.iconButtonGroup.setActive(activeIconButton);
    },
    /**
      Renders a list and performs all the necessary auxilliary work such as hiding/showing
      the advanced search icon if appropriate. Called when a user chooses a menu item.
     */
    setContentPanel: function (index) {
      var contentPanels = this.$.contentPanels,
        module = this.getSelectedModule(),
        panelIndex = module && module.panels ? module.panels[index].index : -1,
        panelStatus = module && module.panels ? module.panels[index].status : 'unknown',
        panel,
        label,
        collection,
        model,
        canNotCreate = true;

      if (panelStatus === 'active') {
        panel = _.find(contentPanels.children, function (child) {
          return child.index === panelIndex;
        });
      } else if (panelStatus === 'unborn') {
        // panel exists but has not been rendered. Render it.
        module.panels[index].status = 'active';

        // Default behavior for Lists is toggle selections
        // So we can perform actions on rows. If not a List
        // this property shouldn't hurt anything
        if (module.panels[index].toggleSelected === undefined) {
          module.panels[index].toggleSelected = true;
        }
        panel = contentPanels.createComponent(module.panels[index]);
        panel.render();
        if (panel instanceof XV.List) {

          // Bubble parameter widget up to pullout
          this.doListAdded(panel);
        }

      } else if (panelStatus === 'cached') {
        module.panels[index].status = 'active';
        panel = this.panelCache[panelIndex];
        contentPanels.addChild(panel);
        panel.node = undefined; // new to enyo2.2! wipe out the node so that it can get re-rendered fresh
        panel.render();

      } else {
        XT.error("Don't know what to do with this panel status");
      }

      // Mobile device view
      if (enyo.Panels.isScreenNarrow()) {
        this.next();
      }

      // If we're already here, bail
      if (contentPanels.index === this.$.contentPanels.indexOfChild(panel)) {
        return;
      }

      // cache any extraneous content panels
      this.cachePanels();

      label = panel && panel.label ? panel.label : "";
      collection = panel && panel.getCollection ? XT.getObjectByName(panel.getCollection()) : false;

      if (!panel) { return; }

      // Make sure the advanced search icon is visible iff there is an advanced
      // search for this list
      if (panel.parameterWidget) {
        this.$.searchIconButton.setShowing(true);
      } else {
        this.$.searchIconButton.setShowing(false);
      }
      this.doNavigatorEvent({name: panel.name, show: false});

      // I'm skirting around the loading time for XM.currentUser. If this data
      // hasn't been loaded yet then the navigator simply won't allow export
      var isAllowedToExport = XM.currentUser && !XM.currentUser.get("disableExport");

      // XXX temp while we build out BI reports for all of these...
      var isSupportedInBi = _.indexOf(["Contacts", "Incidents", "To Do", "Accounts", "Opportunities", "Prospects", "Customers", "Quotes"], label) >= 0;
      var isBiAvailable = XT.reporting;
      this.$.printItem.setShowing(collection && isAllowedToExport && isSupportedInBi && isBiAvailable);
      this.$.exportItem.setShowing(collection && isAllowedToExport);

      // Handle new button
      this.$.newButton.setShowing(panel.canAddNew);
      this.$.contentToolbar.resized();
      if (panel.canAddNew && collection) {
        // Check 'couldCreate' first in case it's an info model.
        model = collection.prototype.model;
        canNotCreate = model.prototype.couldCreate ? !model.prototype.couldCreate() : !model.canCreate();
      }
      this.$.newButton.setDisabled(canNotCreate);

      // Select panelMenu
      if (!this.$.panelMenu.isSelected(index)) {
        this.$.panelMenu.select(index);
      }

      // Select list
      contentPanels.setIndex(this.$.contentPanels.indexOfChild(panel));

      this.$.rightLabel.setContent(label);
      if (panel.getFilterDescription) {
        this.setHeaderContent(panel.getFilterDescription());
      }
      if (panel.fetch && !this.fetched[panelIndex]) {
        this.fetch();
        this.fetched[panelIndex] = true;
      }
    },

    /**
      The header content typically describes to the user the particular query filter in effect.
     */
    setHeaderContent: function (content) {
      this.$.header.setContent(content);
      if (content !== "") {
        this.$.header.setClasses("xv-navigator-header");
      } else {
        this.$.header.setClasses("");
      }
    },
    setMenuPanel: function (index) {
      var label = index ? "_back".loc() : "_logout".loc();
      this.$.menuPanels.setIndex(index);
			// only automatically select the first screen if it's the module menu
      if (!enyo.Panels.isScreenNarrow()) {
        this.$.menuPanels.getActive().select(0);
        this.setContentPanel(0);
      }
      this.$.backButton.setContent(label);
      this.$.refreshButton.setShowing(index);
      this.$.search.setShowing(index);
      this.$.searchIconButton.setShowing(index);
      this.$.contentToolbar.resized();
    },
    setModule: function (index) {
      var module = this.getModules()[index],
        panels = module.panels || [],
        hasSubmenu = module.hasSubmenu !== false && panels.length;
      if (module !== this._selectedModule || enyo.Panels.isScreenNarrow()) {
        this._selectedModule = module;
        if (hasSubmenu) {
          this.$.panelMenu.setCount(panels.length);
          this.$.panelMenu.render();
          this.setMenuPanel(PANEL_MENU);
        } else {
          // if no submenus, treat lke a panel
          this.setContentPanel(index);
        }
      }
    },
    setModules: function (modules) {
      this.modules = modules;
      this.modulesChanged();
    },
    /**
      Renders a list of modules from the root menu.
     */
    setupModuleMenuItem: function (inSender, inEvent) {
      var index = inEvent.index,
        label = this.modules[index].label,
        isSelected = inSender.isSelected(index);
      this.$.moduleItem.setContent(label);
      this.$.moduleItem.addRemoveClass("onyx-selected", isSelected);
      if (isSelected) { this.setModule(index); }
    },
    /**
      Renders the leftbar list of objects within a given module. This function
      is also called when a leftbar item is tapped, per enyo's List conventions.
     */
    setupPanelMenuItem: function (inSender, inEvent) {
      var module = this.getSelectedModule(),
        index = inEvent.index,
        isSelected = inSender.isSelected(index),
        panel = module.panels[index],
        name = panel && panel.name ? module.panels[index].name : "",
        // peek inside the kind to see what the label should be
        kind = panel && panel.kind ? XT.getObjectByName(panel.kind) : null,
        label = kind && kind.prototype.label ? kind.prototype.label : "",
        shortKindName;

      if (!label && kind && kind.prototype.determineLabel) {
        // some of these lists have labels that are dynamically computed,
        // so we can't rely on their being statically defined. We have to
        // compute them in the same way that their create() method would.
        shortKindName = panel.kind.substring(0, panel.kind.length - 4).substring(3);
        label = kind.prototype.determineLabel(shortKindName);

      } else if (!label) {
        label = panel ? panel.label || name : name;
      }

      this.$.listItem.setContent(label);
      this.$.listItem.addRemoveClass("onyx-selected", isSelected);
    },

    /**
      This function is called when a panel is selected. If the selection is valid,
      then the content panel is set for that panel selection.
    */
    panelTap: function (inSender, inEvent) {
      var index = inEvent.index, validIndex = index || index === 0;
      if (validIndex && inSender.isSelected(index)) { // make sure an item in the list was clicked and is selected
        this.setContentPanel(index);
      }
    },

    /**
      This function is called when a module is selected. If the selection is valid,
      then the list of panels is shown for that module.
    */
    menuTap: function (inSender, inEvent) {
      var validIndex = inEvent.index || inEvent.index === 0;
      if (validIndex) { // make sure an item in the list was clicked
        this.setupModuleMenuItem(inSender, inEvent);
      }
    },

    /**
      Error notification, using XV.ModuleContainer notify mechanism
     */
    showError: function (message) {
      var inEvent = {
        originator: this,
        type: XM.Model.CRITICAL,
        message: message
      };
      this.doNotify(inEvent);
    },
    showHelp: function () {
      var listName = this.$.contentPanels.getActive().name,
        objectName = listName.substring(0, listName.length - 4), // get rid of the word "list"
        pageName = objectName.decamelize().replace(/_/g, "-"),
        url = XT.HELP_URL_ROOT + pageName,
        panel = {name: 'help', show: true, url: url};

      this.doNavigatorEvent(panel);
      //window.open(url, "_blank", "width=400,height=600");
    },
    /**
      Displays the history panel.
     */
    showHistory: function (inSender, inEvent) {
      var panel = {name: 'history', show: true};
      this.doNavigatorEvent(panel);
    },
    showListItemMenu: function (inSender, inEvent) {
      var menu = this.$.listItemMenu;

      this._listItemEvent = inEvent;

      // reset the menu based on the list specific to this request
      menu.destroyClientControls();

      // then add whatever actions are applicable
      _.each(inEvent.actions, function (action) {
        var name = action.name,
          isDisabled = !inEvent.actionPermissions[name],
          component = _.find(menu.$, function (value, key) {
            // see if the component has already been created
            return key === name;
          });
        if (component) {
          // if it's already been created just handle state
          component.setDisabled(isDisabled);

        } else {
          // otherwise if we have permissions, make it
          menu.createComponent({
            name: name,
            kind: XV.MenuItem,
            content: action.label || ("_" + name).loc(),
            action: action,
            disabled: isDisabled
          });
        } // else if it doesn't exist and we don't have permissions, do nothing

      });
      menu.render();

      // convoluted code to help us deceive the Menu into thinking
      // that it's part of a MenuDecorator which is inside the
      // list.
      if (!inEvent.originator.hasNode()) {
        inEvent.originator.node = inEvent.originator.eventNode;
      }
      inEvent.originator.generated = true;
      menu.requestMenuShow(this, {activator: inEvent.originator});
      menu.adjustPosition();
    },
    /**
      Displays the advanced search panel.
     */
    showParameters: function (inSender, inEvent) {
      var panel = this.$.contentPanels.getActive();
      this.doNavigatorEvent({name: panel.name, show: true});
    },
    /**
      Displays the My Account popup.
     */
    showMyAccount: function (inSender, inEvent) {
      this.$.myAccountPopup.show();
    },
    /** @private */
    _getModelProperty: function (Klass, prop) {
      var ret = false;
      // Get the key if it's a document model
      if (Klass.prototype[prop]) {
        ret = Klass.prototype[prop];

      // Hopefully it's an info model
      } else if (Klass.prototype.editableModel) {
        Klass = XT.getObjectByName(Klass.prototype.editableModel);
        ret = Klass.prototype[prop];
      }

      return ret;
    }
  });

}());

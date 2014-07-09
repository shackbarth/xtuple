/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true, window:true */

(function () {
  var MODULE_MENU = 0;
  var PANEL_MENU = 1;

  /**
    @name XV.Navigator
    @class Contains a set of panels for navigating the app and modules
    within the app.<br/>
    Navigation within the app is accomplished by elements within the menu
    tool bar, such as history, search, the back button or logout.<br/>
    Navigation within modules in the app is accomplished with a list within
    the panel menu which displays the menu items for each context.<br/>
    The root menu (module menu) contains the list of modules and the logout.<br/>
    Only three menus are cached at one time.<br />
    Layout: Collapsing Arranger.<br />
    Use to implement the high-level container of all business object lists.<br/>
    Derived from <a href="http://enyojs.com/api/#enyo.Panels">enyo.Panels</a>.
    @extends enyo.Panels
    @extends XV.ListMenuManager
   */
  var navigator = /** @lends XV.Navigator# */{
    name: "XV.Navigator",
    kind: "XV.ContainerPanels",
    classes: 'xv-navigator',
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
      panelCache: {},
      actions: [
        {name: "newTabItem", label: "_openNewTab".loc(), method: "newTab", alwaysShowing: true},
        {name: "preferencesItem", label: "_preferences".loc(), method: "openPreferencesWorkspace" },
        {name: "myAccountItem", label: "_changePassword".loc(), method: "showMyAccount"},
        {name: "aboutItem", label: "_about".loc(), method: "showAbout"}
      ],
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
      onMessage: "setMessageContent",
      onParameterChange: "requery",
      onColumnsChange: "changeLayout",
      onItemTap: "itemTap",
      onExportList: "exportList",
      onHotKey: "handleHotKey",
      onPrintList: "printList",
      onPrintSelectList: "printSelectList",
      onReportList: "reportList",
    },
    showPullout: true,
    components: [
      {kind: "FittableRows", name: "navigationMenu", classes: "xv-menu-container", components: [
        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "font.TextIcon", name: "backButton",
            content: "_logout".loc(), ontap: "backTapped", icon: "chevron-left"},
          {kind: "Group", name: "iconButtonGroup", tag: null, components: [
            {kind: "font.TextIcon", name: "historyIconButton",
               icon: "time",
               ontap: "showHistory", content: "_history".loc()},
            {kind: "font.TextIcon", name: "searchIconButton",
               icon: "search", ontap: "showParameters",
               content: "_search".loc(), showing: false},
            {kind: "font.TextIcon", name: "helpIconButton",
               icon: "question",
               ontap: "showHelp", content: "_help".loc()}
          ]},
          {kind: "onyx.MenuDecorator", onSelect: "actionSelected", components: [
            {kind: "font.TextIcon", icon: "cog",
              content: "_actions".loc(), name: "actionButton"},
            {kind: "onyx.Menu", name: "actionMenu", floating: true}
          ]},
          {kind: "onyx.Popup", name: "aboutPopup", centered: true,
            modal: true, floating: true, scrim: true, components: [
            {content: "Copyright xTuple 2014" }, // translation?
            {name: "aboutVersion", allowHtml: true },
            {kind: "onyx.Button", content: "_ok".loc(), ontap: "closeAboutPopup"}
          ]}
        ]},
        {name: "loginInfo", classes: "xv-header"},
        {name: "menuPanels", kind: "Panels", classes: 'xv-panels', draggable: false,
          fit: true, margin: 0, components: [
          {name: "moduleMenu", kind: "List", touch: true, classes: 'xv-navigator-menu',
              onSetupItem: "setupModuleMenuItem", ontap: "menuTap",
              components: [
            {name: "moduleItem", classes: "item enyo-border-box xv-list-item"}
          ]},
          {name: "panelMenu", kind: "List", touch: true, classes: 'xv-navigator-menu',
             onSetupItem: "setupPanelMenuItem", ontap: "panelTap", components: [
            {name: "listItem", classes: "item enyo-border-box xv-list-item"}
          ]},
          {} // Why do panels only work when there are 3+ objects?
        ]}
      ]},
      {kind: "FittableRows", name: "list-view", components: [
				// the onyx-menu-toolbar class keeps the popups from being hidden
        {kind: "onyx.MoreToolbar", name: "contentToolbar",
          classes: "onyx-menu-toolbar", movedClass: "xv-toolbar-moved", components: [
          {kind: "onyx.Grabber", classes: "spacer", unmoveable: true,},
          {name: "rightLabel", classes: "xv-toolbar-label", unmoveable: true,},
          // The MoreToolbar is a FittableColumnsLayout, so this spacer takes up all available space
          {name: "spacer", classes: "spacer", fit: true},
          {kind: "font.TextIcon", name: "backPanelButton", unmoveable: true,
            content: "_back".loc(), ontap: "backPanelTapped", icon: "chevron-left"},
          {kind: "font.TextIcon", name: "refreshButton",
            icon: "rotate-right", content: "_refresh".loc(),
            ontap: "requery", showing: false},
          // Selectable "New" menu which is hidden by default
          {kind: "onyx.MenuDecorator", onSelect: "newRecord", showing: false, name: "newMenuButton", components: [
            {kind: "font.TextIcon", icon: "plus", content: "_new".loc()},
            {kind: "onyx.Menu", name: "newMenu", floating: true}
          ]},
          {kind: "font.TextIcon", icon: "plus",
            content: "_new".loc(), name: "newButton", ontap: "newRecord", showing: false},
          {kind: "font.TextIcon", name: "sortButton", content: "_sort".loc(),
            icon: "sort-by-alphabet", ontap: "showSortPopup", showing: false},
          {kind: "onyx.MenuDecorator", onSelect: "exportSelected", name: "exportButton", components: [
            {kind: "font.TextIcon", icon: "share", content: "_export".loc()},
            {kind: "onyx.Menu", name: "exportMenu", floating: true}
          ]},
          {kind: "XV.SortPopup", name: "sortPopup", showing: false},
          {name: "search", kind: "onyx.InputDecorator",
            showing: false, classes: "xv-search", components: [
            {name: 'searchInput', kind: "onyx.Input",
              placeholder: "_search".loc(), onchange: "inputChanged"},
            {tag: "i", classes: "icon-search", name: "searchJump", ontap: "jump"}
          ]}
        ]},
        {name: "messageHeader"},
        {name: "header", classes: "xv-header"},
        {name: "contentHeader"},
        {name: "contentPanels", kind: "Panels", margin: 0, fit: true,
          draggable: false, panelCount: 0, classes: "scroll-ios"},
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
      var index = this.$.menuPanels.getIndex(),
        context = this,
        action = inEvent.originator.action,
        method = action.method || action.name;

      // Determine if action is coming from a more specific context
      if (action.context) {
        context = this.$.contentPanels.getActive();
      } else if (index && !action.alwaysShowing) {
        context = this.getSelectedModule();
      }
      context[method](inSender, inEvent);
    },
    activate: function () {
      this.setMenuPanel(MODULE_MENU);
    },
    backPanelTapped: function () {
      this.setIndex(0);
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
      If we're on the main menu, then use the navigator actions defined
      in its `actions` property. If we're in a module, then use the module's
      actions.
    */
    buildMenus: function () {
      var actionMenu = this.$.actionMenu,
        exportMenu = this.$.exportMenu,
        newMenu = this.$.newMenu,
        // This is the index of the active panel. All panels
        // that have been selected from the menus have an index of
        // greater than 0. The welcome page has an index of 0.
        idx = this.$.menuPanels.getIndex(),
        activePanel = this.$.contentPanels.getActive(),
        ary = idx ? (this.getSelectedModule().actions || []).concat(this.getActions(true)) : this.getActions(),
        actions = ary.slice(0),
        privileges = XT.session.privileges;

      // HANDLE ACTIONS
      // reset the menu
      actionMenu.destroyClientControls();

      if (idx && activePanel.getNavigatorActions) {
        _.each(activePanel.getNavigatorActions(), function (action) {
          action.context = activePanel;
          actions.push(action);
        });
      }

      // then add whatever actions are applicable to the current context
      _.each(actions, function (action) {
        var name = action.name,
          actPrivs = action.privilege ? action.privilege.split(" ") : [],
          isDisabled = false;

        if (actPrivs.length) {
          isDisabled = !_.some(actPrivs, function (privilege) {
            return privileges.get(privilege);
          });
        }

        actionMenu.createComponent({
          name: name,
          kind: XV.MenuItem,
          content: action.label || ("_" + name).loc(),
          action: action,
          disabled: isDisabled
        });

      });
      actionMenu.render();
      this.$.actionButton.setShowing(actions.length);

      // HANDLE EXPORTS
      actions = [];

      // reset the menu
      exportMenu.destroyClientControls();

      if (idx && activePanel.getExportActions) {
        _.each(activePanel.getExportActions(), function (action) {
          action.context = activePanel;
          actions.push(action);
        });
      }

      // then add whatever actions are applicable to the current context
      _.each(actions, function (action) {
        var name = action.name,
          actPrivs = action.privilege ? action.privilege.split(" ") : [],
          isDisabled = false;

        if (actPrivs.length) {
          isDisabled = !_.some(actPrivs, function (privilege) {
            return privileges.get(privilege);
          });
        }

        exportMenu.createComponent({
          name: name,
          kind: XV.MenuItem,
          content: action.label || ("_" + name).loc(),
          action: action,
          disabled: isDisabled
        });
      });
      exportMenu.render();
      this.$.exportButton.setShowing(actions.length);

      // HANDLE SORT BUTTON
      // if the activepanel is a list of some kind, show the button
      if (activePanel.kindClasses) {
        this.$.sortButton.setShowing(activePanel.kindClasses.indexOf("list") !== -1);
      } else {
        this.$.sortButton.setShowing(false);
      }

      // HANDLE NEW
      actions = [];

      // reset the menu
      newMenu.destroyClientControls();

      // XXX not sure about possible falsy condition of idx here
      if ((idx || idx === 0) && activePanel.getNewActions) {
        _.each(activePanel.getNewActions(), function (action) {
          action.context = activePanel;
          actions.push(action);
        });
      }

      // then add whatever actions are applicable to the current context
      _.each(actions, function (action) {
        newMenu.createComponent({
          name: action.name,
          kind: XV.MenuItem,
          content: action.label || ("_" + action.name).loc(),
          // this item is the payload from the menu item
          // that can be handled differently depending on the list.
          item: action.item,
          defaults: action.defaults,
          allowNew: action.allowNew
        });
      });
      newMenu.render();
    },
    /**
      If there is a parameter widget, send the current list to the
        layout form to build the list of columns.
    */
    buildLayout: function () {
      var list = this.$.contentPanels.getActive(),
        parameterWidget = XT.app ? XT.app.$.pullout.getParameterWidget(list.name) : null;
      if (parameterWidget && parameterWidget.showLayout) {
        parameterWidget.buildColumnList(list);
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
        // only render the most recent (i.e. active) child
        contentPanels.children[2].render();
        panelReference.status = "cached";
        this.getPanelCache()[globalIndex] = panelToCache;
      }
    },
    /**
      When a new column value is selected in the layout panel,
      this value replaces the old attribute value in the list
      field.
    */
    changeLayout: function (inSender, inEvent) {
      var newValue = inEvent.value ? inEvent.value : "",
        order = inEvent.order,
        list = this.$.contentPanels.getActive(),
        // get the current list of attribute kinds
        currentColumns = _.filter(list.$, function (item) {
          return item.kind === "XV.ListAttr";
        });

      // When we get to the current selected list attribute,
      // set the new value in place of the old attribute
      for (var i = 0; i < currentColumns.length; i++) {
        var col = currentColumns[i];
        if (order === (i + 1)) {
          col.setAttr(newValue);
        }
      }

      // requery this list with the new attribute values
      this.requery();

      // rebuild the tree of columns
      this.buildLayout();

      return true; // stop right here
    },
    clearMessage: function () {
      this.$.messageHeader.setContent("");
      this.$.messageHeader.setClasses("");
    },
    closeAboutPopup: function () {
      this.$.aboutPopup.hide();
    },
    create: function () {
      this.inherited(arguments);
      var that = this,
        callback = function () {
          that.buildMenus();
        };

      // If not everything is loaded yet, come back to it later
      if (!XT.session || !XT.session.privileges) {
        XT.getStartupManager().registerCallback(callback);
      } else {
        callback();
      }
    },
    exportSelected: function (inSender, inEvent) {
      var index = this.$.menuPanels.getIndex(),
        context = this,
        action = inEvent.originator.action,
        method = action.method || action.name;

      action.context[method](inSender, inEvent);
    },
    getActions: function (alwaysShowingOnly) {
      var actions = this.actions;
      if (alwaysShowingOnly) {
        actions = _.filter(actions, function (action) {
          return action.alwaysShowing === true;
        });
      }
      return actions;
    },
    getSelectedModule: function () {
      return this._selectedModule;
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
      return true;
    },
    newTab: function () {
      window.open(XT.getOrganizationPath() + '/app', '_newtab');
    },
    openPreferencesWorkspace: function () {
      this.doWorkspace({workspace: "XV.UserPreferenceWorkspace", id: false});
    },
    reportList: function (inSender, inEvent) {
      this.openExportTab('report');
      return true;
    },
    printList: function (inSender, inEvent) {
      var list = this.$.contentPanels.getActive(),
        recordType = list.value.model.prototype.recordType,
        query = JSON.parse(JSON.stringify(list.getQuery())); // clone

      XT.DataSource.callRoute(
        'report?details={"nameSpace":"%@","type":"%@","query":%@,"culture":%@,"print":%@}'
        .f(recordType.prefix(), recordType.suffix(), JSON.stringify(query), JSON.stringify(XT.locale.culture), "true"),
        {},
        {success: function (result) {
          //
          // Here's where we could do a popup for print status
          //
          if (XT.session.config.debugging) {
            XT.log("Print route success, type: ", recordType.suffix());
          }
        },
        error: function (result) {
          if (XT.session.config.debugging) {
            XT.log("Print route error, type: ", recordType.suffix());
          }
        }
        }
      );
      return true;
    },
    printSelectList: function (inSender, inEvent) {
      var list = this.$.contentPanels.getActive(),
        selected = list.getSelection().getSelected();

      _.each(selected, function (value, index) {
        var model = list.getModel(index),
          modelName = model.editableModel || model.recordType,
          reportName = modelName.suffix(),
          details = {
            nameSpace: modelName.prefix(),
            type: modelName.suffix(),
            id: model.id,
            name: reportName,
            culture: XT.locale.culture,
            print: true
          };

        XT.DataSource.callRoute(
          "report?details=%@".f(JSON.stringify(details)),
          {},
          {success: function (result) {
            //
            // Here's where we could do a popup for print status
            //
            if (XT.session.config.debugging) {
              XT.log("Print route success, type: ", modelName.suffix());
            }
          },
          error: function (result) {
            if (XT.session.config.debugging) {
              XT.log("Print route error, type: ", modelName.suffix());
            }
          }
        }
        );
      });
      return true;
    },
    /**
     * If a reportSelectList is needed, here it is.  This will open a browser
     * tab for the first report and new windows for the other reports.
     *
    reportSelectList: function (inSender, inEvent) {
      var list = this.$.contentPanels.getActive(),
        selected = list.getSelection().getSelected();

      _.each(selected, function (value, index) {
        var model = list.getModel(index),
          modelName = model.editableModel || model.recordType,
          reportName = modelName.suffix(),
          details = {
            nameSpace: modelName.prefix(),
            type: modelName.suffix(),
            id: model.id,
            name: reportName,
            culture: XT.locale.culture
          };
        // sending the locale information back over the wire saves a call to the db
        console.log("printing id: " + model.id);
        window.open(XT.getOrganizationPath() +
           "/report?details=%@".f(JSON.stringify(details)), "Print: " + model.id);
      });

      return true;
    },
    */
    openExportTab: function (routeName) {
      var list = this.$.contentPanels.getActive(),
        recordType = list.value.model.prototype.recordType,
        query = JSON.parse(JSON.stringify(list.getQuery())); // clone

      delete query.rowLimit;
      delete query.rowOffset;

      // sending the locale information back over the wire saves a call to the db
      window.open(XT.getOrganizationPath() +
        '/%@?details={"nameSpace":"%@","type":"%@","query":%@,"culture":%@,"print":%@}'
        .f(routeName,
          recordType.prefix(),
          recordType.suffix(),
          JSON.stringify(query),
          JSON.stringify(XT.locale.culture),
          "false"),
        '_newtab');
    },
    showSortPopup: function (inSender, inEvent) {
      this.$.sortPopup.setList(this.$.contentPanels.getActive());
      this.$.sortPopup.setNav(this);
      this.$.sortPopup.setPickerStrings();
      this.$.sortPopup.show();
    },

    /**
      Fetch a list.
     */
    fetch: function (options) {
      options = options ? _.clone(options) : {};
      var list = this.$.contentPanels.getActive(),
        name = list ? list.name : "",
        query,
        input,
        parameterWidget,
        parameters,
        filterDescription;

      // in order to continue to the fetch, this needs to be a list
      // or a dashboard

      if (!(list instanceof XV.List) && !(list instanceof XV.Dashboard) && !(list instanceof XV.Listboard)) { return; }

      query = list.getQuery() || {};
      input = this.$.searchInput.getValue();

      // if the "list" doesn't allow dynamic searching, skip this
      // Dashboards have an allowFilter of false
      if (list.allowFilter) {
        parameterWidget = XT.app ? XT.app.$.pullout.getParameterWidget(name) : null;
        parameters = parameterWidget ? parameterWidget.getParameters() : [];
        options.showMore = _.isBoolean(options.showMore) ?
          options.showMore : false;

        // Get information from filters and set description
        filterDescription = this.formatQuery(parameterWidget ? parameterWidget.getSelectedValues() : null, input);
        list.setFilterDescription(filterDescription);
        this.setHeaderContent(filterDescription);

        delete query.parameters;
        // Build parameters
        if (input || parameters.length) {
          query.parameters = [];

          // Input search parameters
          if (input) {
            query.parameters.push({
              attribute: list.getSearchableAttributes(),
              operator: 'MATCHES',
              value: this.$.searchInput.getValue()
            });
          }

          // Advanced parameters
          if (parameters) {
            query.parameters = query.parameters.concat(parameters);
          }
        }

        // if there is a parameter widget for this list, build the columns
        if (parameterWidget && parameterWidget.showLayout) {
          this.buildLayout();
        }
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
    handleHotKey: function (inSender, inEvent) {
      var destinationIndex,
        isWelcome = this.getSelectedModule().name === 'welcome',
        currentIndex,
        keyCode = inEvent.keyCode;

      // numbers navigate to the nth menu option
      if (keyCode >= 49 && keyCode <= 57) {
        destinationIndex = keyCode - 49;
        if (isWelcome) {
          this.setModule(Math.min(destinationIndex, this.getModules().length - 1));
        } else {
          this.setContentPanel(Math.min(destinationIndex, this.getSelectedModule().panels.length - 1));
        }
        return;

      } else if (!isWelcome) {
        currentIndex = this.$.panelMenu.getSelection().lastSelected;
        if (keyCode === 38) {
          this.setContentPanel(Math.max(currentIndex - 1, 0));
          return;
        } else if (keyCode === 40) {
          this.setContentPanel(Math.min(currentIndex + 1, this.getSelectedModule().panels.length - 1));
          return;
        }
      }

      switch(String.fromCharCode(keyCode)) {
      case 'A':
        this.showParameters();
        break;
      case 'B':
        this.backTapped();
        break;
      case 'H':
        this.showHelp();
        break;
      case 'N':
        this.newRecord({}, {originator: {}});
        break;
      case 'R':
        this.requery();
        break;
      }
    },
    inputChanged: function (inSender, inEvent) {
      this.fetched = {};
      this.fetch();
    },
    /**
       Drills down into a workspace if a user clicks a list item.
    */
    itemTap: function (inSender, inEvent) {
      var workspace = inEvent.originator.getWorkspace(),
        model = inEvent.model,
        canNotRead = model.couldRead ? !model.couldRead() : !model.getClass().canRead(),
        id = model && model.id ? model.id : false;

      // Check privileges first
      if (canNotRead) {
        this.showError("_insufficientViewPrivileges".loc());
        return true;
      }

      // Bubble requset for workspace view, including the model id payload
      if (workspace) {
        this.doWorkspace({workspace: workspace, id: id});
      }
      return true;
    },
    jump: function () {
      var list = this.$.contentPanels.getActive(),
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
        item = inEvent.originator.item,
        defaults = inEvent.originator.defaults,
        allowNew = inEvent.originator.allowNew,
        Model,
        canCreate,
        callback;

      // This list is actually a dashboard so the item
      // will be a type of chart added to the dashboard
      if (list instanceof XV.Dashboard && item) {
        list.newRecord(item);
        return true;
      }

      if (list instanceof XV.Listboard && item) {
        list.newRecord(item);
        return true;
      }

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

      if (workspace) {
        var params = {};
        this.doWorkspace({
          workspace: workspace,
          attributes: defaults,
          allowNew: allowNew === false ? false : true
        });
      }

      // In addition to preventing Enyo event propagation,
      // we need to prevent propagation of DOM events to support
      // mobile browsers and long button clicks
      // check to make sure this is a button click before calling inEvent function
      if (inEvent && inEvent.preventDefault) {
        inEvent.preventDefault();
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
        contentHeader = this.$.contentHeader,
        panel,
        label,
        collection,
        model,
        canNotCreate = true;

      this.clearMessage();
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
      this.$.searchIconButton.setShowing(!!panel.parameterWidget);
      this.doNavigatorEvent({name: panel.name, show: false});

      // Handle new button
      this.$.newButton.setShowing(panel.canAddNew && !panel.newActions);
      this.$.newMenuButton.setShowing(panel.canAddNew && panel.newActions);

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

      this.buildMenus();
      this.$.contentToolbar.resized();

      contentHeader.destroyClientControls();
      if (panel.headerComponents) {
        contentHeader.createComponents(panel.headerComponents);
        contentHeader.render();
      }

      // If this is a mobile device and we're not selecting
      // the welcome screen.
      if (enyo.Panels.isScreenNarrow() && panelIndex) {
        this.next();
      }
    },

    /**
      The header content typically describes to the user the particular query filter in effect.
     */
    setHeaderContent: function (content) {
      this.$.header.setShowing(!!content);
      this.$.header.setContent(content);
    },
    setMenuPanel: function (index) {
      var label = index ? "_back".loc() : "_logout".loc();
      this.$.menuPanels.setIndex(index);
      this.$.menuPanels.getActive().select(0);
      this.setContentPanel(0);
      // this causes the gear menu to reload when the module
      // is chosen, rather than just when a content panel is selected
      this.buildMenus();

      this.$.backButton.setContent(label);
      this.$.backPanelButton.setContent(label);
      this.$.backPanelButton.setShowing(enyo.Panels.isScreenNarrow());
      this.$.refreshButton.setShowing(index);
      // TODO: do not show search on small devices
      //this.$.search.setShowing(index && !enyo.Panels.isScreenNarrow());
      this.$.search.setShowing(index);
      this.$.contentToolbar.resized();
    },
    setMessageContent: function (inSender, inEvent) {
      var content = inEvent.message;
      this.$.messageHeader.setContent(content);
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
          this.setContentPanel(0);
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
      this.$.moduleItem.setAttribute("menubar_name", this.modules[index].name);
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
      this.$.listItem.setAttribute("menubar_name", name);
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
    showAbout: function () {
      this.$.aboutPopup.show();
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
      var listName,
        culture,
        objectName,
        pageName,
        url,
        panel;

      listName = this.$.contentPanels.getActive().name;
      culture = XT.locale.culture;
      objectName = (listName.indexOf("List") >= 0 || listName.indexOf("Page") >= 0) ?
        listName.substring(0, listName.length - 4) : // get rid of the word "List" or "Page"
        listName;
      objectName = objectName.indexOf("_") >= 0 ?
        objectName.substring(1 + objectName.indexOf("_")) : // strip out underscore-terminated-prefixes
        objectName;
      pageName = objectName.decamelize().replace(/_/g, "-");
      url = XT.HELP_URL_ROOT + pageName + "?culture=" + culture;
      panel = {name: 'help', show: true, url: url};

      this.doNavigatorEvent(panel);
    },
    /**
      Displays the history panel.
     */
    showHistory: function (inSender, inEvent) {
      var panel = {name: 'history', show: true};
      this.doNavigatorEvent(panel);
    },
    /**
      Displays the advanced search panel.
     */
    showParameters: function (inSender, inEvent) {
      var list = this.$.contentPanels.getActive();
      this.doNavigatorEvent({name: list.name, show: true});
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
  };

  enyo.mixin(navigator, XV.ListMenuManagerMixin);
  enyo.kind(navigator);

}());

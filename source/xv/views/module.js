/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.Module",
    kind: "Panels",
    label: "",
    classes: "app enyo-unselectable",
    events: {
      onInfoListAdded: "",
      onTogglePullout: ""
    },
    handlers: {
      onParameterChange: "requery",
      onInfoListRowTapped: "infoListRowTapped"
    },
    showPullout: true,
    realtimeFit: true,
    arrangerKind: "CollapsingArranger",
    selectedList: 0, // used for "new", to know what list is being shown
    components: [
      {kind: "FittableRows", classes: "left", components: [
        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "onyx.Button", content: "_back".loc(), ontap: "showDashboard"},
          {kind: "Group", name: "iconButtonGroup", defaultKind: "onyx.IconButton", tag: null, components: [
            {name: "searchIconButton", src: "assets/menu-icon-search.png", ontap: "showParameters"},
            {name: "historyIconButton", src: "assets/menu-icon-bookmark.png", ontap: "showHistory"}
          ]},
          {name: "leftLabel"}
        ]},
        {name: "menu", kind: "List", fit: true, touch: true,
           onSetupItem: "setupItem", components: [
          {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", components: [
        {kind: "onyx.MoreToolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {name: "rightLabel", style: "text-align: center"},
          {kind: "onyx.Button", content: "_logout".loc(), ontap: "warnLogout",
            style: "float: right;"},
          {kind: "onyx.InputDecorator", style: "float: right;", components: [
            {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
              placeholder: "Search", onchange: "inputChanged"},
            {kind: "Image", src: "assets/search-input-search.png"}
          ]},
          {kind: "onyx.Button", content: "_new".loc(), ontap: "newRecord",
            style: "float: right;" },
          {kind: "onyx.Popup", name: "logoutPopup", centered: true,
            modal: true, floating: true, components: [
            {content: "_logoutConfirmation".loc() },
            {tag: "br"},
            {kind: "onyx.Button", content: "_ok".loc(), ontap: "logout"},
            {kind: "onyx.Button", content: "_cancel".loc(),
              ontap: "closeLogoutPopup", classes: "onyx-blue"}
          ]}
        ]},
        {name: "lists", kind: "Panels", arrangerKind: "LeftRightArranger",
           margin: 0, fit: true, onTransitionFinish: "didFinishTransition"}
      ]},
      {kind: "Signals", onModelSave: "refreshInfoObject"}
    ],
    firstTime: true,
    fetched: {},
    // menu
    setupItem: function (inSender, inEvent) {
      var list = this.lists[inEvent.index].name;
      this.$.item.setContent(this.$.lists.$[list].getLabel());
      this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
    },
    didBecomeActive: function () {
      if (this.firstTime) {
        this.firstTime = false;
        this.setList(0);
      }
    },
    didFinishTransition: function (inSender, inEvent) {
      this.setList(inSender.index);
    },
    create: function () {
      var i, component;
      this.inherited(arguments);
      this.$.leftLabel.setContent(this.label);
      // Build lists
      for (i = 0; i < this.lists.length; i++) {
        component = this.$.lists.createComponent(this.lists[i]);
        this.doInfoListAdded(component);
      }
      this.$.menu.setCount(this.lists.length);
    },
    infoListRowTapped: function (inSender, inEvent) {
      var list = this.$.lists.getActive(),
        workspace = list.getWorkspace(),
        id = list.getModel(inEvent.index).id;

      // Transition to workspace view, including the model as a payload
      this.bubble("workspace", {
        eventName: "workspace",
        workspace: workspace,
        id: id
      });
      return true;
    },
    inputChanged: function (inSender, inEvent) {
      var index = this.$.lists.getIndex(),
        list = this.lists[index].name;
      this.fetched = {};
      this.fetch(list);
    },
    itemTap: function (inSender, inEvent) {
      this.setList(inEvent.index);
    },
    setList: function (index) {
      if (this.firstTime) { return; }
      var list = this.lists[index].name;

      // Select menu
      if (!this.$.menu.isSelected(index)) {
        this.$.menu.select(index);
      }

      // keep the selected list in state as a kind variable
      this.selectedList = index;

      // Select list
      if (this.$.lists.getIndex() !== index) {
        this.$.lists.setIndex(index);
      }
      this.$.rightLabel.setContent(this.$.lists.$[list].getLabel());
      if (!this.fetched[list]) {
        this.fetch(list);
      }
    },
    fetch: function (name, options) {
      name = name || this.$.lists.getActive().name;
      var list = this.$.lists.$[name],
        query = list.getQuery() || {},
        input = this.$.searchInput.getValue(),
        parameterWidget = XT.app.$.pullout.getItem(name),
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
      this.fetched[name] = true;
    },
    newRecord: function (inSender, inEvent) {
      var list = this.$.lists.getActive(),
        workspace = list.getWorkspace();
      this.bubble("workspace", {
        eventName: "workspace",
        workspace: workspace
      });
      return true;
    },
    requery: function (inSender, inEvent) {
      this.fetch();
    },
    showDashboard: function () {
      this.bubble("dashboard", {eventName: "dashboard"});
    },
    showHistory: function (inSender, inEvent) {
      var panel = {name: 'history'};
      this.doTogglePullout(panel);
    },
    showParameters: function (inSender, inEvent) {
      var panel = this.$.lists.getActive();
      this.doTogglePullout(panel);
    },
    /**
     * If a model has changed, check the lists of this module to see if we can
     * update the info object in the list.
     * XXX if there are multiple modules alive then all of them will catch
     * XXX the signal, which isn't ideal for performance
     */
    refreshInfoObject: function (inSender, inPayload) {
      // obnoxious massaging. Can't think of an elegant way to do this.
      // salt in wounds: in setup we massage by adding List on the end, but with
      // crm we massage by adding InfoList on the end. This is horrible.
      // XXX not sustainable
      var listBase = XV.util.stripModelNamePrefix(inPayload.recordType).camelize(),
        listName = this.name === "setup" ? listBase + "List" : listBase + "InfoList",
        list = this.$.lists.$[listName];


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
     * Logout management. We show the user a warning popup before we log them out.
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
     * Manually set one of the icon buttons to be active. Note passing null
     * as the parameter will disactivate all icons.
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

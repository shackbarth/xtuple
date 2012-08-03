/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {
  var ROWS_PER_FETCH = 50,
    FETCH_TRIGGER = 100;

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
      onScroll: "didScroll",
      onInfoListRowTapped: "doInfoListRowTapped"
    },
    showPullout: true,
    realtimeFit: true,
    arrangerKind: "CollapsingArranger",
    selectedList: 0, // used for "new", to know what list is being shown
    components: [
      {kind: "FittableRows", classes: "left", components: [
        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "onyx.Button", content: "_back".loc(), ontap: "showDashboard"},
          {kind: "Group", defaultKind: "onyx.IconButton", tag: null, components: [
            {src: "images/menu-icon-search.png", ontap: "showParameters"},
            {src: "images/menu-icon-bookmark.png", ontap: "showHistory"}
          ]},
          {name: "leftLabel"}
        ]},
        {name: "menu", kind: "List", fit: true, touch: true,
           onSetupItem: "setupItem", components: [
          {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", components: [
        {kind: "FittableColumns", noStretch: true,
           classes: "onyx-toolbar onyx-toolbar-inline", components: [
          {kind: "onyx.Grabber"},
          {kind: "Scroller", thumb: false, fit: true, touch: true,
             vertical: "hidden", style: "margin: 0;", components: [
            {classes: "onyx-toolbar-inline", style: "white-space: nowrap;"},
            {name: "rightLabel", style: "text-align: center"}
          ]},
          {kind: "onyx.Button", content: "_new".loc(), ontap: "newWorkspace" },
          {kind: "onyx.InputDecorator", components: [
            {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
              placeholder: "Search", onchange: "inputChanged"},
            {kind: "Image", src: "images/search-input-search.png"}
          ]},
          {kind: "onyx.Button", content: "_logout".loc(), ontap: "warnLogout" },
          {
            name: "logoutWarningPopup",
            classes: "onyx-sample-popup",
            kind: "onyx.Popup",
            centered: true,
            modal: true,
            floating: true,
            components: [
              { content: "Are you sure you want to log out?" },
              { tag: "br"},
              { kind: "onyx.Button", content: "Yes, logout", ontap: "logout" },
              { kind: "onyx.Button", content: "No, don't logout.", ontap: "closeLogoutWarningPopup" }

            ]
          }
        ]},
        {name: "lists", kind: "Panels", arrangerKind: "LeftRightArranger",
           margin: 0, fit: true, onTransitionFinish: "didFinishTransition"}
      ]},
      {kind: "Signals", onModelSave: "doRefreshInfoObject"}
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
    didScroll: function (inSender, inEvent) {
      if (inEvent.originator.kindName !== "XV.InfoListPrivate") { return; }
      var list = inEvent.originator,
        max = list.getScrollBounds().maxTop - list.rowHeight * FETCH_TRIGGER,
        options = {};
      if (list.getIsMore() && list.getScrollPosition() > max && !list.getIsFetching()) {
        list.setIsFetching(true);
        options.showMore = true;
        this.fetch(list.owner.name, options);
      }
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
            attribute: list.getCollection().model.getSearchableAttributes(),
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

      if (options.showMore) {
        query.rowOffset += ROWS_PER_FETCH;
        options.add = true;
      } else {
        query.rowOffset = 0;
        query.rowLimit = ROWS_PER_FETCH;
      }
      list.setQuery(query);
      list.fetch(options);
      this.fetched[name] = true;
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
     * Catches the tap event from the {XV.InfoListRow}
     * and repackages it into a carousel event to be
     * caught further up.
    */
    doInfoListRowTapped: function (inSender, inEvent) {
      //
      // Determine which item was tapped
      //
      var listIndex = this.$.lists.index;
      var tappedList = this.$.lists.children[listIndex];

      var itemIndex = inEvent.index;
      var tappedModel = tappedList.collection.models[itemIndex];

      //
      // Bubble up an event so that we can transition to workspace view.
      // Add the tapped model as a payload in the event
      //
      this.bubble("workspace", {eventName: "workspace", options: tappedModel });
      return true;
    },
    newWorkspace: function (inSender, inEvent) {
      var modelType = this.$.lists.controls[this.selectedList].query.recordType;
      var emptyModel = new XM[XV.util.formatModelName(modelType)]();
      emptyModel.initialize(null, { isNew: true });
      this.bubble("workspace", {eventName: "workspace", options: emptyModel });
    },

    /**
     * If a model has changed, check the lists of this module to see if we can
     * update the info object in the list.
     * XXX if there are multiple modules alive then all of them will catch
     * XXX the signal, which isn't ideal for performance
     */
    doRefreshInfoObject: function (inSender, inPayload) {
      // obnoxious massaging. Can't think of an elegant way to do this.
      // salt in wounds: in setup we massage by adding List on the end, but with
      // crm we massage by adding InfoList on the end. This is horrible.
      // XXX not sustainable
      var listBase = XV.util.stripModelNamePrefix(inPayload.recordType).camelize(),
        listName = this.name === "setup" ? listBase + "List" : listBase + "InfoList",
        list = this.$.lists.$[listName];
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
      this.$.logoutWarningPopup.show();
    },
    closeLogoutWarningPopup: function () {
      this.$.logoutWarningPopup.hide();
    },
    logout: function () {
      this.$.logoutWarningPopup.hide();
      XT.session.logout();
    }

  });

}());

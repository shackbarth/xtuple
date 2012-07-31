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
    handlers: {
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
            {src: "images/menu-icon-search.png", panel: "parameterWidget", ontap: "showParameters"},
            {src: "images/menu-icon-bookmark.png", panel: "history", ontap: "showHistory"}
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
          ]}
        ]},
        {name: "lists", kind: "Panels", arrangerKind: "LeftRightArranger",
           margin: 0, fit: true, onTransitionFinish: "didFinishTransition"}
      ]}
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
        this.bubble("onInfoListAdded", component);
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
      var list = this.$.lists.$[name],
        query = list.getQuery() || {},
        input = this.$.searchInput.getValue(),
        parameterWidget = XT.app.$.pulloutItems.$[name],
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
    showDashboard: function () {
      this.bubble("dashboard", {eventName: "dashboard"});
    },
    showHistory: function (inSender, inEvent) {
      var panel = {name: 'history'};
      this.bubble("onTogglePullout", panel);
    },
    showParameters: function (inSender, inEvent) {
      var panel = this.$.lists.getActive();
      this.bubble("onTogglePullout", panel);
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
      this.bubble("workspace", {eventName: "workspace", options: emptyModel });

    },
    /**
     * Populates the history dropdown with the components of the XT.history array
     */
    fillHistory: function () {

      var i;

      /**
       * Clear out the history menu
       */
      XV.util.removeAllChildren(this.$.historyMenu);

      for (i = 0; i < XT.getHistory().length; i++) {
        var historyItem = XT.getHistory()[i];
        this.$.historyMenu.createComponent({
          content: historyItem.modelType + ": " + historyItem.modelName,
          modelType: historyItem.modelType,
          modelId: historyItem.modelId
        });
      }
      this.$.historyMenu.render();
    },
    /**
     * When a history item is selected we bubble an event way up the application.
     * Note that we create a sort of ersatz model to mimic the way the handler
     * expects to have a model with the event to know what to drill down into.
     */
    doHistoryItemSelected: function (inSender, inEvent) {
      var modelId = inEvent.originator.modelId;
      var modelType = inEvent.originator.modelType;
      var modelShell = { recordType: modelType, id: modelId };
      XT.log("Load from history: " + modelType + " " + modelId);
      this.bubble("workspace", {eventName: "workspace", options: modelShell });
    }


  });

}());

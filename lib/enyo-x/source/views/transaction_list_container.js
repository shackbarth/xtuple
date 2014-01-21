/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true */

(function () {

  /**
    Expected to a have a parameter widget that contains an order and
    a transaction date.

    @name XV.TransactionListContainer
    @extends XV.SearchContainer
   */
  var transactionListContainer =  /** @lends XV.TransactionListContainer# */ {
    name: "XV.TransactionListContainer",
    kind: "XV.GridPanels",
    published: {
      prerequisite: "",
      notifyMessage: "",
      list: null,
      actions: null,
      transactionDate: null,
      model: null,
      callback: null
    },
    events: {
      onPrevious: "",
      onWorkspace: ""
    },
    handlers: {
      onListItemMenuTap: "showListItemMenu",
      onParameterChange: "requery",
      onProcessingChanged: "processingChanged",
      onSelectionChanged: "selectionChanged"
    },
    init: false,
    components: [
      {name: "parameterPanel", kind: "FittableRows", classes: "left",
        components: [
        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "onyx.Button", name: "backButton", content: "_back".loc(), ontap: "close"},
          {kind: "onyx.MenuDecorator", style: "margin: 0;",
            onSelect: "actionSelected", components: [
            {kind: "XV.IconButton", src: "/assets/menu-icon-gear.png",
              content: "_actions".loc(), name: "actionButton"},
            {kind: "onyx.Menu", name: "actionMenu"}
          ]}
        ]},
        {kind: "Scroller", name: "parameterScroller"}
      ]},
      {name: "listPanel", kind: "FittableRows", components: [
        // the onyx-menu-toolbar class keeps the popups from being hidden
        {kind: "onyx.MoreToolbar", name: "contentToolbar",
          classes: "onyx-menu-toolbar", movedClass: "xv-toolbar-moved", components: [
          {name: "rightLabel", content: "_search".loc(), classes: "xv-toolbar-label"},
          {name: "spacer", content: "", fit: true},
          {kind: "onyx.Button", name: "printButton", showing: false,
            content: "_print".loc(), onclick: "print"},
          {kind: "onyx.Button", name: "refreshButton", disabled: false,
            content: "_refresh".loc(), onclick: "requery"},
          {kind: "onyx.Button", name: "postButton",
            disabled: true, classes: "save", showing: false,
            content: "_post".loc(), onclick: "post"},
          {name: "listItemMenu", kind: "onyx.Menu", floating: true,
            onSelect: "listActionSelected", maxHeight: 500}
        ]},
        {name: "contentPanels", kind: "Panels", margin: 0, fit: true, draggable: false,
          panelCount: 0},
        {kind: "onyx.Popup", name: "spinnerPopup", centered: true,
            modal: true, floating: true, scrim: true,
            onHide: "popupHidden", components: [
          {kind: "onyx.Spinner"},
          {name: "spinnerMessage", content: "_processing".loc() + "..."}
        ]}
      ]}
    ],
    actionSelected: function (inSender, inEvent) {
      var action = inEvent.originator.action,
        method = action.method || action.name;
      this[method](inSender, inEvent);
    },
    close: function () {
      var callback = this.getCallback();
      
      this.doPrevious();
      if (callback) { callback(); }
    },
    buildMenu: function () {
      if (!this.getActions()) {
        return;
      }
      var actionMenu = this.$.actionMenu,
        actions = this.getActions().slice(0),
        that = this;

      // reset the menu
      actionMenu.destroyClientControls();

      // then add whatever actions are applicable
      _.each(actions, function (action) {
        var name = action.name,
          prerequisite = action.prerequisite,
          isDisabled = prerequisite ? !that[prerequisite]() : false;
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
    },
    create: function () {
      this.inherited(arguments);
      var disabled = !XT.session.privileges.get("AlterTransactionDates"),
        parameterWidget;
      this.setList({list: this.getList()});
      parameterWidget = this.$.parameterWidget;
      parameterWidget.$.transactionDate.$.input.setDisabled(disabled);
      if (!this.getActions()) {
        this.setActions([]);
      }
      this.buildMenu();
      this.$.contentToolbar.resized();
    },
    fetch: function (options) {
      if (!this.init) { return; }
      options = options ? _.clone(options) : {};
      var list = this.$.list,
        query,
        parameterWidget,
        parameters;
      if (!list) { return; }
      query = list.getQuery() || {};
      parameterWidget = this.$.parameterWidget;
      parameters = parameterWidget && parameterWidget.getParameters ?
        parameterWidget.getParameters() : [];
      options.showMore = _.isBoolean(options.showMore) ?
        options.showMore : false;

      // Build conditions
      if (parameters.length) {
        query.parameters = parameters;
      } else {
        delete query.parameters;
      }
      list.setQuery(query);
      list.fetch(options);
    },
    /**
      Capture order changed and transaction date changed events.
      Depends on a very specific implementation of parameter widget
      that includes `order` and `transactionDate` parameters.
    */
    parameterChanged: function (inSender, inEvent) {
      var originator = inEvent ? inEvent.originator : false,
        name = originator ? originator.name : false,
        that = this,
        options,
        value;

      if (name === "transactionDate") {
        value = originator.$.input.getValue();
        value = XT.date.applyTimezoneOffset(value, true);
        value = XT.date.toMidnight(value);
        this.setTransactionDate(value);
        this.buildMenu();
        return;
      } else if (name === "order") {
        value = originator.getParameter().value;
        this.setModel(value);
        this.buildMenu();
      } else if (name === "shipment") {
        return;
      }

      options = {
        success: function () {
          that.selectionChanged();
        }
      };
      this.fetch(options);
    },
    popupHidden: function (inSender, inEvent) {
      if (!this._popupDone) {
        inEvent.originator.show();
      }
    },
    processingChanged: function (inSender, inEvent) {
      if (inEvent.isProcessing) {
        this.spinnerShow();
      } else {
        this.requery();
        this.spinnerHide();
      }
    },
    /**
      Overload: Piggy back on existing handler for `onParameterChanged event`
      by forwarding this requery to `parameterChanged`.
    */
    requery: function (inSender, inEvent) {
      this.parameterChanged(inSender, inEvent);
      return true;
    },
    /**
      Whenever a user makes a selection, rebuild the menu
      and set the transaction date on the selected models
      to match what has been selected here.
    */
    selectionChanged: function () {
      this.transactionDateChanged();
      this.buildMenu();
    },
    /**
      @param {Object} Options
      @param {String} [options.list] Class name
    */
    setList: function (options) {
      var component,
      list = options.list;

      component = this.createComponent({
        name: "list",
        container: this.$.contentPanels,
        kind: list,
        fit: true
      });
      this.$.rightLabel.setContent(component.label);
      if (component) {
        this.createComponent({
          name: "parameterWidget",
          classes: "xv-groupbox xv-parameter",
          showSaveFilter: false,
          showLayout: false,
          defaultParameters: null,
          container: this.$.parameterScroller,
          kind: component.getParameterWidget(),
          memoizeEnabled: false,
          fit: true
        });
      }

      this.init = true;
      this.render();
    },
    spinnerHide: function () {
      this._popupDone = true;
      this.$.spinnerPopup.hide();
    },
    spinnerShow: function () {
      this._popupDone = false;
      this.$.spinnerPopup.show();
    },
    transactionDateChanged: function () {
      var transDate = this.getTransactionDate(),
        collection = this.$.list.getValue(),
        i;

      // Update the transaction dates on all models to match
      // What has been selected
      for (i = 0; i < collection.length; i++) {
        collection.at(i).transactionDate = transDate;
      }
    }
  };

  enyo.mixin(transactionListContainer, XV.ListMenuManagerMixin);
  enyo.kind(transactionListContainer);

}());

/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XT:true, XV:true, _:true */

(function () {

  var _historyPanelIndex = 0;
  var _helpPanelIndex = 1;

  /**
   @name XV.Pullout
   @class Derived from <a href="http://enyojs.com/api/#enyo.Slideable">enyo.Slideable</a>.
   @extends enyo.Slideable
   */
  enyo.kind(
    /** @lends XV.Pullout# */{
    name: "XV.Pullout",
    kind: "enyo.Slideable",
    classes: "xv-pullout",
    value: -100,
    min: -100,
    unit: '%',
    events: {
      onHistoryItemSelected: ""
    },
    published: {
      selectedPanel: ""
    },
    components: [
      {name: "containerPanels", kind: "enyo.Panels", style: "height: 100%", draggable: false, components: [
        {name: "history", components: [
          {classes: "xv-header", content: "_history".loc()},
          {kind: "XV.ScrollableGroupbox", classes: "history-panel", components: [
            {kind: "Repeater", name: "historyList",
              onSetupItem: "setupHistoryItem", count: 0, components: [
              {name: "historyItem"}
            ]}
          ]}
        ]},
        {name: "help", components: [
          {classes: "xv-header", content: "_help".loc()},
          {tag: "iframe", name: "helpPage", attributes: {height: "90%"}, classes: "help-panel"}
        ]}
      ]}
    ],
    /**
      A parameter widget has been passed to us in an event. Make sure that the payload of the
      event gets added to our pullout items.

      @param {Object} inEvent
      @param {Function} inEvent.getParameterWidget Returns the *string* name of the parameter widget
     */
    addPulloutItem: function (inSender, inEvent) {
      var widgetName = inEvent.getParameterWidget();
      if (widgetName) {
        this._parameterWidgets[inEvent.name] = {
          name: inEvent.name,
          kind: widgetName,
          container: this.$.container
        };
      }
    },
    /**
      Tries to pre-populate the history list from a cookie if present
     */
    create: function () {
      this.inherited(arguments);
      this._parameterWidgets = {};
      var that = this,
        callback = function () {
          that.preLoadHistory();
        };

      XT.getStartupManager().registerCallback(callback, true);
    },
    createSearchPanel: function (item) {
      var panel = this.$.containerPanels.createComponent(
        {kind: "XV.ScrollableGroupbox", name: item.name + "Scroller", components: [
          {classes: "xv-header", content: "_advancedSearch".loc()},
          item
        ]}
      );
      panel.render();
      this.$.containerPanels.reflow();
      this.$.containerPanels.setIndex(this.$.containerPanels.getPanels().length - 1);
      return panel;
    },
    preLoadHistory: function () {
      var dbName = XT.session.details.organization,
        cookieValue = enyo.getCookie("history_" + dbName),
        historyArray,
        i,
        historyItem,
        mockModel = {},
        getValue = function () {
          return historyItem.modelName;
        },
        get = function () {
          return historyItem.modelId;
        };

      if (!cookieValue || cookieValue === 'undefined') {
        // There's no cookie yet for this parameter list
        return;
      }

      historyArray = JSON.parse(cookieValue);

      // Running through the array backwards allows us to preserve the
      // reverse chronology of the history list.
      for (i = historyArray.length - 1; i >= 0; i--) {
        historyItem = historyArray[i];
        // The mock model we create here is built to fool XT.addToHistory
        // into thinking it's a real model. This code is fragile to any
        // change in that function.
        mockModel.recordType = historyItem.modelType;
        mockModel.getValue = getValue;
        mockModel.get = get;
        XT.addToHistory(historyItem.workspaceType, mockModel);
      }
      this.refreshHistoryList();
    },
    /**
      Return the parameter widget of the requested name, if it has been created.
     */
    getParameterWidget: function (name) {
      // if the parameter widget don't exist, create it
      if (!this.$.containerPanels.$[name]) {
        var item = this._parameterWidgets[name];
        if (item) {
          this.createSearchPanel(item);
        }
      }
      return this.$.containerPanels.$[name];
    },
    /**
      Refreshes the history list.
     */
    refreshHistoryList: function () {
      this.$.historyList.setCount(XT.getHistory().length);
    },
    setupHistoryItem: function (inSender, inEvent) {
      var historyItem = inEvent.item.$.historyItem;
      var historyData = XT.getHistory()[inEvent.index];
      var modelTypeShow = ("_" + historyData.modelType.suffix().camelize()).loc();
      this.createComponent({
        container: historyItem,
        classes: "xv-list-item enyo-border-box",
        ontap: "doHistoryItemSelected",
        content: modelTypeShow + ": " + historyData.modelName,
        modelType: historyData.modelType,
        id: historyData.modelId,
        workspace: historyData.workspaceType
      });
    },
    /**

      Sets the pullout to be the appropriate panel (either history or
      the apppropriate advanced search). May or may not show the panel,
      depending on inEvent.show.

      @param {Object} inSender
      @param {Object} inEvent
      @param {String} inEvent.name The name of the panel, or the word "history" or "help"
      @param {Boolean} inEvent.show Whether or not we want to show the panel
    */
    togglePullout: function (inSender, inEvent) {
      // Note that if you show history, then move to a list with a panel, then pull the
      // pullout, it will show the advanced search and not history.
      var name = inEvent.name,
        item = this._parameterWidgets[name],
        child,
        forceMin = this.isAtMax() && this.getSelectedPanel() === name;
      if (!item && !_.contains(["history", "help"], name)) {
        // if we've moved to a list with no advanced search and pull the pullout
        // again show history instead.
        name = 'history';

        if (!inEvent.show) {
          // nothing to see here.
          // for example, the user has backed out into the main splash screen
          // just pull back the pullout
          // but we do want the pullout to be set at "history" in case it gets
          // drawn next for a list with no advanced search
          forceMin = true;
        }
      }

      // keep track of the current panel name for internal use
      this.setSelectedPanel(name);

      if (name === 'history') {
        // show the history panel
        this.$.containerPanels.setIndex(_historyPanelIndex);

      } else if (name === 'help') {
        // show the help panel
        if (inEvent.url) {
          this.$.helpPage.setAttribute("src", inEvent.url);
        }
        this.$.containerPanels.setIndex(_helpPanelIndex);

      } else {
        // show the advanced search panel
        if (inEvent.show && !forceMin && !inEvent.minimizing) {
          //
          // Add the parameter widget in a panel unless it already exists
          //
          var panelExists = false;
          for (var i = 0; i < this.$.containerPanels.getPanels().length; i++) {
            if (this.$.containerPanels.getPanels()[i].name === name + "Scroller") {
              panelExists = true;
              break;
            }
          }
          if (panelExists) {
            this.$.containerPanels.setIndex(i);
          } else {
            this.createSearchPanel(item);
          }
        }
      }

      if (forceMin) {
        //
        // Coerce a minimization of the pullout.
        //
        this.animateToMin();

      } else if (this.isAtMin() && inEvent.show) {
        //
        // Coerce a maximization of the pullout.
        //
        this.animateToMax();
      }
    }
  });

}());

/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true, _:true */

(function () {

  /**
   @name XV.Pullout
   @class Derived from <a href="http://enyojs.com/api/#enyo.Slideable">enyo.Slideable</a>.
   @extends enyo.Slideable
   */
  enyo.kind(/** @lends XV.Pullout# */{
    name: "XV.Pullout",
    kind: "enyo.Slideable",
    classes: "pullout",
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
      {name: "shadow", classes: "pullout-shadow"},
      {name: "grabber", kind: "onyx.Grabber", classes: "pullout-grabbutton",
        ondragfinish: "grabberDragFinish"},
      {kind: "FittableRows", classes: "enyo-fit", components: [
        {name: "client", classes: "pullout-toolbar"},
        {classes: "xv-pullout-header", name: "pulloutHeader", content: ""},
        {kind: "Scroller", name: "pulloutItems", fit: true, style: "position: relative;",
          components: [
          {name: "container", components: [
            {name: "history", fit: true, components: [
              {kind: "Repeater", name: "historyList",
                onSetupItem: "setupHistoryItem", count: 0, components: [
                {name: "historyItem"}
              ]}
            ]},
            {name: "help", fit: true}
          ]}
        ]}
      ]}
    ],
    /**
      A parameter widget has been passed to us in an event. Make sure that the payload of the
      event gets added to our pullout items.
     */
    addPulloutItem: function (inSender, inEvent) {
      var child,
        widget = inEvent.getParameterWidget(),
        item = {
          name: inEvent.name,
          fit: true
        };
      if (widget) {
        item.kind = widget;
        item.container = this.$.container;
        // Remove the previous item and create the new one
        child = this.$.container.children[0];
        this.$.container.removeChild(child);
        this._pulloutItems[inEvent.name] = this.createComponent(item);
      }
    },
    /**
      Tries to pre-populate the history list from a cookie if present
     */
    create: function () {
      this.inherited(arguments);
      this._parameterWidgets = {};
      this._pulloutItems = {};
      this._pulloutItems.history = this.$.history;
      this._pulloutItems.help = this.$.help;
      var that = this,
        callback = function () {
          that.preLoadHistory();
        };

      XT.getStartupManager().registerCallback(callback, true);
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
      Called whenever the pullout is pulled via the dragger. We ensure that if
      no panel is yet selected, we default to the history panel.
    */
    grabberDragFinish: function () {
      var name = this.getSelectedPanel() ? this.getSelectedPanel() : "history";

      this.togglePullout(this, {name: name, show: true});
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
        classes: "item enyo-border-box",
        style: "color:white",
        ontap: "doHistoryItemSelected",
        content: modelTypeShow + ": " + historyData.modelName,
        modelType: historyData.modelType,
        id: historyData.modelId,
        workspace: historyData.workspaceType
      });
    },
    getItem: function (name) {
      return this._pulloutItems[name];
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
        item = this.getItem(name),
        child,
        isGripperOriginated = inSender.kind === 'XV.Pullout',
        forceMin = false;

      if (!item) {
        // if we've moved to a list with no advanced search and pull the pullout
        // again show history instead.
        name = "history";
        item = this.getItem(name);

        if (!inEvent.show) {
          // nothing to see here.
          // for example, the user has backed out into the main splash screen
          // just pull back the pullout
          // but we do want the pullout to be set at "history" in case it gets
          // drawn next for a list with no advanced search
          forceMin = true;
        }
      }

      if (name === 'history') {
        // show the history panel
        this.$.pulloutHeader.setContent("_history".loc());

      } else if (name === 'help') {
        // show the help panel
        this.$.pulloutHeader.setContent("_help".loc());
        // remove all children
        // it wouldn't be necessary to delete and create each time
        // if it would work just to update the src attribute
        while (this.$.help.children.length) {
          child = this.$.help.children[0];
          this.$.help.removeChild(child);
        }
        this.$.help.createComponent({
          tag: "iframe",
          name: "helpPage",
          attributes: {src: inEvent.url, height: "90%"}
        });

      } else {
        // show the advanced search panel
        this.$.pulloutHeader.setContent("_advancedSearch".loc());
      }

      this.setSelectedPanel(name);

      if (forceMin || (this.isAtMax() && !isGripperOriginated)) {
        //
        // Coerce a minimization of the pullout.
        // If the animation is gripper-originated it doesn't need to be helped along
        //
        this.animateToMin();

      } else if (this.isAtMin() && !isGripperOriginated && inEvent.show) {
        //
        // Coerce a maximization of the pullout.
        // If the animation is gripper-originated it doesn't need to be helped along
        //
        this.animateToMax();
      }

      if (inEvent.show) {
        //
        // We only want the selected item to be in the container.
        // Remove all pre-existing children.
        //
        while (this.$.container.children.length) {
          child = this.$.container.children[0];
          this.$.container.removeChild(child);
        }

        //
        // Add the item
        //
        this.$.container.addChild(item);
        this.$.fittableRows.render();

        // Workaround for enyo bug in which a div hangs out in the floating layer and a second
        // identical div gets added then second time you pull the pullout. See incident 18672.
        enyo.floatingLayer.render();
      }
    }
  });

}());

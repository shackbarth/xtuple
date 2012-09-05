/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {

  enyo.kind({
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
      {name: "grabber", kind: "onyx.Grabber", classes: "pullout-grabbutton", ondragfinish: "grabberDragFinish"},
      {kind: "FittableRows", classes: "enyo-fit", components: [
        {name: "client", classes: "pullout-toolbar"},
        {classes: "xv-pullout-header", name: "pulloutHeader", content: "" },
        { name: "pulloutItems", fit: true,
          kind: "Scroller",
          style: "position: relative;",
          components: [
          {fit: true, name: "history", kind: "Scroller", components: [
            {
              kind: "Repeater",
              name: "historyList",
              onSetupItem: "setupHistoryItem",
              count: 0,
              components: [
                { name: "historyItem" }
              ]
            }
          ]}
        ]}
      ]}
    ],
    /**
      Called whenever the pullout is pulled via the dragger. We ensure that if
      no panel is yet selected, we default to the history panel.
    */
    grabberDragFinish: function () {
      var name = this.getSelectedPanel() ? this.getSelectedPanel() : "history";

      this.togglePullout(this, {name: name, show: true});
    },
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
        // XXX color/look TBD
        ontap: "doHistoryItemSelected",
        content: modelTypeShow + ": " + historyData.modelName,
        modelType: historyData.modelType,
        id: historyData.modelId,
        workspace: historyData.workspaceType
      });
    },
    getItem: function (name) {
      return this.$.pulloutItems.$[name] || this.$[name];
    },
    /**

      Sets the pullout to be the appropriate panel (either history or
      the apppropriate advanced search). May or may not show the panel,
      depending on inEvent.show.

      @param {Object} inSender
      @param {Object} inEvent
      @param {String} inEvent.name The name of the panel, or the word "history"
      @param {Boolean} inEvent.show Whether or not we want to show the panel

     */
    togglePullout: function (inSender, inEvent) {
      // note that if you show history, then move to a list with a panel, then pull the
      // pullout, it will show the advanced search and not history. This is a consequence
      // of the stream of notifications from the navigator even when the pullout isn't activated
      // letting the pullout know where the navigator is at. It gets saved in this.selectedPanel,
      // which has the effect of wiping out the "memory" that history was the last pullout panel
      // in use.
      var name = inEvent.name,
        item = this.getItem(name),
        children = this.$.pulloutItems.children[0].children,
        i;

      if (!item) {
        // if we've moved to a list with no advanced search and pull the pullout
        // again, there will be no item to find by that name. The best we can do
        // is to have the pullout show history instead.
        name = "history";
        item = this.getItem(name);
      }

      if (name === 'history') {
        this.$.pulloutHeader.setContent("_history".loc());
      } else {
        this.$.pulloutHeader.setContent("_advancedSearch".loc());
      }
      this.setSelectedPanel(name);
      if (item && item.showing && this.isAtMax()) {
        this.animateToMin();
      } else if (inEvent.show) {
        for (i = 0; i < children.length; i++) {
          children[i].hide();
        }
        if (item.populateFromCookie) {
          // i.e. don't try to do this for history
          item.populateFromCookie();
        }
        item.show();
        item.resized();
        if (!this.isAtMax()) {
          this.render();
          this.animateToMax();
        }
      }
    }
  });

}());

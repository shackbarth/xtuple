/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true */

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
    components: [
      {name: "shadow", classes: "pullout-shadow"},
      {name: "grabber", kind: "onyx.Grabber", classes: "pullout-grabbutton"},
      {kind: "FittableRows", classes: "enyo-fit", components: [
        {name: "client", classes: "pullout-toolbar"},
        {name: "pulloutItems", fit: true, style: "position: relative;", components: [
          {name: "history", kind: "FittableRows", showing: false, classes: "enyo-fit", components: [
            {kind: "onyx.RadioGroup", classes: "history-header", components: [
              {content: "Saved", active: true},
              {content: "Recents"}
            ]},
            {fit: true, name: "historyPanel", kind: "Scroller", classes: "history-scroller", components: [
              {
                kind: "Repeater",
                name: "historyList",
                onSetupItem: "setupHistoryItem",
                count: 0,
                components: [
                  { content: "debug", name: "historyItem" }
                ]
              }
            ]}
          ]}
        ]}
      ]}
    ],
    refreshHistoryList: function () {
      XT.log("refresh history list");
      this.$.historyList.setCount(XT.getHistory().length);
    },
    setupHistoryItem: function (inSender, inEvent) {
      var historyItem = inEvent.item.$.historyItem;
      var historyData = XT.getHistory()[inEvent.index];
      this.createComponent({
        container: historyItem,
        kind: "onyx.Button",
        onclick: "doHistoryItemSelected",
        content: historyData.modelType + ": " + historyData.modelName,
        modelType: historyData.modelType,
        modelId: historyData.modelId,
        module: historyData.module
      });
    },
    getItem: function (name) {
      return this.$.pulloutItems.$[name] || this.$[name];
    },
    togglePullout: function (name) {
      var item = this.getItem(name),
        children = this.$.pulloutItems.children,
        i;
      if (item.showing && this.isAtMax()) {
        this.animateToMin();
      } else {
        this.animateToMax();
        for (i = 0; i < children.length; i++) {
          children[i].hide();
        }
        item.show();
        item.resized();
      }
    }
  });

}());

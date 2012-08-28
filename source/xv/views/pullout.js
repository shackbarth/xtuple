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
      if (!this.getSelectedPanel()) {
        this.togglePullout("history");
      }
    },
    refreshHistoryList: function () {
      this.$.historyList.setCount(XT.getHistory().length);
    },
    setupHistoryItem: function (inSender, inEvent) {
      var historyItem = inEvent.item.$.historyItem;
      var historyData = XT.getHistory()[inEvent.index];
      var modelTypeShow = ("_" + historyData.modelType.afterDot().camelize()).loc();
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
    togglePullout: function (name) {
      var item = this.getItem(name),
        children = this.$.pulloutItems.children[0].children,
        i;
      if (name === 'history') {
        this.$.pulloutHeader.setContent("_history".loc());
      } else {
        this.$.pulloutHeader.setContent("_advancedSearch".loc());
      }
      this.setSelectedPanel(name);
      if (item && item.showing && this.isAtMax()) {
        this.animateToMin();
      } else {
        for (i = 0; i < children.length; i++) {
          children[i].hide();
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

/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.Module",
    kind: "Panels",
    label: "",
    classes: "app enyo-unselectable",
    handlers: {
      onInfoListRowTapped: "doInfoListRowTapped"
    },
    realtimeFit: true,
    arrangerKind: "CollapsingArranger",
    components: [
      {kind: "FittableRows", classes: "left", components: [


        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "onyx.Button", content: "_dashboard".loc(), ontap: "showDashboard"},
          {kind: "onyx.MenuDecorator", components: [
            {content: "_history".loc(), ontap: "fillHistory" },
            {kind: "onyx.Tooltip", content: "Tap to open..."},
            {kind: "onyx.Menu", name: "historyMenu", components: [], ontap: "doHistoryItemSelected" }
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
    create: function () {
      this.inherited(arguments);
      this.$.leftLabel.setContent(this.label);
      // Build lists
      var i;
      for (i = 0; i < this.lists.length; i++) {
        this.$.lists.createComponent(this.lists[i]);
      }
      this.$.menu.setCount(this.lists.length);
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
      // Select list
      if (this.$.lists.getIndex() !== index) {
        this.$.lists.setIndex(index);
      }
      this.$.rightLabel.setContent(this.$.lists.$[list].getLabel());
      if (!this.fetched[list]) {
        this.$.lists.$[list].fetch();
        this.fetched[list] = true;
      }
    },
    didFinishTransition: function (inSender, inEvent) {
      this.setList(inSender.index);
    },
    didBecomeActive: function () {
      if (this.firstTime) {
        this.firstTime = false;
        this.setList(0);
      }
    },
    showDashboard: function () {
      this.bubble("dashboard", {eventName: "dashboard"});
    },
    showSetup: function () {
      // todo
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
    fillHistory: function () {

      // Clear out the history menu
      var historyMenu = this.$.historyMenu; // just for re-use

      // It's necessary to save the length into a variable or else the loop ends
      // prematurely. It's also necessary to delete the children always from the
      // 0 spot and not the i spot, because the target moves as you delete.
      var historyLength = historyMenu.children.length;
      for (var i = 0; i < historyLength; i++) {
        historyMenu.removeChild(this.$.historyMenu.children[0]);
      }

      for(var i = 0; i < XV.history.length; i++) {
        this.$.historyMenu.createComponent({
          content: XV.history[i].modelType + ": " + XV.history[i].modelName,
          modelType: XV.history[i].modelType,
          modelId: XV.history[i].modelId
        });
      }
      this.$.historyMenu.render();
    },
    doHistoryItemSelected: function (inSender, inEvent) {
      var modelId = inEvent.originator.modelId;
      var modelType = inEvent.originator.modelType;
      console.log("Now it's time to load " + modelType + " " + modelId);
      // TODO: actually load
    }


  });

}());

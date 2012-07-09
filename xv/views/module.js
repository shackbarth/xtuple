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
    realtimeFit: true,
    arrangerKind: "CollapsingArranger",
    components: [
      {kind: "FittableRows", classes: "left", components: [
        {kind: "onyx.Toolbar", components: [
          {kind: "onyx.Button", content: "_back".loc(), ontap: "showDashboard"},
          {name: "leftLabel"}
        ]},
        {name: "menu", kind: "List", fit: true, touch: true, onSetupItem: "setupItem", components: [
          {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", components: [
        {kind: "FittableColumns", noStretch: true, classes: "onyx-toolbar onyx-toolbar-inline", components: [
          {kind: "onyx.Grabber"},
          {kind: "Scroller", thumb: false, fit: true, touch: true, vertical: "hidden", style: "margin: 0;", components: [
            {classes: "onyx-toolbar-inline", style: "white-space: nowrap;"}
          ]}
        ]},
        {name: "lists", kind: "Panels", arrangerKind: "CardArranger", fit: true, components: []}
      ]}
    ],
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
      var list = this.lists[inEvent.index].name;
      if (!this.fetched[list]) { this.$.lists.$[list].fetch(); }
      this.$.lists.setIndex(inEvent.index);
      this.fetched[list] = true;
    },
    firstTime: true,
    fetched: {},
    didBecomeActive: function () {
      var list;
      if (this.firstTime) {
        this.$.menu.select(0);
        list = this.lists[0].name;
        this.$.lists.$[list].fetch();
        this.fetched[list] = true;
      }
    },
    showDashBoard: function () {
      this.bubble("dashboard", {eventName: "dashboard"});
    },
    showSetup: function () {
      // todo
    }

  });

}());
/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true*/
/*global XT:true, enyo:true*/

(function () {
  //"use strict";

  enyo.kind({
    name: "Billing",
    kind: "Panels",
    label: "_billing".loc(),
    classes: "app enyo-unselectable",
    realtimeFit: true,
    arrangerKind: "CollapsingArranger",
    components: [
      {kind: "FittableRows", classes: "left", components: [
        {kind: "onyx.Toolbar", components: [
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
            {classes: "onyx-toolbar-inline", style: "white-space: nowrap;", components: [
              {kind: "onyx.Button", content: "Setup", ontap: "showSetup"}
            ]}
          ]}
        ]},
        {name: "lists", kind: "Panels", arrangerKind: "CardArranger", fit: true, components: []}
      ]}
    ],
    // menu
    setupItem: function (inSender, inEvent) {
      var list = this.$.lists.components[inEvent.index].kind.camelize();
      this.$.item.setContent(this.$[list].getLabel());
      this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
    },
    create: function () {
      this.inherited(arguments);
      this.$.menu.setCount(this.$.lists.components.length);
      this.$.leftLabel.setContent(this.label);
    },
    itemTap: function (inSender, inEvent) {
      var list = this.$.lists.components[inEvent.index].kind.camelize();
      this.$[list].fetch();
      this.$.lists.setIndex(inEvent.index);
    },
    firstTime: true,
    didBecomeActive: function () {
      var list;
      if (this.firstTime) {
        this.$.menu.select(0);
        list = this.$.lists.components[0].kind.camelize();
        this.$[list].fetch();
      }
    },
    showSetup: function () {
      // todo
    }

  });

}());
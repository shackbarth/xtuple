/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, console:true*/

(function () {
  enyo.kind(
  /** @lends XV.GridBox# */{
    name: "XV.GridBox",
    kind: "XV.Groupbox",
    classes: "panel xv-list-relations-box",
    published: {
      attr: null,
      value: null,
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_lineItems".loc()},
      {kind: "Repeater", name: "gridRepeater", onSetupItem: "setupRow", components: [
        {name: "gridRow", content: "Baz"}
      ]}
    ],
    setupRow: function (inSender, inEvent) {
      var item = inEvent.item.$.gridRow,
        model = this.getValue().at(inEvent.index);

      item.setContent(model.get("item") + " " + model.get("quantity"));
    },
    valueChanged: function () {
      this.$.gridRepeater.setCount(this.getValue().length);
    }
  });

  enyo.kind({
    name: "XV.SalesOrderLineItemGridBox",
    kind: "XV.GridBox"
  });

}());

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
      disabled: null,
      value: null,
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_lineItems".loc()},
      {kind: "Scroller", horizontal: "auto", classes: "xv-groupbox xv-scroller", components: [
        {kind: "Repeater", name: "gridRepeater", onSetupItem: "setupRow", components: [
          {kind: "XV.RelationsEditor", name: "gridRow", components: [
            {kind: "XV.Input", attr: "quantity"}
          ]}
        ]}
      ]}
    ],
    /**
      Fire the repeater to push down disability to widgets
     */
    disabledChanged: function () {
      this.$.gridRepeater.setCount(this.getValue().length);
    },
    setupRow: function (inSender, inEvent) {
      var that = this,
        item = inEvent.item,
        model = this.getValue().at(inEvent.index);

      item.$.gridRow.setValue(model);
      /*
      _.each(item.$, function (control) {
        if (control.attr) {
          control.setValue(model.get(control.attr));
          // buggy control.setDisabled(that.getDisabled());
        }
      });
      */
      return true;
    },
    valueChanged: function () {
      this.$.gridRepeater.setCount(this.getValue().length);
    }
  });

}());

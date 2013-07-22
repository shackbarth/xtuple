/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, console:true*/

(function () {
  var _events = "change readOnlyChange statusChange";

  /**
    @name XV.GridRow
      borrows from XV.RelationsEditor
  */
  enyo.kind(enyo.mixin(XV.EditorMixin, /** @lends XV.GridRow# */{
    name: "XV.GridRow",
    kind: "FittableColumns",
    handlers: {
      onValueChange: "controlValueChanged"
    },
    /**
    @todo Document the destroy method.
    */
    destroy: function () {
      if (this.value) {
        this.value.off(_events, this.attributesChanged, this);
        this.value.off("notify", this.notify, this);
      }
      this.value = null;
      this.inherited(arguments);
    },
    /**
    @todo Document the setValue method.
    */
    setValue: function (value) {
      if (this.value) {
        this.value.off(_events, this.attributesChanged, this);
        this.value.off("notify", this.notify, this);
      }
      this.value = value;
      if (value) {
        this.value.on(_events, this.attributesChanged, this);
        this.value.on("notify", this.notify, this);
      }
      this.attributesChanged(value);
      if (this.valueChanged) { this.valueChanged(value); }
    }

  }));


  enyo.kind(
  /** @lends XV.GridBox# */{
    name: "XV.GridBox",
    kind: "XV.Groupbox",
    classes: "panel xv-list-relations-box xv-grid-box",
    published: {
      attr: null,
      disabled: null,
      value: null,
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_lineItems".loc()},
      {kind: "Scroller", horizontal: "auto", classes: "xv-groupbox xv-scroller", components: [
        {kind: "Repeater", name: "gridRepeater", onSetupItem: "setupRow", components: [
          {kind: "XV.GridRow", name: "gridRow", components: [
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

      // TODO: supress headers if index > 0
      item.$.gridRow.setValue(model);
      return true;
    },
    valueChanged: function () {
      this.$.gridRepeater.setCount(this.getValue().length);
    }
  });

}());

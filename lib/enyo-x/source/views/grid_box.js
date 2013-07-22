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
    classes: "panel xv-grid-box",
    handlers: {
      ontap: "buttonTapped"
    },
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
    buttonTapped: function (inSender, inEvent) {
      switch (inEvent.originator.name) {
      case "addGridRowButton":
        // Add a row to the grid
        var Klass = this.getValue().model,
          model = new Klass(null, {isNew: true});
        //this.$.editor.clear();
        this.getValue().add(model);
        this.valueChanged();
        //this.$.list.select(collection.length - 1);
        break;
      case "clearGridRowButton":
        console.log("clear grid row");
        break;
      case "deleteGridRowButton":
        console.log("delete grid row");
        break;
      }
    },
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

      if (inEvent.index > 0) {
        // supress headers if index > 0
        _.each(item.$.gridRow.$, function (control) {
          if (control.name.indexOf('header') === 0) {
            //control.hide(); // problematic: might need the width for consistent columns
            control.applyStyle("visibility", "hidden");
            control.applyStyle("height", "0px");
          }
        });
      }
      item.$.gridRow.setValue(model);
      return true;
    },
    valueChanged: function () {
      this.$.gridRepeater.setCount(this.getValue().length);
    }
  });

}());

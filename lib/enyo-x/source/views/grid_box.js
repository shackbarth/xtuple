/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, console:true*/

(function () {
  var _events = "change readOnlyChange statusChange";

/*
This is a fully-baked implementation of grid-entry, which (with
QA approval) can be released into production.

The implementation here is a straightforward one and works well,
but is likely to strain under the weight of 50+ line items. We
have a few speculative options for reimplementing parts of the
grid with better support for large sales orders, such as with
an enyo list or with cells that are read-only labels until tabbed into.

There's also an open issue with the keyboard navigation of pickers.
http://forums.enyojs.com/discussion/1578/picker-onblur
If enyo pickers cannot be made keyboard-friendly we might want to replace
them with comboboxes throughout the entire application.
*/

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
      Remove listeners
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
      Create listeners
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
    events: {
      onChildWorkspace: ""
    },
    handlers: {
      ontap: "buttonTapped"
    },
    published: {
      attr: null,
      disabled: null,
      value: null,
      associatedWorkspace: ""
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_lineItems".loc()},
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", classes: "in-panel", components: [
        {kind: "Repeater", name: "gridRepeater", onSetupItem: "setupRow", components: [
          {kind: "XV.GridRow", name: "gridRow", components: [
            {kind: "XV.Input", attr: "quantity"}
          ]}
        ]}
      ]}
    ],
    buttonTapped: function (inSender, inEvent) {
      var model;

      switch (inEvent.originator.name) {
      case "addGridRowButton":
        this.newItem();
        break;
      //case "clearGridRowButton":
      // XXX doesn't work owing to some complexities of sales order models
      //  model = inEvent.originator.parent.parent.parent.value; // XXX better ways to do this
      //  model.clear();
      //  this.valueChanged();
      //  break;
      case "deleteGridRowButton":
        // note that can't remove the model from the middle of the collection w/o error
        // we just destroy the model and hide the row.
        model = inEvent.originator.parent.parent.parent.value; // XXX better ways to do this
        model.destroy();
        this.valueChanged();
        break;
      case "expandGridRowButton":
        model = inEvent.originator.parent.parent.parent.value; // XXX better ways to do this
        this.doChildWorkspace({
          workspace: this.getAssociatedWorkspace(),
          collection: this.getValue(),
          index: this.getValue().indexOf(model)
        });
        break;
      }
    },
    /**
      Fire the repeater to push down disability to widgets
     */
    disabledChanged: function () {
      this.$.newButton.setDisabled(this.getDisabled());
      this.$.gridRepeater.setCount(this.getValue().length);
    },
    /*
      Add a row to the grid
    */
    newItem: function () {
      var Klass = this.getValue().model,
        model = new Klass(null, {isNew: true});
      this.getValue().add(model);
      this.valueChanged();
      // focus on the first widget of the new row
      this.$.gridRepeater.controls[this.$.gridRepeater.count - 1].$.gridRow.$.itemSiteWidget.focus();
    },
    setupRow: function (inSender, inEvent) {
      var that = this,
        item = inEvent.item,
        i,
        isFirstLiveModel = true,
        model;

      // the first row might be destroyed, thus invisible. We want the first visible row.
      for (i = 0; i < inEvent.index; i++) {
        model = this.getValue().at(i);
        if (!model.isDestroyed()) {
          isFirstLiveModel = false;
        }
      }
      if (!isFirstLiveModel) {
        // supress headers if it's not the first visible row
        _.each(item.$.gridRow.$, function (control) {
          if (control.name.indexOf('header') === 0) {
            // note: can't just control.hide() because we need the width for consistent columns
            control.applyStyle("visibility", "hidden");
            control.applyStyle("height", "0px");
          }
        });
      }
      model = this.getValue().at(inEvent.index);
      item.$.gridRow.setValue(model);


      if (model.isDestroyed()) {
        item.$.gridRow.hide();
      } else {
        // TODO: a bit awkward that we're referencing from the superkind
        // a button that's defined in the subkind. Once we have more than
        // one use case for this view we should move these buttons to
        // the superkind.
        item.$.gridRow.$.addGridRowButton.setDisabled(model.isReadOnly());
        item.$.gridRow.$.expandGridRowButton.setDisabled(model.isReadOnly());
        item.$.gridRow.$.deleteGridRowButton.setDisabled(model.isReadOnly());
      }
      return true;
    },
    valueChanged: function () {
      var liveModels = _.filter(this.getValue().models, function (model) {
        return !model.isDestroyed();
      });
      if (liveModels.length > 0) {
        // don't need this if there's a grid row, which has its own new button
        this.$.newButton.hide();
      } else {
        this.$.newButton.show();
      }
      this.$.gridRepeater.setCount(this.getValue().length);
    }
  });

}());

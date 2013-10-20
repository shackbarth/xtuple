/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, console:true*/

(function () {
  var _events = "change readOnlyChange statusChange",
    _readOnlyHeight = 57;

  // TODO: picker onblur
  // http://forums.enyojs.com/discussion/1578/picker-onblur#latest

  enyo.kind({
    name: "XV.ReadOnlyGridRow",
    classes: "xv-grid-row readonly",
    published: {
      value: null
    }
  });

  /**
    The editable row of a GridBox for grid entry.
    @see XV.RelationsEditor.
  */
  var gridRow = /** @lends XV.GridRow# */{
    name: "XV.GridRow",
    classes: "xv-grid-row selected",
    handlers: {
      onValueChange: "controlValueChanged"
    },
    addButtonKeyup: function (inSender, inEvent) {
      if (inEvent.keyCode === 9) {
        // the user has just tabbed out of their row
        this.bubble("onTabOut");
      }
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
  };
  enyo.kind(enyo.mixin(XV.EditorMixin, gridRow));

  /**
    Input system for grid entry
    @extends XV.Groupbox
   */
  enyo.kind(
  /** @lends XV.GridBox# */{
    name: "XV.GridBox",
    kind: "XV.Groupbox",
    classes: "panel xv-grid-box",
    events: {
      onChildWorkspace: ""
    },
    handlers: {
      ontap: "buttonTapped",
      onTabOut: "tabOut"
    },
    published: {
      attr: null,
      disabled: null,
      value: null,
      editableIndex: null, // number
      associatedWorkspace: ""
    },
    components: [], // need to be defined in the subkind
    buttonTapped: function (inSender, inEvent) {
      var model;

      switch (inEvent.originator.name) {
      case "addGridRowButton":
        this.newItem();
        break;
      case "deleteGridRowButton":
        // note that can't remove the model from the middle of the collection w/o error
        // we just destroy the model and hide the row.
        model = inEvent.originator.parent.parent.parent.value; // XXX better ways to do this
        model.destroy();
        this.setEditableIndex(null);
        this.$.editableGridRow.hide();
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
     Propagate down disability to widgets.
     */
    disabledChanged: function () {
      this.$.newButton.setDisabled(this.getDisabled());
    },
    /*
      When a user taps the grid row we open it up for editing
    */
    gridRowTapAbove: function (inSender, inEvent) {
      this.gridRowTapEither(inEvent.index, 0);
    },
    gridRowTapBelow: function (inSender, inEvent) {
      this.gridRowTapEither(inEvent.index, this.getEditableIndex() + 1);
    },
    gridRowTapEither: function (index, indexStart) {
      var editableIndex = index + indexStart,
        belowListCount = this.getValue().length - editableIndex - 1;

      if (this.getDisabled()) {
        // read-only means read-only
        return;
      }
      if (index === undefined) {
        // tap somewhere other than a row item
        return;
      }
      this.setEditableIndex(editableIndex);
      this.$.aboveGridList.setCount(editableIndex);
      this.$.aboveGridList.render();
      // XXX hack. not sure why the port doesn't know to resize down
      this.$.aboveGridList.$.port.applyStyle("height", (_readOnlyHeight * this.liveModels(editableIndex - 1).length) + "px");
      this.$.editableGridRow.setValue(this.getValue().at(editableIndex));
      this.$.editableGridRow.show();
      this.$.belowGridList.setCount(belowListCount);
      this.$.belowGridList.render();
      // XXX hack. not sure why the port doesn't know to resize down
      this.$.belowGridList.$.port.applyStyle("height", (_readOnlyHeight * belowListCount) + "px");
    },
    /**
      Get all the models that are not destroyed, up through optional maxIndex parameter
    */
    liveModels: function (maxIndex) {
      return _.compact(_.map(this.getValue().models, function (model, index) {
        if (maxIndex !== undefined && index > maxIndex) {
          return null;
        } else if (model.isDestroyed()) {
          return null;
        } else {
          return model;
        }
      }));
    },
    /*
      Add a row to the grid
    */
    newItem: function () {
      var editableIndex = this.getValue().length,
        aboveListCount = this.liveModels(editableIndex - 1).length,
        Klass = this.getValue().model,
        model = new Klass(null, {isNew: true});

      this.getValue().add(model);
      this.setEditableIndex(editableIndex);
      this.valueChanged();
      // XXX hack. not sure why the port doesn't know to resize down
      this.$.aboveGridList.$.port.applyStyle("height", (_readOnlyHeight * aboveListCount) + "px");
      this.$.editableGridRow.setValue(model);
      this.$.editableGridRow.show();

      // focus on the first widget of the new row
      this.$.editableGridRow.$.itemSiteWidget.focus();
    },
    setupRowAbove: function (inSender, inEvent) {
      this.setupRowEither(inEvent.index, this.$.aboveGridRow, 0);
    },
    setupRowBelow: function (inSender, inEvent) {
      this.setupRowEither(inEvent.index, this.$.belowGridRow, this.getEditableIndex() + 1);
    },
    setupRowEither: function (index, gridRow, indexStart) {
      var that = this,
        model = this.getValue().at(indexStart + index);

      // set the contents of the row
      gridRow.setValue(model);
      gridRow.setShowing(model && !model.isDestroyed());

      return true;
    },
    tabOut: function () {
      var outIndex = this.getEditableIndex(),
        rowCount = this.getValue().length,
        i;

      if (outIndex + 1 === rowCount) {
        this.newItem();
      } else {
        // go to the next live row, as if it had been tapped
        for (i = outIndex + 1; i < this.getValue().length; i++) {
          if (!this.getValue().at(i).isDestroyed()) {
            this.gridRowTapEither(i, 0);
            break;
          }
        }
      }
    },
    valueChanged: function () {
      var that = this,
        renumberRows = function (model, status) {
        var i,
          iLive = 1;

        // eliminate line number holes if a row has been deleted from the middle
        if (status === XM.Model.DESTROYED_DIRTY) {
          for (i = 0; i < that.getValue().length; i++) {
            if (!that.getValue().at(i).isDestroyed()) {
              that.getValue().at(i).set("lineNumber", iLive);
              iLive ++;
            }
          }
        }
      };

      this.getValue().off("statusChange", renumberRows);
      this.getValue().on("statusChange", renumberRows);

      this.$.aboveGridList.setCount(this.getEditableIndex() !== null ? this.getEditableIndex() : this.getValue().length);
      // XXX hack. not sure why the port doesn't know to resize down
      this.$.aboveGridList.$.port.applyStyle("height", (_readOnlyHeight * this.liveModels().length) + "px");
      this.$.belowGridList.setCount(0);
      this.$.belowGridList.$.port.applyStyle("height", "0px");
      this.render();
    }
  });
}());

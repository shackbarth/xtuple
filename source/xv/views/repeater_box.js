/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XM:true, XV:true, _:true */

(function () {
  
  enyo.kind({
    name: "XV.RepeaterBox",
    kind: "XV.Groupbox",
    classes: "panel",
    published: {
      attr: null,
      columns: [],
      model: null,
      showHeader: true
    },
    handlers: {
      onDeleteRow: "deleteRow"
    },
    components: [
      {kind: "onyx.GroupboxHeader", name: "title", content: "_title".loc()},
      {kind: "XV.Groupbox", name: "header", classes: "in-panel" },
      {kind: "XV.Scroller", fit: true, components: [
        {kind: "Repeater", name: "repeater", count: 0, onSetupItem: "setupRow",
          classes: "xv-comment-box-repeater", components: [
          {kind: "XV.CommentBoxItem", name: "repeaterRow" }
        ]}
      ]},
      {kind: "onyx.Button", name: "newRowButton", onclick: "newRow",
        content: "_new".loc()}
    ],
    create: function () {
      this.inherited(arguments);
      this.$.title.setContent(("_" + this.attr || "").loc());
      this.columnsChanged();
      this.showHeaderChanged();
    },
    columnsChanged: function () {
      //this.showLabels();
    },
    deleteRow: function (inSender, inEvent) {
      inEvent.originator.parent.getModel().destroy();
      this.$.repeater.setCount(this._collection.length);
    },
    newRow: function () {
      var Klass = XT.getObjectByName(this.getModel()),
        model = new Klass(null, { isNew: true });
      this._collection.add(model);
      this.$.repeater.setCount(this._collection.length);
    },
    setupRow: function (inSender, inEvent) {
      var row = inEvent.item.$.repeaterRow,
        //columns = this.getColumns(),
        model = this._collection.at(inEvent.index),
        status = model.getStatus(),
        K = XM.Model;
      //row.setColumns(columns);
      row.setValue(model);
      if (status & K.DESTROYED) {
        row.setDeleted(true);
      }
    },
    setValue: function (value, options) {
      this._collection = value;
      this.$.repeater.setCount(this._collection.length);
      if (!this._collection.model.canCreate()) {
        this.$.newRowButton.setDisabled(true);
      }
    },
    showHeaderChanged: function () {
      var showHeader = this.getShowHeader();
      if (showHeader) {
        this.$.header.show();
      } else {
        this.$.header.hide();
      }
    },
    showLabels: function () {
      var columns = this.getColumns(),
        column,
        label,
        i;
      // XXX probably should clear all existing so as not to ever double up
      for (i = 0; i < columns.length; i++) {
        column = this.columns[i];
        label = ("_" + column.attr).loc();

        this.createComponent({
          container: this.$.header,
          content: label,
          classes: column.classes ? column.classes + " xv-label" : "xv-label"
        });
      }
    }
  });
  
  enyo.kind({
    name: "XV.RepeaterBoxRow",
    published: {
      columns: [],
      value: null
    },
    events: {
      onDeleteRow: ""
    },
    handlers: {
      onValueChange: "fieldChanged"
    },
    valueChanged: function (inSender, inEvent) {
      var i,
        model = this.getValue(),
        controls = _.filter(this.$, function (obj) {
          return obj.attr;
        }),
        control,
        label,
        attr,
        value;
      for (i = 0; i < controls.length; i++) {
        control = controls[i];
        attr = control.attr;
        label = ("_" + attr).loc();
        value = model.getValue(attr);
        value = control.formatter ?
          this[control.formatter](value, control, model) : value;
        if (control.setValue) {
          control.setValue(value, {silent: true});
        } else {
          control.setContent(value);
        }
        if (model.isReadOnly() || !model.canUpdate()) {
          this.setDisabled(true);
        }
      }
      
      // Add delete buttons for each row
      if (!model.isReadOnly() && model.canDelete()) {
        this.createComponent({
          kind: "onyx.Button",
          name: "deleteButton",
          classes: "xv-delete-button",
          content: "x",
          ontap: "deleteRow"
        });
      }
    },
    /**
      Catch events from constituent widgets and update the model
    */
    fieldChanged: function (inSender, inEvent) {
      var fieldName = inSender.getName(),
        newValue = inSender.getValue(),
        updateObject = {},
        model = this.getValue();
      updateObject[fieldName] = newValue;

      // Update the model.
      model.set(updateObject);
      return true;
    },
    deleteRow: function (inSender, inEvent) {
      this.setStyle("background-color:purple");
      this.doDeleteRow(inEvent);
    },
    setDeleted: function (isDeleted) {
      var components = this.getComponents(),
        comp,
        style = isDeleted ?
          "text-decoration: line-through" : "text-decoration: none",
        i;

      for (i = 0; i < components.length; i++) {
        comp = components[i];
        if (comp.setInputStyle) {
          comp.setInputStyle(style);
        } else {
          XT.log("setInputStyle not supported on widget");
        }
      }
      this.setDisabled(isDeleted);
    },
    setDisabled: function (isDisabled) {
      var i,
        components = this.getComponents(),
        comp;

      for (i = 0; i < components.length; i++) {
        comp = components[i];
        if (comp.setDisabled) {
          comp.setDisabled(isDisabled);
        } else {
          XT.log("setDisabled not supported on widget");
        }
      }
    }
  });
  
}());

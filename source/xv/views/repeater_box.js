/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XM:true, XV:true */

(function () {
  
  enyo.kind({
    name: "XV.RepeaterBox",
    kind: "XV.ScrollableGroupbox",
    published: {
      attr: null,
      columns: [],
      model: null
    },
    handlers: {
      onDeleteRow: "deleteRow"
    },
    classes: "xv-repeater-box xv-groupbox",
    components: [
      {kind: "onyx.GroupboxHeader", classes: "xv-repeater-box-title",
        name: "title", content: "_title".loc()},
      {kind: "onyx.Groupbox",
        classes: "onyx-toolbar-inline xv-repeater-box-header",
        name: "headerRow" },
      {kind: "Repeater", name: "repeater", count: 0, onSetupItem: "setupRow",
        components: [
        {kind: "XV.RepeaterBoxRow", name: "repeaterRow" }
      ]},
      {kind: "onyx.Button", name: "newRowButton", onclick: "newRow",
        content: "_new".loc()}
    ],
    create: function () {
      this.inherited(arguments);
      this.$.title.setContent(("_" + this.attr || "").loc());
      this.columnsChanged();
    },
    columnsChanged: function () {
      this.showLabels();
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
        columns = this.getColumns(),
        model = this._collection.at(inEvent.index),
        status = model.getStatus(),
        K = XM.Model;
      row.setColumns(columns);
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
          container: this.$.headerRow,
          content: label,
          classes: column.classes ? column.classes + " xv-label" : "xv-label"
        });
      }
    }
  });
  
  enyo.kind({
    name: "XV.RepeaterBoxRow",
    kind: "onyx.Groupbox",
    classes: "onyx-toolbar-inline xv-repeater-box-row",
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
        columns = this.getColumns(),
        column,
        label,
        component,
        attr;
      for (i = 0; i < columns.length; i++) {
        column = columns[i];
        attr = column.attr;
        label = ("_" + attr).loc();

        // These are the fields with the data
        component = this.createComponent({
          kind: column.kind,
          name: attr,
          placeholder: label, // XXX doesn't work. probably have to fix XV.Input
          classes: column.classes // this is clever
        });

        // If the descriptor mentions a model type we want to send that
        // down to the widget, e.g. for PickerWidgets
        if (column.collection) {
          component.setCollection(column.collection);
        }
        component.setValue(model.get(attr), {silent: true});
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
        style = isDeleted ? "text-decoration: line-through" : "text-decoration: none",
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

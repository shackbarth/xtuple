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
      collection: null,
      recordType: null
    },
    handlers: {
      onDeleteRow: "deleteRow"
    },
    classes: "xv-repeater-box xv-groupbox",
    components: [
      { kind: "onyx.GroupboxHeader", classes: "xv-repeater-box-title", name: "title", content: "Title" },
      { kind: "onyx.Groupbox", classes: "onyx-toolbar-inline xv-repeater-box-header", name: "headerRow" },
      { kind: "Repeater", name: "repeater", count: 0, onSetupItem: "setupRow", components: [
        { kind: "XV.RepeaterBoxRow", name: "repeaterRow" }
      ]},
      { kind: "onyx.Button", name: "newRowButton", onclick: "newRow", content: "_new".loc() }
    ],
    create: function () {
      this.inherited(arguments);
      this.$.title.setContent(("_" + this.attr || "").loc());

      /**
       * If the columns are defined from the outset of the creation of this class
       * then we should render the labels now because columnsChanged will never be
       * called.
       */
      if (this.getColumns()) {
        this.showLabels();
      }
    },
    columnsChanged: function () {
      this.showLabels();
    },
    showLabels: function () {
      // XXX probably should clear all existing so as not to ever double up
      for (var iColumn = 0; iColumn < this.getColumns().length; iColumn++) {
        var columnDesc = this.getColumns()[iColumn];
        var label = ("_" + XT.String.suffix(columnDesc.name)).loc();

        this.createComponent({
          container: this.$.headerRow,
          content: label,
          classes: columnDesc.classes ? columnDesc.classes + " xv-label" : "xv-label"
        });
      }
    },
    newRow: function () {
      var modelType = XT.String.suffix(this.getRecordType());
      var newModel = new XM[modelType](null, { isNew: true });
      this.getCollection().add(newModel);
      this.$.repeater.setCount(this.getCollection().size());
    },
    setupRow: function (inSender, inEvent) {
      var row = inEvent.item.$.repeaterRow;
      row.setColumns(this.getColumns());
      var model = this.getCollection().at(inEvent.index);
      row.setModel(model);
      if (model.getStatus() & XM.Model.DESTROYED) {
        row.setDeleted(true);
      }
    },
    setValue: function (value, options) {
      this.setCollection(value);

      // XXX: This should get called in collectionChanged, but it doesn't work there
      this.$.repeater.setCount(this.getCollection().size());
    },
    /**
     * Display the collection in the grid when it's passed in.
     */
    collectionChanged: function () {
      /**
       * Disable the "create new" button if the user doesn't have permission
       * to add a model to this collection
       */
      if (!this.getCollection().model.canCreate()) {
        this.$.newRowButton.setDisabled(true);
      }
      // XXX this should get called here but some bug is keeping setupRow from being called
      //this.$.repeater.setCount(this.getCollection().size());
    },
    deleteRow: function (inSender, inEvent) {
      inEvent.originator.parent.getModel().destroy();
      this.$.repeater.setCount(this.getCollection().size());
    }
  });
  
  enyo.kind({
    name: "XV.RepeaterBoxRow",
    kind: "onyx.Groupbox",
    classes: "onyx-toolbar-inline xv-repeater-box-row",
    published: {
      columns: [],
      model: null
    },
    events: {
      onDeleteRow: ""
    },
    handlers: {
      onValueChange: "fieldChanged"
    },
    modelChanged: function (inSender, inEvent) {
      for (var iColumn = 0; iColumn < this.getColumns().length; iColumn++) {
        var columnDesc = this.getColumns()[iColumn];
        var label = ("_" + XT.String.suffix(columnDesc.name)).loc();

        /**
         * These are the fields with the data
         */
        var field = this.createComponent({
          kind: columnDesc.kind,
          name: XT.String.suffix(columnDesc.name),
          placeholder: label, // XXX doesn't work. probably have to fix XV.Input
          classes: columnDesc.classes // this is clever

        });

        /**
         * If the descriptor mentions a model type we want to send that
         * down to the widget, e.g. for PickerWidgets
         */
        if (columnDesc.collection) {
          field.setCollection(columnDesc.collection);
        }
        field.setValue(this.getModel().get(XT.String.suffix(columnDesc.name)), {silent: true});
        if (this.getModel().isReadOnly() || !this.getModel().canUpdate()) {
          this.setDisabled(true);
        }
      }
      /**
       * Add delete buttons for each row
       */
      if (!this.getModel().isReadOnly() && this.getModel().canDelete()) {
        this.createComponent({
          kind: "onyx.Button",
          name: "deleteButton",
          classes: "xv-delete-button",
          content: "x",
          ontap: "deleteRow"
        });
      }
    },
    setValue: function (value, options) {
      this.setModel(value);
    },
    /**
     * Catch events from constituent widgets and update the model
     */
    fieldChanged: function (inSender, inEvent) {
      var fieldName = inSender.getName();
      var newValue = inSender.getValue();
      var updateObject = {};
      updateObject[fieldName] = newValue;

      /**
       * Update the model.
       */
      this.getModel().set(updateObject);
      return true;
    },
    deleteRow: function (inSender, inEvent) {
      this.setStyle("background-color:purple");
      this.doDeleteRow(inEvent);

    },
    setDeleted: function (isDeleted) {
      var comp,
        style = isDeleted ? "text-decoration: line-through" : "text-decoration: none",
        i;

      for (i = 0; i < this.getComponents().length; i++) {
        comp = this.getComponents()[i];
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
        comp;

      for (i = 0; i < this.getComponents().length; i++) {
        comp = this.getComponents()[i];
        if (comp.setDisabled) {
          comp.setDisabled(isDisabled);
        } else {
          XT.log("setDisabled not supported on widget");
        }
      }
    }
  });
  
}());

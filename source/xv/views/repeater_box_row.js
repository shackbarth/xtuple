/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
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

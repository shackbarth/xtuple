/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
  enyo.kind({
    name: "XV.RepeaterBox",
    kind: "XV.WorkspaceBox",
    published: {
      columns: [],
      collection: null
    },
    classes: "xv-repeater-box",
    components: [
      { kind: "onyx.GroupboxHeader", name: "title", content: "Title" },
      { kind: "Repeater", name: "repeater", count: 2, onSetupItem: "setupRow", components: [
        {
          kind: "onyx.Groupbox",
          classes: "onyx-toolbar-inline",
          style: "background-color: white;",
          name: "repeaterRow"
        }
      ]}
    ],

    create: function () {
      this.inherited(arguments);
      this.$.title.setContent(this.name);
    },
    setupRow: function (inSender, inEvent) {
      var row = inEvent.item.$.repeaterRow;

      for (var iColumn = 0; iColumn < this.getColumns().length; iColumn++) {
        var columnDesc = this.getColumns()[iColumn];
        var label = columnDesc.name;
        if (label.indexOf(".") > 0) {
          // strip off the prefix (everything before the dot) if there is one
          label = label.substring(label.indexOf(".") + 1);
        }
        label = ("_" + label).loc();

        if (inEvent.index === 0) {
          /**
           * This is the label header at the top of each column
           */
          this.createComponent({
            container: row,
            content: label,
            classes: "xv-label"
          });
        } else {
          /**
           * These are the fields with the data
           */
          var field = this.createComponent({
            kind: columnDesc.kind,
            container: row,
            name: columnDesc.fieldName + (inEvent.index - 1),
            placeholder: label,
            onchange: "doFieldChanged"
          });

          /**
           * If the descriptor mentions a model type we want to send that
           * down to the widget, e.g. for DropdownWidgets
           */
          if (columnDesc.collection) {
            field.setCollection(columnDesc.collection);
          }


          if (inEvent.index + 1 < this.$.repeater.getCount()) {
            // row with data
            var model = this.getCollection().at(inEvent.index - 1);
            field.setValue(model.get(columnDesc.fieldName), {silent: true});

            /**
             * Add delete buttons for each row (but not for the "title" row or the "new" row)
             */
            this.createComponent({
              kind: "onyx.Button",
              container: row,
              name: "delete" + (inEvent.index - 1),
              content: "Delete",
              onclick: "deleteRow"
            });

          } else {
            // this is the "new" row at the bottom

            /**
             * Apply a special style to this "add new" row to make it obvious
             * to users what it going on. TODO: make the style better and
             * use a CSS class.
             */
            row.applyStyle("border", "1px solid orange");

            // XXX this is a work in progress that must be generalized
            // XXX the functionality isn't actually hooked up yet
            //if (this.getCustomization().stampUser &&
            //    columnDesc.fieldName === 'createdBy') {
            //  field.setValue("<YOU>", {silent: true});
            //  field.setDisabled(true);
            //}
            //if (this.getCustomization().stampDate &&
            //    columnDesc.fieldName === 'created') {
            //  field.setValue("<NOW>", {silent: true});
            //  field.setDisabled(true);
            //}

          }
        }
      }
    },

    setValue: function (value, options) {
      XT.log("setting value to repeater box: " + JSON.stringify(value));
      this.setCollection(value);
    }
  });
}());

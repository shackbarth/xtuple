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
    /**
     * Returns everything after the last dot. This doens't need to be here
     */
    suffix: function (value) {
      while (value.indexOf(".") > 0) {
        // strip off the prefix (everything before the dot) if there is one
        value = value.substring(value.indexOf(".") + 1);
      }
      return value;
    },
    setupRow: function (inSender, inEvent) {
      var row = inEvent.item.$.repeaterRow;
      XT.log("setting up row " + inEvent.index);
      for (var iColumn = 0; iColumn < this.getColumns().length; iColumn++) {
        var columnDesc = this.getColumns()[iColumn];
        var label = ("_" + this.suffix(columnDesc.name)).loc();

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
            name: this.suffix(columnDesc.name) + (inEvent.index - 1),
            placeholder: label,
            onchange: "fieldChanged"
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
            field.setValue(model.get(this.suffix(columnDesc.name)), {silent: true});

          } //else {
            // this is the "new" row at the bottom

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

          //}
        }
      }
      /**
       * Add delete buttons for each row (but not for the "title" row or the "new" row)
       */
      if (inEvent.index !== 0 &&
          inEvent.index + 1 < this.$.repeater.getCount()) {
        this.createComponent({
          kind: "onyx.Button",
          container: row,
          name: "delete" + (inEvent.index - 1),
          content: "Delete",
          onclick: "deleteRow"
        });
      }

      /**
       * Apply a special style to this "add new" row to make it obvious
       * to users what it going on. TODO: make the style better and
       * use a CSS class.
       */
      if (inEvent.index + 1 === this.$.repeater.getCount()) {
        row.applyStyle("border", "1px solid orange");
      }
    },
    setValue: function (value, options) {
      //XT.log("setting value to repeater box: " + value);
      this.setCollection(value);

      // XXX: This should get called in collectionChanged, but it doesn't work there
      this.$.repeater.setCount(this.getCollection().size() + 2);
    },
    /**
     * Display the collection in the grid when it's passed in
     */
    collectionChanged: function () {
      // +2: 1 for the labels at the top, one for the entry row at the bottom

      // XXX this should get called here but some bug is keeping setupRow from being called
      //this.$.repeater.setCount(this.getCollection().size() + 2);
    },
    fieldChanged: function (inSender, inEvent) {
      var fieldNameWithNumber = inSender.getName();
      var newValue = inSender.getValue();
      // split the field name into the (alpha) prefix and the (numeric) suffix
      // XXX here's where we make use of the magical naming convention

      // REGEX: capture an alpha prefix as well as a numeric suffix
      var fieldNameSplit = fieldNameWithNumber.match(/(\D+)(\d+)/);


      var rowIndex = Number(fieldNameSplit[2]);
      var fieldName = fieldNameSplit[1];

      var updateObject = {};
      updateObject[fieldName] = newValue;


      /**
       * Update the model. Or add a new model if it's a new grid row
       */
      if (rowIndex >= this.getCollection().size()) {
        // add
        //var newModel = new XM.ProjectTask(updateObject, { isNew: true });
        var modelType = XV.util.stripModelNamePrefix(this.getDescriptor().modelType);
        var newModel = new XM[modelType](updateObject, { isNew: true });
        /**
         * Certain fields are required, so include these if they're not set
         */
        for (var i = 0; i < newModel.requiredAttributes.length; i++) {
          var reqAttr = newModel.requiredAttributes[i];
          if (!newModel.get(reqAttr)) {
            // XXX these hoops aren't scalable. Could we disable validation on this
            // new model until the user tries to persist?
            if (reqAttr === "dueDate") { continue; }
            if (reqAttr === "id") { continue; }
            var reqDefault = {};
            reqDefault[reqAttr] = "";
            newModel.set(reqDefault);
          }
        }

        this.getCollection().add(newModel);
      } else {
        // update
        this.getCollection().at(rowIndex).set(updateObject);
      }

      return true;
    }
  });
}());

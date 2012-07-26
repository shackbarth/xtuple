/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, enyo:true, _:true */
(function () {
  "use strict";

  enyo.kind({
    name: "XV.GridWidget",
    kind: enyo.Control,
    published: {
      collection: null,
      descriptor: null,
      customization: {}
    },
    events: {
      onSubmodelUpdate: ""
    },
    style: "height: 200px; width: 900px; margin-right: 5px; font-size: 12px;",
    components: [
      { kind: "onyx.GroupboxHeader", name: "title" },
      { kind: "Repeater", name: "gridRepeater", count: 0, onSetupItem: "setupRow", components: [
        {
          kind: "onyx.Groupbox",
          classes: "onyx-toolbar-inline",
          style: "background-color: white;",
          name: "gridRow"
        }
      ]}
    ],


    setupRow: function (inSender, inEvent) {
      var gridRow = inEvent.item.$.gridRow;

      for (var iField = 0; iField < this.getDescriptor().fields.length; iField++) {
        var fieldDesc = this.getDescriptor().fields[iField];
        var rawLabel = fieldDesc.label ? fieldDesc.label : fieldDesc.fieldName;
        var label = ("_" + rawLabel).loc();
        if (inEvent.index === 0) {
          /**
           * This is the label header at the top of each row
           */
          this.createComponent({
            container: gridRow,
            content: label,
            style: "text-weight: bold; border-width: 0px; width: " + fieldDesc.width + "px;"
          });
        } else {
          /**
           * These are the fields with the data
           */
          var field = this.createComponent({
            kind: XV.util.getFieldType(fieldDesc.fieldType),
            container: gridRow,
            name: fieldDesc.fieldName + (inEvent.index - 1),
            placeholder: label,
            style: "border: 0px; width: " + fieldDesc.width + "px;",
            onchange: "doFieldChanged"
          });

          /**
           * Used only for DropdownWidgets at the moment. If the descriptor mentions a model
           * type we want to send that down to the widget
           */
          if (fieldDesc.modelType) {
            field.setModelType(fieldDesc.modelType);
          }

          if (this.getCollection().size() + 1 > inEvent.index) {
            // row with data
            var model = this.getCollection().at(inEvent.index - 1);
            field.setValue(model.get(fieldDesc.fieldName));

            if (this.getCustomization().disallowEdit) {
              field.setDisabled(true);
            }
          } else {
            // this is the "new" row at the bottom

            // XXX this is a work in progress that must be generalized
            // XXX the functionality isn't actually hooked up yet
            if ( this.getCustomization().stampUser &&
                fieldDesc.fieldName === 'createdBy') {
              field.setValue("<YOU>");
              field.setDisabled(true);
            }
            if ( this.getCustomization().stampDate &&
                fieldDesc.fieldName === 'created') {
              field.setValue("<NOW>");
              field.setDisabled(true);
            }

          }
        }
      }
      /**
       * Add delete buttons for each row (but not for the "title" row or the "new" row)
       */
      if (!this.getCustomization().disallowEdit
          && inEvent.index !== 0
          && inEvent.index !== this.getCollection().size() + 1) {
        this.createComponent({
          kind: "onyx.Button",
          container: gridRow,
          name: "delete" + (inEvent.index - 1),
          content: "Delete",
          onclick: "deleteRow"
        });
      }
    },

    deleteRow: function (inSender, inEvent) {
      /**
       * Remove the row from the repeater
       * XXX the .parent.parent makes me uncomfortable here
       */
      this.$.gridRepeater.removeChild(inSender.parent.parent);
      this.$.gridRepeater.render();

      /**
       * Remove the model from the collection
       */

      var fieldNameWithNumber = inSender.getName();
      // split the field name into the (alpha) prefix and the (numeric) suffix
      // XXX here's where we make use of the magical naming convention
      // XXX must be a better way to get the row index of this button
      // REGEX: capture an alpha prefix as well as a numeric suffix
      // FIXME: these numbers get out of synch after one delete, so we
      // start deleting fields we don't want to
      // XXX either back each row with a model or renumber as necessary
      var fieldNameSplit = fieldNameWithNumber.match(/(\D+)(\d+)/);
      var rowIndex = Number(fieldNameSplit[2]);
      this.getCollection().at(rowIndex).destroy();
      this.doSubmodelUpdate();



    },

    descriptorChanged: function () {
      var boxDesc = this.getDescriptor();
      /**
       * First set the title for the box
       */
      this.$.title.setContent(boxDesc.title);

      /**
       * Render the first (label) row of the grid, even if we don't
       * have any data yet.
       */
      this.$.gridRepeater.setCount(1);
    },

    /**
     * A convenience function so that this object can be treated generally like an input
     */
    setValue: function (object) {
      this.setCollection(object);
    },
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    getValue: function () {
      return this.getCollection();
    },
    /**
     * Display the collection in the grid when it's passed in
     */
    collectionChanged: function () {
      // +2: 1 for the labels at the top, one for the entry row at the bottom
      this.$.gridRepeater.setCount(this.getCollection().size() + 2);
    },
    doFieldChanged: function (inSender, inEvent) {
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
        var modelType = XV.util.stripModelNamePrefix(this.getDescriptor().modelType);
        var newModel = new XM[modelType](updateObject, { isNew: true });
        newModel.initialize(updateObject, { isNew: true });
        /**
         * Certain fields are required, so include these if they're not set
         */
        for (var i = 0; i < newModel.requiredAttributes.length; i++) {
          var reqAttr = newModel.requiredAttributes[i];
          if (!newModel.get(reqAttr)) {
            if (reqAttr === "dueDate") { continue; } // XXX temp hack
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

      /**
       * Send up notice that there's been an update
       */
      this.doSubmodelUpdate();
    }
  });
}());

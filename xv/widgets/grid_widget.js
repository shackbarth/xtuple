/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true */
(function () {
  "use strict";

  enyo.kind({
    name: "XV.GridWidget",
    kind: enyo.Control,
    published: {
      collection: null,
      descriptor: null
    },
    events: {
      onModelUpdate: ""
    },
    style: "height: 200px; width: 700px; margin-right: 5px; font-size: 12px;",
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
        var label = ("_" + fieldDesc.label).loc();
        if (inEvent.index === 0) {
          /**
           * This is the label header at the top of each row
           */
          this.createComponent({
            container: gridRow,
            content: label,
            style: "text-weight: bold; border-width: 0px; width: " + fieldDesc.width + "px;",
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
          if (this.getCollection().size() + 1 > inEvent.index) {
            var model = this.getCollection().at(inEvent.index - 1);
            field.setValue(model.get(fieldDesc.fieldName));
          }
        }
      }
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
        //var newModel = new XM.ProjectTask(updateObject); // FIXME can't hardcode ProjectTask
        //newModel.setStatus(515); // nice try! but no. XXX
        this.getCollection().add(updateObject); //XXX this doens't quite work either
    } else {
        // update
        this.getCollection().at(rowIndex).set(updateObject);
      }

      /**
       * Send up notice that there's been an update
       */
      this.doModelUpdate();
    }
  });
}());

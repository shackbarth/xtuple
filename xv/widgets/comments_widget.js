/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true */
(function () {
  "use strict";

  enyo.kind({
    name: "XV.CommentsWidget",
    kind: enyo.Control,
    published: {
      collection: null,
      descriptor: null,
      fields: ["createdBy", "created", "text"]
    },
    events: {
      onModelUpdate: ""
    },
    style: "height: 200px; width: 700px; margin-right: 5px; font-size: 12px;",
    components: [
      { kind: "onyx.GroupboxHeader", name: "title" }
    ],


    renderWidget: function () {
      var iField, iRow, gridRow, fieldDesc, label;
      var boxDesc = this.getDescriptor();

      /**
       * First set the title for the box
       */
      this.$.title.setContent(boxDesc.title);

      /**
       * Row -1 is the header row. This lets us neatly number the real rows
       * starting at zero.
       */
      for (iRow = -1; iRow < 8; iRow++) {
        /**
         * This is the row that all the fields will be put in.
         */
        gridRow = this.createComponent({
          kind: "onyx.Groupbox",
          classes: "onyx-toolbar-inline",
          style: "background-color: white;",
          name: "gridRow" + iRow
        });

        for (iField = 0; iField < this.getFields().length; iField++) {
          fieldDesc = this.getFields()[iField];
          label = "_" + fieldDesc;
          if (iRow === -1) {
            /**
             * This is the label header at the top of each row
             */
            this.createComponent({
              container: gridRow,
              content: label.loc(),
              style: "text-weight: bold; border-width: 0px; width: " + fieldDesc.width + "px;"

            });
            continue;
          }
          /**
           * This is the label. The naming convention cribs from enyo's magical convention
           * XXX not sure if this is the best way to do it
           */
          this.createComponent({
            //kind: XV.util.getFieldType(fieldDesc.fieldType),
            container: gridRow,
            placeholder: fieldDesc,
            style: "border-width: 0px",
            onchange: "doFieldChanged",
            name: fieldDesc + iRow
          });
        }
      }
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
      var iRow;


      for (var iRow = 0; iRow < this.getCollection().size(); iRow++) {
        var model = this.getCollection().at(iRow);
        for (var iField = 0; iField < this.getFields().length; iField++) {
          var rowDescription = this.getFields()[iField];
          this.$[rowDescription + iRow].setContent(model.get(rowDescription));
        }
      }
      this.render();
    },
    doFieldChanged: function (inSender, inEvent) {
    }
  });
}());

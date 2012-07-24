/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, Globalize:true, _:true */
(function () {
  "use strict";

  enyo.kind({
    name: "XV.CommentsWidget",
    kind: enyo.Control,
    published: {
      collection: null,
      descriptor: null,
      fields: [
        { fieldName: "createdBy", label: "creator", type: "text" },
        { fieldName: "created", label: "date", type: "date" },
        { fieldName: "text", label: "text", type: "text"}
      ]
    },
    events: {
      onModelUpdate: ""
    },
    style: "height: 200px; width: 700px; margin-right: 5px; font-size: 12px;",
    components: [
      { kind: "onyx.GroupboxHeader", name: "title" },
      { kind: "Repeater", name: "commentsRepeater", count: 1, onSetupItem: "setupRow", components: [
        {
          kind: "onyx.Groupbox",
          classes: "onyx-toolbar-inline",
          style: "background-color: white;",
          name: "commentRow"
        }
      ]}
    ],

    setupRow: function (inSender, inEvent) {
      var commentRow = inEvent.item.$.commentRow;

      for (var iField = 0; iField < this.getFields().length; iField++) {
        var fieldDesc = this.getFields()[iField];
        var label = ("_" + fieldDesc.label).loc();
        if (inEvent.index === 0) {
          /**
           * This is the label header at the top of each row
           */
          this.createComponent({
            container: commentRow,
            content: label,
            style: "text-weight: bold; border-width: 0px;"

          });
        } else {
          /**
           * These are the fields with the data
           */
          var model = this.getCollection().at(inEvent.index - 1);
          var field = this.createComponent({
            container: commentRow,
            placeholder: label,
            style: "border: 0px;",
            onchange: "doFieldChanged"
          });
          field.setContent(this.formatContent(model.get(fieldDesc.fieldName), fieldDesc.type));
        }
      }
    },
    // this could be out of enyo
    formatContent: function (value, type) {
      if (type === 'date') {
        return Globalize.format(value, 'd');
      } else {
        return value;
      }
    },

    descriptorChanged: function () {
      /**
       * First set the title for the box
       */
      this.$.title.setContent(this.getDescriptor().title);
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
      // the +1 is there because the first row is labels
      this.$.commentsRepeater.setCount(this.getCollection().length + 1);
      this.render();
    },
    doFieldChanged: function (inSender, inEvent) {
    }
  });
}());

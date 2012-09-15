/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {
  
  enyo.kind({
    name: "XV.DocumentListRelations",
    kind: "XV.ListRelations",
    parentKey: "account",
    components: [
      {kind: "XV.ListItem", components: [
        {formatter: "formatType"},
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", formatter: "formatNumber"},
              {kind: "XV.ListAttr", formatter: "formatDate", fit: true,
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", formatter: "formatDescription"}
          ]}
        ]}
      ]}
    ],
    formatNumber: function () {
      return "number";
    },
    formatDate: function () {
      return "date";
    },
    formatDescription: function () {
      return "description";
    },
    formatType: function () {
      return "type";
    }
  });
  
  enyo.kind({
    name: "XV.DocumentsEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.PickerWidget", attr: "number"},
        {kind: "XV.PickerWidget", attr: "name"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.DocumentsBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-documents-box",
    title: "_documents".loc(),
    editor: "XV.DocumentsEditor",
    parentKey: "account",
    listRelations: "XV.DocumentListRelations"
  });

}());

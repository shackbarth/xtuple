/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.SortPopup",
    kind: "onyx.Popup",
    classes: "xv-sort-popup",
    centered: true,
    floating: true,
    modal: true,
    autoDismiss: false,
    scrim: true,
    components: [
      {kind: "FittableRows", components: [
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "Sort by..."},
          {kind: "FittableColumns", components: [
            {kind: "XV.SortPicker", name: "sortPicker1"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker1"}
          ]},
        ]},
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "Then..."},
          {kind: "FittableColumns", components: [
            {kind: "XV.SortPicker", name: "sortPicker2"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker2"}
          ]},
        ]},
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "Then..."},
          {kind: "FittableColumns", components: [
            {kind: "XV.SortPicker", name: "sortPicker3"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker3"}
          ]},
        ]},
        {classes: "xv-button-bar", components: [
          {kind: "onyx.Button", name: "sortListButton", ontap: "sortList",
            content: "_sort".loc()},
          {kind: "onyx.Button", name: "cancelButton", ontap: "closePopup",
            content: "_cancel".loc()}
        ]}
      ]}
    ],
    closePopup: function (inSender, inEvent) {
      this.hide();
    },
    sortList: function (inSender, inEvent) {

    }
  });

}());

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
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "_sort".loc() },
        //{kind: "XV.SortPicker", name: "primaryPicker"},
        //{kind: "XV.SortPicker", name: "secondaryPicker"},
        {kind: "FittableRows", components: [
          {kind: "XV.SortTypePicker", name: "sortTypePicker"}
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
      if (this.primaryPicker.id === this.secondaryPicker.id) {
        this.secondaryPicker.id = "N";
      }
    }
  });

}());

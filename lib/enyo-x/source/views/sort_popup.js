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
    published: {
      list: null
    },
    components: [
      {kind: "FittableRows", components: [
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "Sort by..."},
          {kind: "FittableColumns", style: "text-align: center;", components: [
            {kind: "XV.SortPicker", name: "sortPicker1"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker1"}
          ]},
        ]},
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "Then..."},
          {kind: "FittableColumns", style: "text-align: center;", components: [
            {kind: "XV.SortPicker", name: "sortPicker2"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker2"}
          ]},
        ]},
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "Then..."},
          {kind: "FittableColumns", style: "text-align: center;", components: [
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
    setPickerStrings: function (inSender, inEvent) {
      var attributes = this.list.getSearchableAttributes();
      this.$.sortPicker1.setComponentsList(attributes);
      this.$.sortPicker2.setComponentsList(attributes);
      this.$.sortPicker3.setComponentsList(attributes);
    },
    sortList: function (inSender, inEvent) {
    //calling getSelected on this.$.sortPicker1.$.picker returns undefined
    // our itemSelected function on this.$.sortPicker1 doesn't work either
      var attr1 = "number",
        attr2 = "none",
        attr3 = "none",
        attr1type = "descending",
        attr2type = "descending",
        attr3type = "descending",
        query = [];

      console.log(this.$.sortPicker1.itemSelected());

      if (attr1 !== "none") {
        query.push({attribute: attr1, attr1type: true});
      }
      if (attr2 !== "none") {
        query.push({attribute: attr2, attr2type: true});
      }
      if (attr3 !== "none") {
        query.push({attribute: attr3, attr3type: true});
      }

      if (attr1 === "none" && attr2 === "none" && attr3 === "none") {
        query.push({attribute: "id"});
      }

      this.list.setQuery({orderBy: query});
      this.list.reset();
      this.closePopup();
    }
  });

}());

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
      list: null,
      nav: null
    },
    components: [
      {kind: "FittableRows", components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_sortBy".loc()},
          {kind: "FittableColumns", components: [
            {kind: "XV.SortPicker", name: "sortPicker1"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker1"}
          ]},
        ]},
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_then".loc()},
          {kind: "FittableColumns", components: [
            {kind: "XV.SortPicker", name: "sortPicker2"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker2"}
          ]},
        ]},
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_then".loc()},
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
    getSort: function (inSender, inEvent) {
      var params,
        lastSort,
        kindAndList = this.kind + "_" + this.list.name,
        defaultParams = {
          attr1: picker1.$.picker.getComponents()[2],
          attr2: picker2.$.picker.getComponents()[1],
          attr3: picker3.$.picker.getComponents()[1],
          type1: typePicker1.$.picker.getComponents()[1],
          type2: typePicker2.$.picker.getComponents()[1],
          type3: typePicker3.$.picker.getComponents()[1]
        };

      lastSort = XT.DataSource.getUserPreference(kindAndList);

      // if there is a last filter for this kind,
      // and it isn't null, set the filter picker.
      if (lastSort && lastSort !== "null") {
        lastSort = JSON.parse(lastSort);
      }

      // if there is no last sort, take the defaults
      params = lastSort ? lastSort : defaultParams;

      this.setPickerSelections(params);
    },
    setPickerSelections: function (params) {
      //do the selecting here based off params
    },
    setPickerStrings: function (inSender, inEvent) {
      var attrs = [],
        picker1 = this.$.sortPicker1,
        picker2 = this.$.sortPicker2,
        picker3 = this.$.sortPicker3,
        typePicker1 = this.$.sortTypePicker1,
        typePicker2 = this.$.sortTypePicker2,
        typePicker3 = this.$.sortTypePicker3;

      _.each(this.list.$, function(enyoObj) {
        if (enyoObj.attr) {
          attrs.push(enyoObj.attr);
        }
      });

      picker1.setComponentsList(attrs);
      picker2.setComponentsList(attrs);
      picker3.setComponentsList(attrs);

      this.getSort();
    },
    sortList: function (inSender, inEvent) {
    //calling getSelected on this.$.sortPicker1.$.picker returns undefined
    // our itemSelected function on this.$.sortPicker1 doesn't work either
      var attr1 = this.$.sortPicker1.attr,
        attr2 = this.$.sortPicker2.attr,
        attr3 = this.$.sortPicker3.attr,
        attr1type = this.$.sortTypePicker1.getValueToString().toLowerCase(),
        attr2type = this.$.sortTypePicker2.getValueToString().toLowerCase(),
        attr3type = this.$.sortTypePicker3.getValueToString().toLowerCase(),
        query = [];

      if (attr1 !== "none" && attr1) {
        query.push({attribute: attr1, descending: attr1type === "descending"});
      }
      if (attr2 !== "none" && attr2) {
        query.push({attribute: attr2, descending: attr2type === "descending"});
      }
      if (attr3 !== "none" && attr3) {
        query.push({attribute: attr3, descending: attr3type === "descending"});
      }

      if ((attr1 === "none" || !attr1) &&
          (attr2 === "none" || !attr2) &&
          (attr3 === "none" || !attr3)) {
        query.push({attribute: "id"});
      }

      //handle sort user pref saving


      this.getList().getQuery().orderBy = query;
      this.getNav().requery();
      this.closePopup();
    }
  });

}());

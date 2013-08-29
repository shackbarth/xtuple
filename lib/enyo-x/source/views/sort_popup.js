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
    /**
      Get previous sort information from the User Preference table
      and set this information and set the picker selections.
    */
    getSort: function (inSender, inEvent) {
      var params,
        lastSort,
        kindAndList = this.kind + "_" + this.list.name;

      lastSort = XT.DataSource.getUserPreference(kindAndList);
      if (lastSort && lastSort !== "null") {
        params = JSON.parse(lastSort);
      }
      else {
        params = {listName: this.list.name};
      }
      this.setPickerSelections(params);
    },
    /**
      Set sort and type pickers with values in params object.
      The attribute values in this object are separate numbered
      values (attr1, attr2, attr3, ...) (not arrays of values)
      that are set into corresponding pickers.
    */
    setPickerSelections: function (params) {
      var picker, param,
        sortPickers, typePickers,
        sortPicker, typePicker,
        sort, type;

      // Create arrays of sort and type pickers
      sortPickers = _.filter(_.values(this.$), function (widget) {
        return widget.kind === "XV.SortPicker";
      });
      typePickers = _.filter(_.values(this.$), function (widget) {
        return widget.kind === "XV.SortTypePicker";
      });

      // Each sort picker will always have a corresponding type
      // picker so they can be taken care of in the same loop.
      for (var i = 0; i < sortPickers.length; i++) {
        sortPicker = sortPickers[i];
        typePicker = typePickers[i];
        sort = params["attr" + (i + 1)] || sortPicker.$.picker.getComponents()[1].attr;
        type = params["type" + (i + 1)] || typePicker.$.picker.getComponents()[1].attr;
        sortPicker.$.picker.setSelected(sortPicker.findItemByAttr(sort));
        typePicker.$.picker.setSelected(typePicker.findItemByAttr(type));
      }
    },
    /**
      Gets the list of sortable attributes from the list, filters by the
      fields that are currently seen and sets the component list in the pickers.
    */
    setPickerStrings: function (inSender, inEvent) {
      var attrs = [],
        allAttributes = [],
        currentAttributes = [];

      // Get the full list of sortable attribute names from the list
      allAttributes = this.list.getDisplayAttributes();
      // Get the array of list attribute kinds currently being displayed
      currentAttributes =
        _.map(this.list.getCurrentListAttributes(), function (current) {
          return current.attr;
        });

      // filter the list of attributes to only inlude those viewable in the current list
      attrs = _.intersection(allAttributes, currentAttributes);

      // Set the list of attribute values for the pickers
      _.each(this.$, function (widget) {
        if (widget.kind === "XV.SortPicker") {
          widget.setComponentsList(attrs);
        }
      });

      this.getSort();
    },
    /**
      Gets the sort parameters from the pickers and applies the sort to the list
      query. Saves the selected sort parameters as a user preference.
    */
    sortList: function (inSender, inEvent) {
      var attrs = [],
        types = [],
        query = [],
        options,
        params = {},
        kindAndList = this.kind + "_" + this.list.name,
        operation,
        payload;

      _.each(this.$, function (widget) {
        if (widget.kind === "XV.SortPicker") {
          if (widget.attr) {
            attrs.push(widget.attr);
          }
        } else if (widget.kind === "XV.SortTypePicker") {
          if (widget.attr) {
            types.push(widget.getValueToString().toLowerCase());
          }
        }
      });

      for (var i = 0; i < attrs.length; i++) {
        query.push({attribute: attrs[i], descending: types[i] === "descending"});
        // Add these selections to the params object
        // TODO: these should be saved as an array of values instead of separated
        params["attr" + (i + 1)] = attrs[i];
        types["type" + (i + 1)] = types[i];
      }
      // ***this id attribute must always be added to the end of all sorts
      query.push({attribute: "id"});

      // Do a dispatch to save the params as a User Preference
      params.listName = this.list.name;
      payload = JSON.stringify(params);
      operation = XT.DataSource.getUserPreference(kindAndList) ? "replace" : "add";
      XT.DataSource.saveUserPreference(kindAndList, payload, operation);
      XT.session.preferences.set(kindAndList, payload);

      //refresh list and close popup
      this.getList().getQuery().orderBy = query;
      this.getNav().requery();
      this.closePopup();
    }
  });

}());
